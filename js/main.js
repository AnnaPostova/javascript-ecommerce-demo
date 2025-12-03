function initActiveNavItem() {
    const currentPage = document.body.dataset.page;
    if (!currentPage) return;

    const activeItem = document.querySelector(
        `.navigation__item[data-page="${currentPage}"]`
    );
    if (activeItem) {
        activeItem.classList.add("navigation__item--active");
    }
}

function initBurger() {
    const burgerBtn = document.querySelector("[data-burger]");
    const nav = document.querySelector(".navigation");

    if (!burgerBtn || !nav) return;

    burgerBtn.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("navigation--open");
        burgerBtn.setAttribute("aria-expanded", String(isOpen));
    });
}

function injectLoginModalHtml() {
    const loginModalHtml = `<div class="login-modal" id="loginModal" hidden>
        <div class="login-modal__overlay" data-close-login></div>

        <div class="login-modal__block" role="dialog" aria-modal="true">
            <button class="login-modal__close" aria-label="Close login" data-close-login>&times;</button>

            <form class="form login-form" novalidate>
                
                <label class="form__label login-form__label" for="loginEmail">
                    Email address <span aria-hidden="true">*</span>
                </label>
                <input id="loginEmail" type="email" class="form__input login-form__input" autocomplete="username" required>
                <p class="form__error login-form__error" id="loginEmailError" aria-live="polite"></p>

                <label class="form__label login-form__label" for="loginPassword">
                    Password <span aria-hidden="true">*</span>
                </label>
                <div class="login-form__password-container">
                    <input id="loginPassword" type="password" class="form__input login-form__input" autocomplete="current-password" required>
                    <button type="button" class="login-form__toggle-pass" aria-label="Show password"></button>
                </div>
                <p class="form__error login-form__error" id="loginPasswordError" aria-live="polite"></p>

                <div class="login-form__options">
                    <label class="login-form__checkbox">
                        <input type="checkbox" name="rememberMe" class="login-form__checkbox-input">
                        <span class="login-form__checkbox-box" aria-hidden="true"></span>
                        <span class="login-form__checkbox-text">Remember me</span>
                    </label>

                    <a href="#" class="login-form__forgot-pass">Forgot Your Password?</a>
                </div>

                <button type="submit" class="form__submit login-form__submit primary-button">Log In</button>
            </form>
        </div>
    </div>`;

    document.body.insertAdjacentHTML("beforeend", loginModalHtml);
}

function injectCatalogFilters() {
    const currentPage = document.body.dataset.page;
    if (currentPage !== "catalog") return;

    const filterHTML = `<section class="filters" aria-label="Catalog filters">
            <form id="catalog-filters" class="filters__form">
                <fieldset class="filters__fieldset">
                    <div class="filters__row">
                        <div class="filters__control">
                            <label for="filter-size" class="filters__label">Size</label>
                            <select id="filter-size" name="size"
                                    class="filters__select">
                                <option value="">Choose option</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="S-L">S-L</option>
                                <option value="S, M, XL">S, M, XL</option>
                            </select>
                        </div>

                        <div class="filters__control">
                            <label for="filter-color" class="filters__label">Color</label>
                            <select id="filter-color" name="color"
                                    class="filters__select">
                                <option value="">Choose option</option>
                                <option value="red">Red</option>
                                <option value="blue">Blue</option>
                                <option value="green">Green</option>
                                <option value="black">Black</option>
                                <option value="grey">Grey</option>
                                <option value="yellow">Yellow</option>
                                <option value="pink">Pink</option>
                            </select>
                        </div>

                        <div class="filters__control">
                            <label for="filter-category" class="filters__label">Category</label>
                            <select id="filter-category" name="category"
                                    class="filters__select">
                                <option value="">Choose option</option>
                                <option value="carry-ons">Carry-ons</option>
                                <option value="suitcases">Suitcases</option>
                                <option value="luggage sets">Luggage sets</option>
                                <option value="kids' luggage">Kids' luggage</option>
                            </select>
                        </div>

                        <div class="filters__control filters__control--inline">
                            <label for="filter-sale" class="filters__label">
                                Sale
                            </label>
                            <input id="filter-sale" type="checkbox" name="salesStatus" value="true" class="filters__checkbox-input">
                            <span class="filters__checkbox-custom"></span>
                        </div>
                    </div>
                    <div class="filters__actions">
                        <button type="reset" class="filters__button filters__button--clear">
                            Clear filters
                        </button>
                        <button type="button" class="filters__button filters__button--hide">
                            Hide filters
                        </button>
                    </div>
                </fieldset>
            </form>
        </section>`;
    const filterContainer = document.querySelector(".filters-container");
    if (filterContainer) {
        filterContainer.innerHTML = filterHTML;
    }
}

