// main.js

// Cart functionality with localStorage for cross-page persistence
let cartItems = [];

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
    modal.classList.toggle('active');
    overlay.classList.toggle('active');
    updateCartDisplay();
}

function closeCart() {
    document.getElementById('cartModal').classList.remove('active');
    document.getElementById('cartOverlay').classList.remove('active');
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
        const cartSubtotalElement = document.getElementById('cartSubtotal');
        const savingsLine = document.getElementById('savingsLine');
        const cartIVAElement = document.getElementById('cartIVA');
        
        if (cartSubtotalElement) cartSubtotalElement.textContent = '$0';
        if (savingsLine) savingsLine.style.display = 'none';
        if (cartIVAElement) cartIVAElement.textContent = '$0';
        cartTotalElement.textContent = '$0';
        checkoutBtn.disabled = true;
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
            
            // Build price display based on quantity and discount
            let priceHTML = '';
            const safePrice = group.price || 0;
            const safeOriginalPrice = group.originalPrice || safePrice;
            const safeLineTotal = lineTotal || 0;
            const hasDiscount = safeOriginalPrice > safePrice;
            
            if (group.quantity > 1) {
                if (hasDiscount) {
                    priceHTML = `
                        <div class="cart-item-price">
                            <span style="text-decoration: line-through; opacity: 0.6;">$${safeOriginalPrice.toLocaleString()}</span>
                            $${safePrice.toLocaleString()} each
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
                        <div class="cart-item-price">
                            <span style="text-decoration: line-through; opacity: 0.6;">$${safeOriginalPrice.toLocaleString()}</span>
                            $${safePrice.toLocaleString()}
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
        
        checkoutBtn.disabled = false;
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

function checkout() {
    if (cartItems.length > 0) {
        const total = cartItems.reduce((sum, item) => sum + item.price, 0);
        const itemsList = cartItems.map(item => `• ${item.name} - $${item.price.toLocaleString()}`).join('\n');

        alert(`Thank you for your order!\n\n${itemsList}\n\nTotal: $${total.toLocaleString()}\n\nWe'll contact you shortly to complete your purchase.`);

        cartItems = [];
        saveCart();
        updateCart();
        closeCart();
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

// Furniture products database
const searchDatabase = [
    { name: 'Globo Side Table', code: 'MM-DC-001', price: 675, url: 'globo-side-table.html', image: 'https://i.imgur.com/Cd7ykMg.jpg' },
    { name: 'Parsons Depto. Desk', code: 'DK001', price: 1150, url: 'depto-parsons-desk.html', image: 'https://i.imgur.com/HEbJZWe.jpg' },
    { name: 'Ronda Coffee Table', code: 'MM-TL-003', price: 1380, url: 'ronda-coffee-table.html', image: 'https://i.imgur.com/mI4q6Tw.jpg' },
    { name: 'Dizi Side Table', code: 'AT006', price: 446, originalPrice: 525, url: 'dizi-side-table.html', image: 'https://i.imgur.com/mGwzc7m.jpg' },
    { name: 'Dizi Coffee Table', code: 'CT004', price: 1200, url: 'dizi-coffee-table.html', image: 'https://i.imgur.com/u7g9gGh.jpg' },
    { name: 'Petra Coffee Table', code: 'CT018', price: 1615, originalPrice: 1900, url: 'petra-coffee-table.html', image: 'https://i.imgur.com/qPjmklI.jpg' },
    { name: 'Barro No.2 Side Table', code: 'AT016', price: 555, url: 'barro-no2-side-table.html', image: 'https://i.imgur.com/MUPkmH7.jpg' },
    { name: 'Rosario Bistro Table', code: 'BT001', price: 715, url: 'rosario-bistro-table.html', image: 'https://i.imgur.com/Iq5eg0R.jpg' },
    { name: 'Cazo Side Chair', code: 'SCH002', price: 900, url: 'cazo-side-chair.html', image: 'https://i.imgur.com/aPrJrZg.jpg' },
    { name: 'Mano Sofa', code: 'SO010', price: 2255, url: 'mano-sofa.html', image: 'https://i.imgur.com/lIcg44s.jpg' },
    { name: 'Mano Chair', code: 'CH017', price: 1240, url: 'mano-chair.html', image: 'https://i.imgur.com/8zaPHCL.jpg' },
    { name: 'Rio Chair', code: 'CH005', price: 1130, url: 'rio-chair.html', image: 'https://i.imgur.com/xgMrofZ.jpg' },
    { name: 'Perse Chair', code: 'CH010', price: 815, url: 'perse-chair.html', image: 'https://i.imgur.com/XwMXs6o.jpg' },
    { name: 'Fortuna Chair', code: 'CH012', price: 695, url: 'fortuna-chair.html', image: 'https://i.imgur.com/Nzky6sa.jpg' },
    { name: 'Poroti Side Table', code: 'AT007', price: 565, url: 'poroti-side-table.html', image: 'https://i.imgur.com/cCff85m.jpg' },
    { name: 'Bloque No.1 Side table', code: 'AT009', price: 400, url: 'bloque-no1-side-table.html', image: 'https://i.imgur.com/OPIXl1H.jpg' },
    { name: 'Plato Side Table', code: 'AT018', price: 675, url: 'plato-side-table.html', image: 'https://i.imgur.com/lyqffq4.jpg' },
    { name: '1/2 and 1/2 Side Table', code: 'AT004', price: 495, url: 'half-and-half-side-table.html', image: 'https://i.imgur.com/dXgmyPU.jpg' },
    { name: 'Pablo Side Table', code: 'AT020', price: 475, url: 'pablo-side-table.html', image: 'https://i.imgur.com/qWpb5ea.jpg' },
    { name: 'Amanita Side Table', code: 'AT019', price: 485, url: 'amanita-side-table.html', image: 'https://i.imgur.com/bDH1fs5.jpg' },
    { name: 'Gracia Dining Table', code: 'DT012', price: 2835, url: 'gracia-dining-table.html', image: 'https://i.imgur.com/9VFjyk2.jpg' }
];

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
    
    const results = searchDatabase.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.code.toLowerCase().includes(query)
    );
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="search-no-results">No products found</div>';
        return;
    }
    
    let html = '';
    results.forEach(item => {
        const priceDisplay = item.originalPrice ? 
            `<span style="text-decoration: line-through; opacity: 0.5;">$${item.originalPrice}</span> $${item.price} + iva` :
            `$${item.price} + iva`;
        
        html += `
            <a href="${item.url}" class="search-result-item">
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
