// main.js

// Cart functionality with localStorage for cross-page persistence
let cartItems = [];

// Helper to URL-encode data for Netlify Forms
function encodeFormData(data) {
    return Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');
}

// Load cart from localStorage on page load
function loadCart() {
    const savedCart = localStorage.getItem('laurelCart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
    }
    updateCart();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('laurelCart', JSON.stringify(cartItems));
}

function addToCart(name, price, code, imageUrl, originalPrice = null) {
    const cartItem = {
        name: name,
        price: price,
        originalPrice: originalPrice || price, // Store original price if provided
        code: `${code}-${Date.now()}`,
        image: imageUrl || ''
    };
    
    cartItems.push(cartItem);
    saveCart();
    updateCart();
    toggleCart();
}

function updateCart() {
    updateCartCounter();
    updateCartDisplay();
}

function updateCartCounter() {
    const counter = document.getElementById('cartCounter');
    if (counter) {
        counter.textContent = cartItems.length;
        counter.classList.toggle('has-items', cartItems.length > 0);
    }
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    const overlay = document.getElementById('cartOverlay');
    if (modal) modal.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
    updateCartDisplay();
}

function closeCart() {
    const modal = document.getElementById('cartModal');
    const overlay = document.getElementById('cartOverlay');
    if (modal) modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Skip if cart elements don't exist on this page
    if (!cartItemsContainer || !cartTotalElement) return;

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
        const cartSubtotalElement = document.getElementById('cartSubtotal');
        const savingsLine = document.getElementById('savingsLine');
        const cartIVAElement = document.getElementById('cartIVA');
        
        if (cartSubtotalElement) cartSubtotalElement.textContent = '$0';
        if (savingsLine) savingsLine.style.display = 'none';
        if (cartIVAElement) cartIVAElement.textContent = '$0';
        cartTotalElement.textContent = '$0';
        if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
        const groupedItems = [];
        
        cartItems.forEach((item, index) => {
            const existingGroup = groupedItems.find(group => 
                group.name === item.name && group.price === item.price
            );
            
            if (existingGroup) {
                existingGroup.quantity += 1;
                existingGroup.indices.push(index);
            } else {
                groupedItems.push({
                    ...item,
                    quantity: 1,
                    indices: [index]
                });
            }
        });

        let total = 0;
        let html = '';

        groupedItems.forEach((group) => {
            const lineTotal = group.price * group.quantity;
            total += lineTotal;
            
            // Build price display based on quantity and discount (grid + product cards pass originalPrice)
            let priceHTML = '';
            const safePrice = Number(group.price) || 0;
            const safeOriginalPrice = Number(group.originalPrice) || safePrice;
            const safeLineTotal = lineTotal || 0;
            const hasDiscount = safeOriginalPrice > safePrice;
            
            if (group.quantity > 1) {
                if (hasDiscount) {
                    priceHTML = `
                        <div class="cart-item-price cart-item-price-with-discount">
                            <span class="cart-price-original">$${safeOriginalPrice.toLocaleString()}</span>
                            <span class="cart-price-current">$${safePrice.toLocaleString()} each</span>
                        </div>
                        <div class="cart-item-price" style="font-weight: 600;">$${safeLineTotal.toLocaleString()} total</div>
                    `;
                } else {
                    priceHTML = `
                        <div class="cart-item-price">$${safePrice.toLocaleString()} each</div>
                        <div class="cart-item-price" style="font-weight: 600;">$${safeLineTotal.toLocaleString()} total</div>
                    `;
                }
            } else {
                if (hasDiscount) {
                    priceHTML = `
                        <div class="cart-item-price cart-item-price-with-discount">
                            <span class="cart-price-original">$${safeOriginalPrice.toLocaleString()}</span>
                            <span class="cart-price-current">$${safePrice.toLocaleString()}</span>
                        </div>
                    `;
                } else {
                    priceHTML = `<div class="cart-item-price">$${safePrice.toLocaleString()}</div>`;
                }
            }
            
            html += `
                <div class="cart-item">
                    <div class="cart-item-image">${group.image ? `<img src="${group.image}" alt="${group.name}">` : ''}</div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${group.name}</div>
                        ${group.quantity > 1 ? `<div class="cart-item-code">Qty: ${group.quantity}</div>` : ''}
                        ${priceHTML}
                    </div>
                    <button class="cart-item-remove" onclick="removeFromCart(${group.indices.join(',')})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#141414" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = html;
        
        // Calculate and display all totals
        const subtotal = total;
        const originalTotal = groupedItems.reduce((sum, group) => {
            return sum + ((group.originalPrice || group.price || 0) * group.quantity);
        }, 0);
        const savings = originalTotal - subtotal;
        const iva = Math.round(subtotal * 0.13);
        const finalTotal = subtotal + iva;
        
        // Update all total displays
        const cartSubtotalElement = document.getElementById('cartSubtotal');
        const cartSavingsElement = document.getElementById('cartSavings');
        const savingsLine = document.getElementById('savingsLine');
        const cartIVAElement = document.getElementById('cartIVA');
        
        if (cartSubtotalElement) cartSubtotalElement.textContent = `$${subtotal.toLocaleString()}`;
        if (savings > 0 && cartSavingsElement && savingsLine) {
            cartSavingsElement.textContent = `-$${savings.toLocaleString()}`;
            savingsLine.style.display = 'flex';
        } else if (savingsLine) {
            savingsLine.style.display = 'none';
        }
        if (cartIVAElement) cartIVAElement.textContent = `$${iva.toLocaleString()}`;
        cartTotalElement.textContent = `$${finalTotal.toLocaleString()}`;

        if (checkoutBtn) checkoutBtn.disabled = false;
    }
}

function removeFromCart(indices) {
    const indexArray = indices.toString().split(',').map(Number);
    indexArray.sort((a, b) => b - a);
    indexArray.forEach(index => {
        cartItems.splice(index, 1);
    });
    saveCart();
    updateCart();
}

function getCartSummary() {
    if (cartItems.length === 0) return null;
    const grouped = [];
    cartItems.forEach((item) => {
        const existing = grouped.find(g => g.name === item.name && g.price === item.price);
        if (existing) {
            existing.quantity += 1;
        } else {
            grouped.push({ ...item, quantity: 1 });
        }
    });
    const subtotal = grouped.reduce((sum, g) => sum + g.price * g.quantity, 0);
    const iva = Math.round(subtotal * 0.13);
    const total = subtotal + iva;
    return { groupedItems: grouped, subtotal, iva, total };
}

function openCheckoutModal() {
    const overlay = document.getElementById('checkoutOverlay');
    const modal = document.getElementById('checkoutModal');
    if (overlay) overlay.classList.add('active');
    if (modal) modal.classList.add('active');
    const orderSummaryEl = document.getElementById('checkoutOrderSummary');
    if (orderSummaryEl) orderSummaryEl.value = '';
    const formWrap = document.getElementById('checkoutFormWrap');
    const confirmation = document.getElementById('checkoutConfirmation');
    if (formWrap) formWrap.style.display = '';
    if (confirmation) confirmation.style.display = 'none';
}

function closeCheckoutModal() {
    const overlay = document.getElementById('checkoutOverlay');
    const modal = document.getElementById('checkoutModal');
    if (overlay) overlay.classList.remove('active');
    if (modal) modal.classList.remove('active');
}

function closeCheckoutModalAfterConfirm() {
    closeCheckoutModal();
    closeCart();
}

function checkout() {
    if (cartItems.length === 0) return;
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        openCheckoutModal();
    } else {
        const summary = getCartSummary();
        if (!summary) return;
        const lines = summary.groupedItems.map(g =>
            `${g.name} x ${g.quantity} — $${(g.price * g.quantity).toLocaleString()}`
        );
        alert(`Thank you for your order!\n\n${lines.join('\n')}\n\nTotal: $${summary.total.toLocaleString()}\n\nWe'll contact you shortly to complete your purchase. Email us at contact@la-urel.com with your details.`);
        cartItems = [];
        saveCart();
        updateCart();
        closeCart();
    }
}

async function submitCheckoutForm(e) {
    e.preventDefault();
    
    // When viewing the site directly from the filesystem (file://),
    // Netlify Forms POSTs cannot work and browsers block fetch to file://.
    // In that case, show a message instead of attempting the network call.
    if (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:') {
        alert("Checkout email only works when the site is served over http/https (for example via Netlify or a local dev server). For now, please email us at contact@la-urel.com with your order details.");
        closeCheckoutModal();
        closeCart();
        return;
    }
    
    const form = document.getElementById('checkoutForm');
    const submitBtn = document.getElementById('checkoutSubmitBtn');
    if (!form || !submitBtn) return;

    const name = (document.getElementById('checkoutName') && document.getElementById('checkoutName').value) || '';
    const email = (document.getElementById('checkoutEmail') && document.getElementById('checkoutEmail').value) || '';
    const phone = (document.getElementById('checkoutPhone') && document.getElementById('checkoutPhone').value) || '';
    const message = (document.getElementById('checkoutMessage') && document.getElementById('checkoutMessage').value) || '';

    const summary = getCartSummary();
    if (!summary) {
        closeCheckoutModal();
        closeCart();
        return;
    }

    const lines = summary.groupedItems.map(g =>
        `${g.name} x ${g.quantity} — $${(g.price * g.quantity).toLocaleString()}`
    );
    const orderSummary = [
        '--- ORDER ---',
        lines.join('\n'),
        `Subtotal: $${summary.subtotal.toLocaleString()}`,
        `IVA (13%): $${summary.iva.toLocaleString()}`,
        `Total: $${summary.total.toLocaleString()}`
    ].join('\n');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
        const res = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: encodeFormData({
                'form-name': 'truck-checkout',
                name: name.trim(),
                email: email.trim(),
                phone: (phone || '').trim(),
                message: (message || '').trim(),
                order_summary: orderSummary
            })
        });

        if (!res.ok) throw new Error('Send failed');
        cartItems = [];
        saveCart();
        updateCart();
        const formWrap = document.getElementById('checkoutFormWrap');
        const confirmation = document.getElementById('checkoutConfirmation');
        if (formWrap) formWrap.style.display = 'none';
        if (confirmation) confirmation.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit order';
    } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit order';
        alert('Something went wrong. Please email us at contact@la-urel.com with your order details.');
    }
}