// ========== Header / Footer / Offer Banner ==========
function renderHeader() {
    const headerHtml = `
<header class="header">
    <div class="header__top-block">
        <button 
            class="header__burger" 
            type="button" 
            aria-label="Open navigation"
            aria-expanded="false"
            aria-controls="main-navigation"
            data-burger>
            <span class="header__burger-line"></span>
            <span class="header__burger-line"></span>
            <span class="header__burger-line"></span>
        </button>
        <div class="header__social-icons header__social-icons--desktop">
            <a href="https://www.facebook.com/" aria-label="Facebook link">
                <img src="/src/assets/images/header/facebook.svg" alt="" width="20" height="20">
            </a>
            <a href="https://x.com/" aria-label="Twitter link">
                <img src="/src/assets/images/header/twitter.svg" alt="" width="20" height="20">
            </a>
            <a href="https://www.instagram.com/" aria-label="Instagram link">
                <img src="/src/assets/images/header/instagram.svg" alt="" width="20" height="20">
            </a>
        </div>

        <a href="/index.html" class="header__logo">
            <span class="header__logo-icon">
                <img src="/src/assets/images/header/logo.png" alt="Logo Icon" width="35" height="35">
            </span>
            <span class="header__logo-text">Best Shop</span>
        </a>

        <div class="header__controls">
            <a href="#" aria-label="Account link">
                <img src="/src/assets/images/header/user.svg" alt="" width="30" height="34">
            </a>
            <a class="header-cart" href="/src/html/cart.html" aria-label="Shopping Cart link">
                <img src="/src/assets/images/header/shopping-cart.svg" alt="" width="34" height="34">
                <span class="header-cart__count" data-cart-count hidden>0</span>
            </a>
        </div>
    </div>
    <nav class="navigation" aria-label="Navigation" id="main-navigation">
        <ul class="navigation__list">
            <li class="navigation__item" data-page="home">
                <a href="/index.html">Home</a>
            </li>
            <li class="navigation__item navigation__item--has-dropdown" data-page="catalog">
                <a class="navigation__link navigation__link--with-arrow" href="/src/html/catalog.html">
                    Catalog
                </a>
            </li>
            <li class="navigation__item" data-page="about">
                <a href="/src/html/about.html">About Us</a>
            </li>
            <li class="navigation__item" data-page="contact">
                <a href="/src/html/contact.html">Contact Us</a>
            </li>
        </ul>
        <div class="header__social-icons header__social-icons--mobile">
            <a href="https://www.facebook.com/" aria-label="Facebook link">
                <img src="/src/assets/images/header/facebook.svg" alt="" width="20" height="20">
            </a>
            <a href="https://x.com/" aria-label="Twitter link">
                <img src="/src/assets/images/header/twitter.svg" alt="" width="20" height="20">
            </a>
            <a href="https://www.instagram.com/" aria-label="Instagram link">
                <img src="/src/assets/images/header/instagram.svg" alt="" width="20" height="20">
            </a>
        </div>
    </nav>
</header>
    `;

    const headerContainer = document.getElementById("header-container");
    if (headerContainer) {
        headerContainer.innerHTML = headerHtml;
    }

    initActiveNavItem();
    initBurger();
    injectLoginModalHtml();
    injectCatalogFilters();
}

