import { pathTo, clean } from './path-utils.js';

(function () {
    const PER_PAGE = 12;

    let allProducts = [];
    let currentProducts = [];

    const state = {
        filters: {
            category: "",
            color: "",
            size: "",
            salesStatus: ""
        },
        sort: "default",
        page: 1
    };

    let paginationPrevBtn;
    let paginationNextBtn;
    let searchInput;
    let popup;
    let popupCloseBtn;
    let popupContentEl;

    function cacheDomElements() {
        paginationPrevBtn = document.getElementById("paginationPrev");
        paginationNextBtn = document.getElementById("paginationNext");
        searchInput = document.getElementById("catalogSearch");
        popup = document.getElementById("pnfPopup");
        popupCloseBtn = document.getElementById("pnfClose");
        popupContentEl = popup
            ? popup.querySelector(".catalog-popup__content")
            : null;
    }

    // ===== Utilities =====
    function applySorting(products) {
        const sorted = [...products];

        switch (state.sort) {
            case "price-asc":
                sorted.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                sorted.sort((a, b) => b.price - a.price);
                break;
            case "popularity-desc":
                sorted.sort((a, b) => b.popularity - a.popularity);
                break;
            case "rating-desc":
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            default:
                break;
        }

        return sorted;
    }

    function paginate(products) {
        const rangeStartEl = document.getElementById("startCount");
        const rangeEndEl = document.getElementById("endCount");
        const totalEl = document.getElementById("totalCount");
        const paginationCurrentEl = document.getElementById("paginationCurrent");
        const paginationTotalEl = document.getElementById("paginationTotal");

        const total = products.length;
        const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

        if (state.page > totalPages) {
            state.page = totalPages;
        }

        const startIndex = (state.page - 1) * PER_PAGE;
        const endIndex = startIndex + PER_PAGE;
        const pageItems = products.slice(startIndex, endIndex);

        const start = total === 0 ? 0 : startIndex + 1;
        const end = total === 0 ? 0 : Math.min(endIndex, total);

        if (rangeStartEl) rangeStartEl.textContent = start;
        if (rangeEndEl) rangeEndEl.textContent = end;
        if (totalEl) totalEl.textContent = total;

        if (paginationPrevBtn)
            paginationPrevBtn.disabled = state.page <= 1;
        if (paginationNextBtn)
            paginationNextBtn.disabled = state.page >= totalPages;

        if (paginationCurrentEl)
            paginationCurrentEl.textContent = total === 0 ? 0 : state.page;
        if (paginationTotalEl)
            paginationTotalEl.textContent = totalPages;

        renderPaginationPages(totalPages);

        return pageItems;
    }

    function getStarsHTML(rating) {
        const fullStars = Math.floor(rating);
        const emptyStars = 5 - fullStars;

        let html = "";
        for (let i = 0; i < fullStars; i++) {
            html += "<span class='star full'></span>";
        }
        for (let i = 0; i < emptyStars; i++) {
            html += "<span class='star empty'></span>";
        }
        return `<div class="rating">${html}</div>`;
    }

    // ===== Render =====
    function renderProducts(products) {
        const productListEl = document.getElementById("productList");

        productListEl.innerHTML = "";

        if (!products.length) {
            productListEl.innerHTML =
                "<li class='product-card product-card--empty'>No products found.</li>";
            return;
        }

        const fragment = document.createDocumentFragment();

        products.forEach((product) => {
            const li = document.createElement("li");
            li.className = "product-card-container";
            li.dataset.id = product.id;
            li.dataset.category = product.category;
            li.dataset.color = product.color;
            li.dataset.size = product.size;

            const isOnSale = Boolean(product.salesStatus);

            li.innerHTML = `
                <article class="product-card">
                    <a href="${pathTo(`html/product-details.html?id=${product.id}`)}" class="product-card__link">
                        ${isOnSale ? "<p class='product-card__tag'>Sale</p>" : ""}
                        <figure class="product-card__image">
                            <img src="${pathTo(clean(product.imageUrl))}" alt="${product.name}" loading="lazy" width="300" height="360">
                        </figure>
                        <div class="product-card__description">
                            <h3 class="product-card__name">
                                ${product.name}
                            </h3>
                            <p class="product-card__price">
                                $${product.price}
                            </p>
                            <button class="product-card__button primary-button" type="button" aria-label="Add ${product.name} to cart" data-add-to-cart data-product-id="${product.id}"
                                data-product-name="${product.name}" data-product-size="${product.size}" data-product-color="${product.color}"
                            >
                                Add To Cart
                            </button>
                        </div>
                    </a>
                </article>
            `;

            fragment.appendChild(li);
        });

        productListEl.appendChild(fragment);
    }

    function renderPaginationPages(totalPages) {
        const paginationPagesContainer = document.getElementById("paginationPages");

        if (!paginationPagesContainer) return;

        paginationPagesContainer.innerHTML = "";
        const fragment = document.createDocumentFragment();

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement("li");
            li.className = "pagination__page" + (i === state.page ? " active" : "");
            li.setAttribute("aria-current", "page");
            li.textContent = i;
            li.addEventListener("click", () => {
                if (state.page === i) return;
                state.page = i;
                updateCatalog();
            });
            fragment.appendChild(li);
        }

        paginationPagesContainer.appendChild(fragment);
    }

    function renderTopBestSets(products) {
        const sidebarTopSetsEl = document.getElementById("sidebarSets");

        if (!sidebarTopSetsEl) return;

        let sets = products.filter(
            (product) => product.category === "luggage sets"
        );

        if (!sets.length) {
            return;
        }

        for (let i = sets.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [sets[i], sets[j]] = [sets[j], sets[i]];
        }

        sets = sets.slice(0, 5);

        const fragment = document.createDocumentFragment();

        sets.forEach((product) => {
            const li = document.createElement("li");
            li.className = "sidebar-product";
            li.innerHTML = `
                <article class="sidebar-product__inner">
                    <a href="${pathTo(`html/product-details.html?id=${product.id}`)}"
                        class="sidebar-product__link"
                        aria-label="${product.name}">
                        <figure class="sidebar-product__media">
                            <img src="${pathTo(clean(product.imageUrl))}" alt="${product.name}" loading="lazy" width="64" height="64">
                        </figure>
                        <div class="sidebar-product__content">
                            <h3 class="sidebar-product__name">
                                ${product.name}
                            </h3>
                            ${getStarsHTML(product.rating || 0)}
                            <p class="sidebar-product__price">
                                $${product.price}
                            </p>
                        </div>
                    </a>
                </article>
            `;
            fragment.appendChild(li);
        });

        sidebarTopSetsEl.innerHTML = "";
        sidebarTopSetsEl.appendChild(fragment);
    }

    // ===== Filtering and updating =====
    function updateCatalog() {
        let filtered = allProducts.filter((product) => {
            const { category, color, size, salesStatus } = state.filters;

            if (category && product.category !== category) return false;
            if (color && product.color !== color) return false;

            if (size) {
                const productSize = String(product.size || "").toLowerCase();
                const filterSize = size.toLowerCase();

                if (filterSize === "s-l") {
                    const allowed = ["s", "m", "l"];
                    if (!allowed.includes(productSize)) return false;
                } else {
                    if (productSize !== filterSize) return false;
                }
            }

            if (salesStatus === "true" && !product.salesStatus) return false;
            if (salesStatus === "false" && product.salesStatus) return false;

            return true;
        });

        const sorted = applySorting(filtered);
        currentProducts = sorted;

        const pageItems = paginate(sorted);
        renderProducts(pageItems);
    }

    // ===== Popup logic =====
    function showPopup() {
        if (!popup) return;
        popup.hidden = false;
    }

    function hidePopup() {
        if (!popup) return;
        popup.hidden = true;
    }

    function initPopup() {
        if (!popup) return;

        if (popupCloseBtn) {
            popupCloseBtn.addEventListener("click", hidePopup);
        }

        document.addEventListener("click", (event) => {
            if (popup.hidden) return;
            if (popupContentEl && popupContentEl.contains(event.target)) return;
            hidePopup();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !popup.hidden) {
                hidePopup();
            }
        });
    }

    // ===== Search logic =====
    function handleSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return;

        const foundProduct = allProducts.find((p) => {
            const name = (p.name || "").toLowerCase();
            return name.includes(query);
        });

        if (!foundProduct) {
            showPopup();
            return;
        }

        const productId = encodeURIComponent(foundProduct.id);
        window.location.href = pathTo(`html/product-details.html?id=${productId}`);
    }

    // ===== Init functions =====
    function initCatalogFilters() {
        if (document.body.dataset.page !== "catalog") return;

        const form = document.getElementById("catalog-filters");
        if (!form) return;

        const selects = form.querySelectorAll(".filters__select");

        function updateActiveStyles() {
            selects.forEach((select) => {
                if (select.value) {
                    select.classList.add("filters__select--active");
                } else {
                    select.classList.remove("filters__select--active");
                }
            });

            const salesInput = form.querySelector(
                "input[name='salesStatus']:checked"
            );
            form.classList.toggle(
                "filters--sales-active",
                !!salesInput && salesInput.value !== ""
            );
        }

        function syncFiltersFromForm() {
            const formData = new FormData(form);

            state.filters.category = formData.get("category") || "";
            state.filters.color = formData.get("color") || "";
            state.filters.size = formData.get("size") || "";

            const salesStatusValue = formData.get("salesStatus") || "";
            state.filters.salesStatus = salesStatusValue;
        }

        form.addEventListener("change", (event) => {
            if (
                event.target.matches(".filters__select") ||
                event.target.name === "salesStatus"
            ) {
                syncFiltersFromForm();
                state.page = 1;
                updateActiveStyles();
                updateCatalog();
            }
        });

        form.addEventListener("reset", () => {
            state.filters = {
                category: "",
                color: "",
                size: "",
                salesStatus: ""
            };
            state.page = 1;

            setTimeout(() => {
                updateActiveStyles();
                updateCatalog();
            }, 0);
        });

        syncFiltersFromForm();
        updateActiveStyles();
    }

    function initCatalogFiltersDropdown() {
        if (document.body.dataset.page !== "catalog") return;

        const navItem = document.querySelector(
            ".navigation__item--has-dropdown[data-page='catalog']"
        );
        const filtersContainer = document.querySelector(".filters-container");
        if (!filtersContainer) return;

        const hideBtn = document.querySelector(".filters__button--hide");
        const filtersForm = filtersContainer.querySelector(".filters__form");
        const toggleBtn = document.querySelector(".catalog__filters-toggle");

        const DESKTOP_BREAKPOINT = 1024;

        function isDesktop() {
            return window.innerWidth > DESKTOP_BREAKPOINT;
        }

        function openFilters() {
            filtersContainer.classList.add("filters-container--open");

            if (!isDesktop() && toggleBtn) {
                toggleBtn.setAttribute("aria-expanded", "true");
            }
        }

        function closeFilters() {
            filtersContainer.classList.remove("filters-container--open");

            if (toggleBtn) {
                toggleBtn.setAttribute("aria-expanded", "false");
            }
        }

        if (navItem) {
            navItem.addEventListener("mouseenter", () => {
                if (!isDesktop()) return;
                openFilters();
            });
        }

        if (toggleBtn) {
            toggleBtn.addEventListener("click", () => {
                if (isDesktop()) return;

                const isOpen = filtersContainer.classList.contains(
                    "filters-container--open"
                );
                if (isOpen) {
                    closeFilters();
                } else {
                    openFilters();
                }
            });
        }

        if (hideBtn) {
            hideBtn.addEventListener("click", (event) => {
                event.preventDefault();
                closeFilters();
            });
        }

        document.addEventListener("click", (event) => {
            if (!filtersContainer.classList.contains("filters-container--open")) {
                return;
            }

            const clickInsideFilters =
                filtersForm && filtersForm.contains(event.target);
            const clickOnNav = navItem && navItem.contains(event.target);
            const clickOnToggle = toggleBtn && toggleBtn.contains(event.target);

            if (clickInsideFilters || clickOnNav || clickOnToggle) {
                return;
            }

            closeFilters();
        });

        window.addEventListener("resize", () => {
            if (isDesktop() && toggleBtn) {
                toggleBtn.setAttribute("aria-expanded", "false");
            }
        });
    }

    function initSorting() {
        const sortSelect = document.getElementById("catalogSort");

        if (sortSelect) {
            sortSelect.addEventListener("change", () => {
                state.sort = sortSelect.value;
                state.page = 1;
                updateCatalog();
            });
        }
    }

    function initPagination() {
        if (paginationPrevBtn) {
            paginationPrevBtn.addEventListener("click", () => {
                if (state.page <= 1) return;
                state.page -= 1;
                updateCatalog();
            });
        }

        if (paginationNextBtn) {
            paginationNextBtn.addEventListener("click", () => {
                const totalPages = Math.max(
                    1,
                    Math.ceil(currentProducts.length / PER_PAGE)
                );
                if (state.page >= totalPages) return;
                state.page += 1;
                updateCatalog();
            });
        }
    }

    function initSearch() {
        const searchForm = document.getElementById("searchForm");

        if (searchForm && searchInput) {
            searchForm.addEventListener("submit", (event) => {
                event.preventDefault();
                handleSearch();
            });

            searchInput.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    handleSearch();
                }
            });
        }
    }

    function initCatalogPage() {
        if (document.body.dataset.page !== "catalog") return;

        cacheDomElements();

        fetch(pathTo("assets/data.json"))
            .then((res) => res.json())
            .then((json) => {
                const products = Array.isArray(json) ? json : json.data || [];
                allProducts = products;

                initCatalogFilters();
                initCatalogFiltersDropdown();
                initSorting();
                initPagination();
                initSearch();
                initPopup();

                updateCatalog();
                renderTopBestSets(allProducts);
            })
            .catch((err) => {
                console.error("Error loading products:", err);
            });
    }

    document.addEventListener("DOMContentLoaded", initCatalogPage);
})();