function clearCart() {
    if (cartItems.length > 0) {
        document.getElementById('clearModal').classList.add('active');
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
    }
}

function closeClearModal() {
    document.getElementById('clearModal').classList.remove('active');
    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('keydown', handleEscape);
}

function confirmClearCart() {
    cartItems = [];
    saveCart();
    updateCart();
    closeClearModal();
}

function handleClickOutside(e) {
    const modal = document.getElementById('clearModal');
    if (!modal.contains(e.target) && !e.target.classList.contains('clear-items-link')) {
        closeClearModal();
    }
}

function handleEscape(e) {
    if (e.key === 'Escape') {
        closeClearModal();
    }
}

// Newsletter Modal Functions
function showNewsletterModal() {
    document.getElementById('newsletterModal').classList.add('active');
}

function closeNewsletterModal() {
    document.getElementById('newsletterModal').classList.remove('active');
}

// Info Modals (Shipping, Returns, Trade)
function showShippingModal() {
    document.getElementById('shippingModal').classList.add('active');
    document.getElementById('infoModalOverlay').classList.add('active');
}

function showReturnsModal() {
    document.getElementById('returnsModal').classList.add('active');
    document.getElementById('infoModalOverlay').classList.add('active');
}

function showTradeModal() {
    document.getElementById('tradeModal').classList.add('active');
    document.getElementById('infoModalOverlay').classList.add('active');
}