function renderFooter() {
    const footerHtml = `
<footer class="footer">
    <section class="benefits" aria-labelledby="benefits-title">
        <div class="benefits__container">
            <h2 class="benefits__title" id="benefits-title">Our Benefits</h2>
            <ul class="benefits__list">
                <li class="benefits__item">
                    <img src="/src/assets/images/footer/airplane.png" alt="" aria-hidden="true" width="60" height="60">
                    <p>Velit nisl sodales eget donec quis, volutpat orci.</p>
                </li>
                <li class="benefits__item">
                    <img src="/src/assets/images/footer/truck.png" alt="" aria-hidden="true" width="60" height="60">
                    <p>Dolor eu varius. Morbi fermentum velit nisl.</p>
                </li>
                <li class="benefits__item">
                    <img src="/src/assets/images/footer/coins.png" alt="" aria-hidden="true" width="60" height="60">
                    <p>Malesuada fames ac ante ipsum primis in faucibus.</p>
                </li>
                <li class="benefits__item">
                    <img src="/src/assets/images/footer/education.png" alt="" aria-hidden="true" width="60" height="60">
                    <p>Nisl sodales eget donec quis, volutpat orci.</p>
                </li>
            </ul>
        </div>
    </section>

    <section class="footer__content">
        <div class="footer__first-container">
            <div class="footer__links">
                <div class="footer__block">
                    <h3 class="footer__title"><a href="/src/html/about.html">About Us</a></h3>
                    <ul>
                        <li><a href="#">Organisation</a></li>
                        <li><a href="#">Partners</a></li>
                        <li><a href="#">Clients</a></li>
                    </ul>
                </div>
                <div class="footer__block">
                    <h3 class="footer__title"><a href="#">Interesting Links</a></h3>
                    <ul>
                        <li><a href="#">Photo Gallery</a></li>
                        <li><a href="#">Our Team</a></li>
                        <li><a href="#">Socials</a></li>
                    </ul>
                </div>
                <div class="footer__block">
                    <h3 class="footer__title"><a href="#">Achievements</a></h3>
                    <ul>
                        <li><a href="#">Winning Awards</a></li>
                        <li><a href="#">Press</a></li>
                        <li><a href="#">Our Amazing Clients</a></li>
                    </ul>
                </div>
                <div class="footer__block footer__block--shipping-info">
                    <h3 class="footer__title"><a href="#">Shipping Information</a></h3>
                    <p>Nulla eleifend pulvinar purus, molestie euismod odio imperdiet ac. Ut sit amet erat nec nibh 
                        rhoncus varius in non lorem. Donec interdum, lectus in convallis pulvinar, enim elit porta sapien, 
                        vel finibus erat felis sed neque. Etiam aliquet neque sagittis erat tincidunt aliquam.
                    </p>
                </div>
            </div>
        </div>
        <div class="footer__second-container">
            <div class="footer__block">
                <h3 class="footer__title"><a href="/src/html/contact.html">Contact Us</a></h3>
                <p>Bendum dolor eu varius. Morbi fermentum velitsodales egetonec. volutpat orci. Sed ipsum felis, tristique egestas et, convallis ac velitn consequat nec luctus.</p>
            </div>
            <address>
                <ul class="contacts">
                    <li>
                        <a href="tel:+632366322">
                            <img src="/src/assets/images/footer/phone-icon.svg" alt="Phone Icon">
                            <span>Phone: (+63) 236 6322</span>
                        </a>
                    </li>
                    <li>
                        <a href="mailto:public@news.com">
                            <img src="/src/assets/images/footer/mail-icon.svg" alt="Mail Icon">
                            <span>public@news.com</span>
                        </a>
                    </li>
                    <li>
                        <img src="/src/assets/images/footer/clock-icon.svg" alt="Clock Icon">
                        <p>Mon–Fri: 10am–6pm<br>Sat–Sun: 10am–6pm</p>
                    </li>
                    <li>
                        <img src="/src/assets/images/footer/location-icon.svg" alt="Location Icon">
                        <p>639 Jade Valley, Washington Dr</p>
                    </li>
                </ul>
            </address>
        </div>
    </section>

    <div class="footer__copyright">
        <p>&copy; Copyright 2025</p>
    </div>
</footer>
    `;

    const footerContainer = document.getElementById("footer-container");
    if (footerContainer) {
        footerContainer.innerHTML = footerHtml;
    }
}

