const DATA_URL = "/src/assets/data.json";
const SHIPPING_RATE = 30;
const DISCOUNT_LIMIT = 3000;

let productsById = {};
let cartItems = [];

async function loadProducts() {
    try {
        const res = await fetch(DATA_URL);
        const json = await res.json();
        const products = Array.isArray(json) ? json : json.data || [];

        productsById = {};
        products.forEach(p => {
            productsById[p.id] = p;
        });
    } catch (err) {
        console.error("Cannot load products JSON", err);
    }
}

/* global CART_STORAGE_KEY */

function loadCartFromStorage() {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        cartItems = Array.isArray(parsed) ? parsed : [];
    } catch {
        cartItems = [];
    }
}

function saveCartToStorage() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
}

function formatCurrency(value) {
    return `$${value.toFixed(2).replace(/\.00$/, "")}`;
}

function getDetailedCartItems() {
    return cartItems
        .map(raw => {
            const product = productsById[raw.id];
            if (!product) return null;

            return {
                id: raw.id,
                quantity: Number(raw.quantity) || 0,
                name: product.name,
                price: Number(product.price),
                imageUrl: product.imageUrl,
                color: product.color,
                size: product.size
            };
        })
        .filter(Boolean);
}

function calculateTotals(detailedItems) {
    const subtotal = detailedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const discount = subtotal > DISCOUNT_LIMIT ? subtotal * 0.1 : 0;

    const shipping = detailedItems.length ? SHIPPING_RATE : 0;
    const total = subtotal - discount + shipping;

    return { subtotal, discount, shipping, total };
}

function updateHeaderCartCounter() {
    const counter = document.querySelector("[data-cart-count]");
    if (!counter) return;

    const totalQuantity = cartItems.reduce(
        (sum, item) => sum + (Number(item.quantity) || 0),
        0
    );

    if (totalQuantity > 0) {
        counter.hidden = false;
        counter.textContent = totalQuantity;
    } else {
        counter.hidden = true;
        counter.textContent = "0";
    }
}

function changeItemQuantity(productId, delta) {
    const item = cartItems.find(i => i.id === productId);
    if (!item) return;

    item.quantity = (Number(item.quantity) || 0) + delta;

    if (item.quantity <= 0) {
        cartItems = cartItems.filter(i => i.id !== productId);
    }

    saveCartToStorage();
    renderCart();
}

function removeItem(productId) {
    cartItems = cartItems.filter(i => i.id !== productId);
    saveCartToStorage();
    renderCart();
}

function clearCart(messageType) {
    cartItems = [];
    saveCartToStorage();
    renderCart(messageType);
}

function renderCart(messageType) {
    const tbody = document.querySelector("[data-cart-items]");
    const messageEl = document.querySelector("[data-cart-message]");
    const subtotalEl = document.querySelector("[data-cart-subtotal]");
    const discountEl = document.querySelector("[data-cart-discount]");
    const shippingEl = document.querySelector("[data-cart-shipping]");
    const totalEl = document.querySelector("[data-cart-total]");
    const cartSection = document.getElementById("cart");

    if (!tbody || !messageEl || !cartSection) return;

    const detailedItems = getDetailedCartItems();

    tbody.innerHTML = "";

    if (!detailedItems.length) {
        if (messageType === "checkout") {
            messageEl.textContent = "Thank you for your purchase.";
            cartSection.classList.add("cart--empty");
        } else {
            messageEl.textContent = "Your cart is empty. Use the catalog to add new items.";
        }
        messageEl.hidden = false;
    } else {
        messageEl.hidden = true;
        messageEl.textContent = "";
        cartSection.classList.remove("cart--empty");

        detailedItems.forEach(item => {
            const tr = document.createElement("tr");
            tr.dataset.productId = item.id;

            const itemTotal = item.price * item.quantity;

            tr.innerHTML = `
                <td>
                    <img src="${item.imageUrl}" alt="${item.name}" loading="lazy" />
                </td>
                <td>
                    <div>
                        <span>${item.name}</span>
                    </div>
                </td>
                <td>${formatCurrency(item.price)}</td>
                <td>
                    <div class="cart-qty" aria-label="Change quantity">
                        <button type="button" class="cart-qty__btn" data-qty-minus>-</button>
                        <span class="cart-qty__value">${item.quantity}</span>
                        <button type="button" class="cart-qty__btn" data-qty-plus>+</button>
                    </div>
                </td>
                <td>${formatCurrency(itemTotal)}</td>
                <td>
                    <button type="button" class="cart-remove" data-item-remove
                        aria-label="Remove ${item.name} from cart"
                    >
                    </button>
                </td>
            `;

            tbody.appendChild(tr);
        });
    }

    const { subtotal, discount, shipping, total } = calculateTotals(detailedItems);

    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);

    if (discountEl) {
        const discountRow = discountEl.closest(".cart-summary__row");

        if (discount > 0) {
            discountEl.textContent = `-${formatCurrency(discount)}`;
            discountRow.style.display = "flex";
        } else {
            discountRow.style.display = "none";
        }
    }

    if (shippingEl) {
        shippingEl.textContent = detailedItems.length ? formatCurrency(shipping) : "$0";
    }

    if (totalEl) totalEl.textContent = formatCurrency(total);

    updateHeaderCartCounter();
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadProducts();
    loadCartFromStorage();

    const tbody = document.querySelector("[data-cart-items]");
    if (!tbody) return;

    const continueBtn = document.querySelector("[data-cart-continue]");
    const clearBtn = document.querySelector("[data-cart-clear]");
    const checkoutBtn = document.querySelector("[data-cart-checkout]");

    tbody.addEventListener("click", event => {
        const minusBtn = event.target.closest("[data-qty-minus]");
        const plusBtn = event.target.closest("[data-qty-plus]");
        const removeBtn = event.target.closest("[data-item-remove]");
        const row = event.target.closest("tr[data-product-id]");
        if (!row) return;

        const productId = row.dataset.productId;

        if (minusBtn) return changeItemQuantity(productId, -1);
        if (plusBtn) return changeItemQuantity(productId, 1);
        if (removeBtn) return removeItem(productId);
    });

    if (clearBtn) {
        clearBtn.addEventListener("click", function () {
            clearCart("empty");
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function () {
            clearCart("checkout");
        });
    }

    if (continueBtn) {
        continueBtn.addEventListener("click", function () {
            window.location.href = "/src/html/catalog.html";
        });
    }

    renderCart();
});