function closeInfoModals() {
    document.getElementById('shippingModal').classList.remove('active');
    document.getElementById('returnsModal').classList.remove('active');
    document.getElementById('tradeModal').classList.remove('active');
    document.getElementById('infoModalOverlay').classList.remove('active');
}

// Products database is loaded by products-data.js (must be included before main.js)

function toggleSearch() {
    document.getElementById('searchOverlay').classList.add('active');
    document.getElementById('searchModal').classList.add('active');
    document.getElementById('searchInput').focus();
}

function closeSearch() {
    document.getElementById('searchOverlay').classList.remove('active');
    document.getElementById('searchModal').classList.remove('active');
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '<div class="search-no-results">Start typing to search...</div>';
}

function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const resultsContainer = document.getElementById('searchResults');

    if (query.length < 1) {
        resultsContainer.innerHTML = '<div class="search-no-results">Start typing to search...</div>';
        return;
    }

    // If database not loaded yet, show loading and retry
    if (productsDatabase.length === 0) {
        resultsContainer.innerHTML = '<div class="search-no-results">Loading products...</div>';
        loadProductsDatabase().then(() => performSearch());
        return;
    }

    const results = productsDatabase.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query)
    );

    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="search-no-results">No products found</div>';
        return;
    }

    // Determine correct URL path based on current page location
    function getProductUrl(productUrl) {
        // If URL is absolute (starts with /), convert to relative based on current location
        if (productUrl.startsWith('/')) {
            productUrl = productUrl.substring(1); // Remove leading slash
        }
        
        // Check if we're on a product page (in pages/products/)
        const currentPath = window.location.pathname;
        if (currentPath.includes('/pages/products/')) {
            // Extract just the filename from the product URL
            const filename = productUrl.split('/').pop();
            return filename; // Same directory, just use filename
        }
        
        // Otherwise, use the relative path as-is
        return productUrl;
    }

    let html = '';
    results.forEach(item => {
        const priceDisplay = item.originalPrice ?
            `<span style="text-decoration: line-through; opacity: 0.5;">$${item.originalPrice.toLocaleString()}</span> $${item.price.toLocaleString()} + iva` :
            `$${item.price.toLocaleString()} + iva`;

        const productUrl = getProductUrl(item.url);

        html += `
            <a href="${productUrl}" class="search-result-item">
                <img src="${item.image}" alt="${item.name}" class="search-result-image">
                <div class="search-result-info">
                    <div class="search-result-name">${item.name}</div>
                    <div class="search-result-type">${item.code}</div>
                </div>
                <div class="search-result-price">${priceDisplay}</div>
            </a>
        `;
    });

    resultsContainer.innerHTML = html;
}