function renderOfferBanner() {
    const offerBannerHtml = `
    <section class="offer-banner">
        <div class="offer-banner__container">
            <div class="offer-banner__discount">
                <h2 class="offer-banner__value">50%</h2>
                <p class="offer-banner__text">Curabitur vulputate arcu odio, ac facilisis diam.</p>
            </div>
            <div class="offer-banner__content">
                <h2 class="offer-banner__title">Offer Of The Month</h2>
                <p class="offer-banner__description">
                    Curabitur vulputate arcu odio, ac facilisis diam accumsan ut.Ut imperdiet et leo in vulputate.
                </p>
                <button class="offer-banner__button primary-button">Get Offer Today</button>
            </div>
        </div>
    </section>
    `;
    const offerBannerContainer = document.getElementById("offer-banner-container");
    if (offerBannerContainer) {
        offerBannerContainer.innerHTML = offerBannerHtml;
    }
}

// ========== Cart utils ========================
const CART_STORAGE_KEY = "cartItems";

function loadCart() {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.error("Cannot parse cart from localStorage", e);
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function getCartTotalQuantity(cart) {
    return cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

function updateCartCounter() {
    const counter = document.querySelector("[data-cart-count]");
    if (!counter) return;

    const cart = loadCart();
    const totalQuantity = getCartTotalQuantity(cart);

    if(totalQuantity > 0) {
        counter.hidden = false;
        counter.textContent = totalQuantity;
    } else {
        counter.hidden = true;
        counter.textContent = "0";
    }
}

function addToCart(productData, quantity) {
    const { id, name, size, color } = productData || {};
    if (!id) return;

    const cart = loadCart();
    quantity = Number(quantity) || 1;

    const repeatedItem = cart.find(item =>
        item.name === name &&
        item.size === size &&
        item.color === color
    );

    if (repeatedItem) {
        repeatedItem.quantity = (Number(repeatedItem.quantity) || 0) + quantity;
    } else {
        cart.push({
            id,
            name,
            size,
            color,
            quantity: quantity
        });
    }

    saveCart(cart);
    updateCartCounter();
}

// ========== Product Carousels ===============================
function getVisibleSlidesCount() {
    const w = window.innerWidth;

    if (w <= 544) return 1;
    if (w <= 768) return 2;
    if (w <= 1024) return 3;
    return 4;
}

function createProductCard(product) {
    const articleBlock = document.createElement("article");
    articleBlock.classList.add("product-card");
    articleBlock.dataset.id = product.id;

    articleBlock.innerHTML = `
        <a href="/src/html/product-details.html?id=${product.id}" class="product-card__link">
            <figure class="product-card__image">
                ${product.salesStatus 
                        ? "<span class='product-card__tag' aria-label='On sale'>Sale</span>"
                        : ""
                }
                <img src="${product.imageUrl}" alt="${product.name}">
            </figure>
            <div class="product-card__description">
                <h3 class="product-card__name">${product.name}</h3>
                <p class="product-card__price">$${product.price}</p>
            </div>
        </a>
        <button class="product-card__button primary-button" type="button"
            data-add-to-cart
            data-product-id="${product.id}"
            data-product-name="${product.name}"
            data-product-size="${product.size}"
            data-product-color="${product.color}">
            Add To Cart
        </button>
    `;

    return articleBlock;
}

function displayProductsForBlock(products, blockName, containerId) {
    const host = document.getElementById(containerId);
    if (!host) return;

    const filtered = products.filter(
        (product) => Array.isArray(product.blocks) && product.blocks.includes(blockName)
    );
    if (!filtered.length) return;

    const randomized = [...filtered];
    for (let i = randomized.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [randomized[i], randomized[j]] = [randomized[j], randomized[i]];
    }

    host.innerHTML = "";

    const carousel = document.createElement("div");
    carousel.className = "product-carousel";

    carousel.innerHTML = `
        <button type="button"
                class="product-carousel__btn product-carousel__btn--prev"
                aria-label="Previous products">
            ❮
        </button>

        <div class="product-carousel__viewport">
            <div class="product-carousel__track"></div>
        </div>

        <button type="button"
                class="product-carousel__btn product-carousel__btn--next"
                aria-label="Next products">
            ❯
        </button>
    `;

    host.appendChild(carousel);

    const track = carousel.querySelector(".product-carousel__track");
    const btnPrev = carousel.querySelector(".product-carousel__btn--prev");
    const btnNext = carousel.querySelector(".product-carousel__btn--next");
    const viewport = carousel.querySelector(".product-carousel__viewport");

    randomized.forEach((product) => {
        const slide = document.createElement("div");
        slide.className = "product-carousel__slide";
        slide.appendChild(createProductCard(product));
        track.appendChild(slide);
    });

    let visibleCount = getVisibleSlidesCount();
    let currentIndex = 0;
    let maxIndex = Math.max(randomized.length - visibleCount, 0);

    if (randomized.length <= visibleCount) {
        btnPrev.style.display = "none";
        btnNext.style.display = "none";
        return;
    }

    function updateButtons() {
        btnPrev.disabled = currentIndex === 0;
        btnNext.disabled = currentIndex === maxIndex;

        btnPrev.classList.toggle("is-disabled", btnPrev.disabled);
        btnNext.classList.toggle("is-disabled", btnNext.disabled);
    }

    function updatePosition() {
        const firstSlide = track.querySelector(".product-carousel__slide");
        if (!firstSlide) return;

        const styles = getComputedStyle(track);
        const gap = parseInt(styles.columnGap || styles.gap || "0", 10);
        const slideWidth = firstSlide.offsetWidth + gap;

        const offset = -(slideWidth * currentIndex);
        track.style.transform = `translateX(${offset}px)`;
    }

    function moveToNext() {
        if (currentIndex >= maxIndex) return;
        currentIndex += 1;
        updatePosition();
        updateButtons();
    }

    function moveToPrev() {
        if (currentIndex <= 0) return;
        currentIndex -= 1;
        updatePosition();
        updateButtons();
    }

    btnNext.addEventListener("click", moveToNext);
    btnPrev.addEventListener("click", moveToPrev);

    let touchStartX = 0;
    let touchCurrentX = 0;

    function onTouchStart(e) {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchCurrentX = touchStartX;
    }

    function onTouchMove(e) {
        const touch = e.touches[0];
        touchCurrentX = touch.clientX;
    }

    function onTouchEnd() {
        const deltaX = touchCurrentX - touchStartX;
        const SWIPE_THRESHOLD = 30; 

        if (Math.abs(deltaX) < SWIPE_THRESHOLD) {
            return;
        }

        if (deltaX < 0) {
            moveToNext();
        } else {
            moveToPrev();
        }
    }

    viewport.addEventListener("touchstart", onTouchStart, { passive: true });
    viewport.addEventListener("touchmove", onTouchMove, { passive: true });
    viewport.addEventListener("touchend", onTouchEnd);

    window.addEventListener("resize", () => {
        visibleCount = getVisibleSlidesCount();
        maxIndex = Math.max(filtered.length - visibleCount, 0);

        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }

        if (filtered.length <= visibleCount) {
            btnPrev.style.display = "none";
            btnNext.style.display = "none";
            track.style.transform = "translateX(0)";
            return;
        } else {
            btnPrev.style.display = "";
            btnNext.style.display = "";
        }

        updatePosition();
        updateButtons();
    });

    updatePosition();
    updateButtons();
}

// ========== Login Modal ==============================
function initLoginModal() {
    const loginModal = document.getElementById("loginModal");
    if (!loginModal) return;

    const userIcon = document.querySelector(".header__controls a[aria-label='Account link']");

    const openModal = () => {
        loginModal.hidden = false;
    };

    const closeModal = () => {
        loginModal.hidden = true;
    };

    if (userIcon) {
        userIcon.addEventListener("click", (e) => {
            e.preventDefault();
            openModal();
        });
    }

    document.addEventListener("click", (e) => {
        if (e.target.matches("[data-close-login]")) {
            closeModal();
        }
    });

    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".login-form__toggle-pass");
        if (!btn) return;

        const input = document.getElementById("loginPassword");
        if (!input) return;

        const isHidden = input.type === "password";
        input.type = isHidden ? "text" : "password";
        btn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
    });

    const loginForm = loginModal.querySelector(".login-form");
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const emailError = document.getElementById("loginEmailError");
    const passwordError = document.getElementById("loginPasswordError");

    if (!loginForm || !emailInput || !passwordInput || !emailError || !passwordError) {
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(input, errorEl, message) {
        errorEl.textContent = message;
        errorEl.classList.add("visible");
        input.classList.add("form__input--invalid");
        input.setAttribute("aria-invalid", "true");
    }

    function clearError(input, errorEl) {
        errorEl.textContent = "";
        errorEl.classList.remove("visible");
        input.classList.remove("form__input--invalid");
        input.removeAttribute("aria-invalid");
    }

    function validateEmail() {
        const email = emailInput.value.trim();

        if (!email) {
            setError(emailInput, emailError, "Please enter your email address.");
            return false;
        }

        if (!emailRegex.test(email)) {
            setError(emailInput, emailError, "Please enter a valid email address.");
            return false;
        }

        clearError(emailInput, emailError);
        return true;
    }

    function validatePassword() {
        const pass = passwordInput.value.trim();

        if (!pass) {
            setError(passwordInput, passwordError, "Password cannot be empty.");
            return false;
        }

        clearError(passwordInput, passwordError);
        return true;
    }

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const okEmail = validateEmail();
        const okPass = validatePassword();

        if (!okEmail || !okPass) return;

        closeModal();
        loginForm.reset();
        alert("Login successful!");
    });

    emailInput.addEventListener("input", validateEmail);
    passwordInput.addEventListener("input", validatePassword);
}

