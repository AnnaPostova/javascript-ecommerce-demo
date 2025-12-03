(function () {
    const DATA_URL = "../assets/data.json";

    let currentProduct = null;

    /* ========= Cart helpers ========= */

    /* global CART_STORAGE_KEY */

    function loadCart() {
        try {
            const raw = localStorage.getItem(CART_STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }

    function updateHeaderCartCount() {
        const cart = loadCart();
        const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        const counterEl = document.querySelector("[data-cart-count]");

        if (!counterEl) return;

        if (totalQty > 0) {
            counterEl.hidden = false;
            counterEl.textContent = String(totalQty);
        } else {
            counterEl.hidden = true;
            counterEl.textContent = "0";
        }
    }

    /* ========= Product loading ========= */
    async function loadProduct() {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get("id");

        if (!productId) return;

        try {
            const res = await fetch(DATA_URL);
            const json = await res.json();
            const products = Array.isArray(json) ? json : json.data || [];

            currentProduct = products.find(
                (p) => String(p.id) === String(productId)
            );

            if (!currentProduct) return;

            renderProduct(currentProduct);
        } catch (err) {
            console.error("Failed to load product data", err);
        }
    }

    function renderProduct(product) {
        const nameEl = document.querySelector("[data-pdp-name]");
        const imgEl = document.querySelector("[data-pdp-image]");
        const priceEl = document.querySelector("[data-pdp-price]");

        if (nameEl) nameEl.textContent = product.name;
        if (imgEl) {
            imgEl.src = product.imageUrl;
            imgEl.alt = product.name;
        }
        if (priceEl) priceEl.textContent = `$${product.price}`;

        renderRating(product);
    }

    /* ========= Rating ========= */
    function renderRating(product) {
        const ratingEl = document.querySelector("[data-pdp-rating]");
        const reviewsCountEl = document.querySelector("[data-pdp-reviews-count]");

        if (!ratingEl || !product) return;

        const rating = Number(product.rating) || 0;
        const maxStars = 5;

        const fullStars = Math.floor(rating);
        const emptyStars = maxStars - fullStars;

        ratingEl.innerHTML = "";

        for (let i = 0; i < fullStars; i++) {
            const star = document.createElement("span");
            star.className = "pdp-star pdp-star--full";
            ratingEl.appendChild(star);
        }

        for (let i = 0; i < emptyStars; i++) {
            const star = document.createElement("span");
            star.className = "pdp-star pdp-star--empty";
            ratingEl.appendChild(star);
        }

        if (reviewsCountEl) {
            reviewsCountEl.textContent = "1";
        }

        syncReviewBlockRating(rating);
    }

    function syncReviewBlockRating(rating) {
        const reviewRatingEl = document.querySelector(".pdp-review__stars");
        if (!reviewRatingEl) return;

        const maxStars = 5;
        const fullStars = Math.floor(rating);
        const emptyStars = maxStars - fullStars;

        reviewRatingEl.innerHTML = "";

        for (let i = 0; i < fullStars; i++) {
            const star = document.createElement("span");
            star.className = "pdp-star pdp-star--full";
            reviewRatingEl.appendChild(star);
        }

        for (let i = 0; i < emptyStars; i++) {
            const star = document.createElement("span");
            star.className = "pdp-star pdp-star--empty";
            reviewRatingEl.appendChild(star);
        }
    }

    /* ========= Quantity ========= */
    function initQuantityControl() {
        const minusBtn = document.querySelector("[data-qty-minus]");
        const plusBtn = document.querySelector("[data-qty-plus]");
        const input = document.querySelector("[data-qty-input]");

        if (!minusBtn || !plusBtn || !input) return;

        const MIN_QTY = 1;

        minusBtn.addEventListener("click", () => {
            const current = Number(input.value) || MIN_QTY;
            const next = Math.max(MIN_QTY, current - 1);
            input.value = String(next);
        });

        plusBtn.addEventListener("click", () => {
            const current = Number(input.value) || MIN_QTY;
            input.value = String(current + 1);
        });

        input.addEventListener("input", () => {
            const value = Number(input.value);
            if (!Number.isFinite(value) || value < MIN_QTY) {
                input.value = String(MIN_QTY);
            }
        });
    }

    /* ========= Add to cart ========= */
    function initAddToCart() {
        const btn = document.querySelector("[data-pdp-add-to-cart]");
        const qtyInput = document.querySelector("[data-qty-input]");

        if (!btn || !qtyInput) return;

        btn.addEventListener("click", () => {
            if (!currentProduct) return;

            const quantity = Math.max(1, Number(qtyInput.value) || 1);
            const cart = loadCart();

            const existing = cart.find((item) => item.id === currentProduct.id);

            if (existing) {
                existing.quantity += quantity;
            } else {
                cart.push({
                    id: currentProduct.id,
                    name: currentProduct.name,
                    price: currentProduct.price,
                    imageUrl: currentProduct.imageUrl,
                    quantity
                });
            }

            saveCart(cart);
            updateHeaderCartCount();
        });
    }

    /* ========= Tabs ========= */
    function initTabs() {
        const tabButtons = document.querySelectorAll("[data-pdp-tab]");
        const panels = document.querySelectorAll("[data-pdp-panel]");

        if (!tabButtons.length || !panels.length) return;

        tabButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const target = btn.dataset.pdpTab;

                tabButtons.forEach((b) =>
                    b.classList.toggle("pdp-tabs__btn--active", b === btn)
                );

                panels.forEach((panel) => {
                    panel.classList.toggle(
                        "pdp-tabs__panel--active",
                        panel.dataset.pdpPanel === target
                    );
                });
            });
        });
    }

    /* ========= Review form ========= */
    function initReviewForm() {
        const reviewForm = document.querySelector("[data-review-form]");
        if (!reviewForm) return;

        const messageEl = reviewForm.querySelector("[data-review-message]");
        const reviewTextarea = reviewForm.querySelector("#reviewText");
        const reviewLabel = reviewForm.querySelector("label[for='reviewText']");

        const setInvalid = (input) => {
            if (!input) return;
            input.classList.add("form__input--invalid");
        };

        const clearInvalid = (input) => {
            if (!input) return;
            input.classList.remove("form__input--invalid");
        };

        if (reviewTextarea && reviewLabel) {
            const toggleReviewLabel = () => {
                const hasValue = reviewTextarea.value.trim().length > 0;
                reviewLabel.classList.toggle("review-form__label--hidden", hasValue);
            };

            reviewTextarea.addEventListener("input", toggleReviewLabel);
            reviewTextarea.addEventListener("blur", toggleReviewLabel);
        }

        const showMessage = (text, isError = false) => {
            if (!messageEl) return;
            messageEl.textContent = text || "";
            messageEl.classList.toggle("review-form__message--error", isError);
        };

        const isValidEmail = (email) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

        const groups = reviewForm.querySelectorAll(".review-form__group");

        const toggleLabel = (input, label) => {
            const hasValue = input.value.trim().length > 0;
            label.classList.toggle("review-form__label--hidden", hasValue);
        };

        groups.forEach((group) => {
            const input = group.querySelector("input, textarea");
            const label = group.querySelector("[data-floating-label]");

            if (!input || !label) return;

            input.addEventListener("input", () => {
                toggleLabel(input, label);
                clearInvalid(input);
            });

            input.addEventListener("blur", () => toggleLabel(input, label));

            toggleLabel(input, label);
        });

        reviewForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const formData = new FormData(reviewForm);

            const rating = formData.get("rating");

            const reviewRaw = formData.get("review");
            const nameRaw = formData.get("name");
            const emailRaw = formData.get("email");

            const review = reviewRaw ? reviewRaw.trim() : "";
            const name = nameRaw ? nameRaw.trim() : "";
            const email = emailRaw ? emailRaw.trim() : "";

            reviewForm.querySelectorAll("input, textarea").forEach(clearInvalid);

            if (!rating) {
                showMessage("Please rate the product before submitting the review.", true);
                const ratingInputs = reviewForm.querySelectorAll("input[name='rating']");
                ratingInputs.forEach(setInvalid);
                return;
            }

            if (!review) {
                const el = reviewForm.querySelector("#reviewText");
                setInvalid(el);
                showMessage("Please write your review.", true);
                return;
            }

            if (!name) {
                const el = reviewForm.querySelector("input[name='name']");
                setInvalid(el);
                showMessage("Please enter your name.", true);
                return;
            }

            if (!email || !isValidEmail(email)) {
                const el = reviewForm.querySelector("input[name='email']");
                setInvalid(el);
                showMessage("Please enter a valid email address.", true);
                return;
            }

            showMessage("Thank you! Your review has been submitted successfully.");

            reviewForm.reset();

            if (reviewLabel) {
                reviewLabel.classList.remove("review-form__label--hidden");
            }
        });
    }

    /* ========= Init ========= */
    async function initProductPage() {
        updateHeaderCartCount();
        initQuantityControl();
        initTabs();
        await loadProduct();
        initAddToCart();
        initReviewForm();
    }

    document.addEventListener("DOMContentLoaded", initProductPage);
})();