// Smart Ticker Control
function initializeTicker() {
    const ticker = document.querySelector('.ticker-wrapper');
    let loopCount = 0;
    const maxLoops = 3;
    const pauseDuration = 600000; // 10 minutes in milliseconds
    
    ticker.addEventListener('animationiteration', function() {
        loopCount++;
        
        if (loopCount >= maxLoops) {
            ticker.style.animationPlayState = 'paused';
            
            // Restart after 10 minutes
            setTimeout(function() {
                loopCount = 0;
                ticker.style.animationPlayState = 'running';
            }, pauseDuration);
        }
    });
}

// Contact modal (Interiors Get in Touch; also used when modal is in partials)
function openContactModal() {
    var modal = document.getElementById('contactUsModal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    var form = document.getElementById('contactModalForm');
    var success = document.getElementById('contactModalSuccess');
    if (form) form.style.display = 'block';
    if (success) success.style.display = 'none';
    var input = document.getElementById('contactInput');
    if (input) { input.value = ''; input.placeholder = 'your@email.com'; input.type = 'email'; }
    var emailRadio = document.querySelector('#contactUsModal input[name="contactMethod"][value="email"]');
    if (emailRadio) emailRadio.checked = true;
}
function closeContactModal() {
    var modal = document.getElementById('contactUsModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
}
function updateContactPlaceholder() {
    var emailRadio = document.querySelector('#contactUsModal input[name="contactMethod"][value="email"]');
    var input = document.getElementById('contactInput');
    if (!input) return;
    if (emailRadio && emailRadio.checked) {
        input.placeholder = 'your@email.com';
        input.type = 'email';
    } else {
        input.placeholder = '(506) 1234-5678';
        input.type = 'tel';
    }
}
function submitContact() {
    var input = document.getElementById('contactInput');
    var form = document.getElementById('contactModalForm');
    var success = document.getElementById('contactModalSuccess');
    var methodRadio = document.querySelector('#contactUsModal input[name="contactMethod"]:checked');
    if (!input || !input.value.trim()) {
        alert('Please enter your contact information');
        return;
    }
    var contactMethod = (methodRadio && methodRadio.value) || 'email';
    var contactValue = input.value.trim();
    if (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:') {
        if (form) form.style.display = 'none';
        if (success) success.style.display = 'block';
        setTimeout(closeContactModal, 2000);
        return;
    }
    var submitBtn = document.querySelector('#contactUsModal .wt-modal-submit');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
    fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: (typeof encodeFormData === 'function' ? encodeFormData : function(d) {
            return Object.keys(d).map(function(k) { return encodeURIComponent(k) + '=' + encodeURIComponent(d[k]); }).join('&');
        })({
            'form-name': 'wt-contact',
            contact_method: contactMethod,
            contact_value: contactValue
        })
    }).then(function(res) {
        if (res.ok) {
            if (form) form.style.display = 'none';
            if (success) success.style.display = 'block';
            setTimeout(closeContactModal, 2000);
        } else {
            alert('Something went wrong. Please try again or email contact@la-urel.com');
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit Request'; }
        }
    }).catch(function() {
        alert('Something went wrong. Please try again or email contact@la-urel.com');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit Request'; }
    });
}

// Turbo Drive: close modals before navigation so cart/overlays don't get stuck on new page
document.addEventListener('turbo:before-visit', function() {
    if (typeof closeCart === 'function') closeCart();
    if (typeof closeSearch === 'function') closeSearch();
    if (typeof closeInfoModals === 'function') closeInfoModals();
    if (typeof closeContactModal === 'function') closeContactModal();
    document.body.style.overflow = '';
});

// Turbo Drive: re-init cart counter and display after each page load (full or Turbo visit)
document.addEventListener('turbo:load', function() {
    if (typeof loadCart === 'function') loadCart();
});