function initProducts() {
    fetch("/src/assets/data.json")
        .then((response) => response.json())
        .then((json) => {
            const products = Array.isArray(json) ? json : json.data || [];
            if (!products.length) {
                console.warn("Products list is empty");
                return;
            }

            displayProductsForBlock(
                products,
                "Selected Products",
                "selectedProductsList"
            );

            displayProductsForBlock(
                products,
                "New Products Arrival",
                "newProductsList"
            );

            displayProductsForBlock(
                products,
                "You May Also Like",
                "pdpRecommendations"
            );
        })
        .catch((error) => console.error("Error loading products JSON:", error));
}

function initAddToCartHandler() {
    document.addEventListener("click", (event) => {
        const btn = event.target.closest("[data-add-to-cart]");
        if (!btn) return;

        event.preventDefault();
        event.stopPropagation();

        const productId = btn.getAttribute("data-product-id");
        const qtyAttr = btn.getAttribute("data-product-qty");
        const quantity = qtyAttr ? Number(qtyAttr) : 1;

        const name  = btn.getAttribute("data-product-name")  || "";
        const size  = btn.getAttribute("data-product-size")  || "";
        const color = btn.getAttribute("data-product-color") || "";

        addToCart({ id: productId, name, size, color }, quantity);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    renderHeader();
    renderFooter();
    renderOfferBanner();
    updateCartCounter();
    initLoginModal();
    initProducts();
    initAddToCartHandler();
});
