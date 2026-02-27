// product.js - Product page specific functionality
// Requires main.js and products-data.js to be loaded first

// ============================================================================
// SALE PRICE — driven by Supabase is_grid (productsDatabase)
// ============================================================================
// Grid items (is_grid true) use price as sale price and original_price for strikethrough.
// Used on product pages and for Add to Truck / cart modals.

function getGridSaleItem(productCode) {
    const db = typeof productsDatabase !== 'undefined' ? productsDatabase : [];
    const product = db.find(p => p.code === productCode && p.isGrid);
    if (!product) return null;
    const salePrice = product.price;
    // Grid is "15% Off" — use stored original or derive so product page and cart show strikethrough
    const originalPrice = (product.originalPrice != null && product.originalPrice > salePrice)
        ? product.originalPrice
        : Math.round(salePrice / 0.85);
    return { originalPrice, salePrice };
}

// ============================================================================
// SALE PRICE APPLICATION
// ============================================================================
function checkAndApplySalePrice() {
    const productCodeEl = document.querySelector('.product-code');
    if (!productCodeEl) return;
    const productCode = productCodeEl.textContent.trim();
    const saleItem = getGridSaleItem(productCode);

    if (saleItem) {
        const priceElement = document.querySelector('.product-price');
        const discount = saleItem.originalPrice > 0
            ? Math.round(((saleItem.originalPrice - saleItem.salePrice) / saleItem.originalPrice) * 100)
            : 0;

        priceElement.innerHTML = `
            <span style="text-decoration: line-through; opacity: 0.5; font-size: 0.9em;">$${saleItem.originalPrice.toLocaleString()}</span>
            <span style="color: #583c4a; font-weight: 600;">$${saleItem.salePrice.toLocaleString()} + iva</span>
            <span style="display: block; font-size: 0.75em; color: #583c4a; margin-top: 4px;">${discount}% Off Season Markdown</span>
        `;

        document.querySelectorAll('.size-option').forEach(option => {
            option.setAttribute('data-price', saleItem.salePrice);
        });
    }
}

// ============================================================================
// GALLERY SCROLLBAR FUNCTIONALITY
// ============================================================================
function initGalleryScrollbar() {
    const galleryContainer = document.getElementById('galleryScrollContainer');
    const scrollThumb = document.getElementById('galleryScrollThumb');
    const scrollTrack = document.querySelector('.custom-scrollbar');

    if (!galleryContainer || !scrollThumb || !scrollTrack) return;

    function updateScrollbarVisibility() {
        if (galleryContainer.scrollHeight <= galleryContainer.clientHeight) {
            scrollTrack.style.display = 'none';
        } else {
            scrollTrack.style.display = 'block';
        }
    }

    function updateScrollThumb() {
        if (galleryContainer.scrollHeight <= galleryContainer.clientHeight) return;

        const scrollPercentage = galleryContainer.scrollTop / (galleryContainer.scrollHeight - galleryContainer.clientHeight);
        const thumbHeight = 100;
        const thumbTop = scrollPercentage * (scrollTrack.clientHeight - thumbHeight);

        scrollThumb.style.height = thumbHeight + 'px';
        scrollThumb.style.top = thumbTop + 'px';
    }

    galleryContainer.addEventListener('scroll', updateScrollThumb);
    window.addEventListener('load', () => {
        updateScrollbarVisibility();
        updateScrollThumb();
    });
    window.addEventListener('resize', () => {
        updateScrollbarVisibility();
        updateScrollThumb();
    });

    // Make scrollbar draggable
    let isDragging = false;
    let startY = 0;
    let startScrollTop = 0;

    scrollThumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        startY = e.clientY;
        startScrollTop = galleryContainer.scrollTop;
        scrollThumb.style.background = 'rgba(250, 250, 250, 0.15)';
        scrollThumb.style.borderColor = '#fafafa';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        requestAnimationFrame(() => {
            const deltaY = e.clientY - startY;
            const scrollRatio = galleryContainer.scrollHeight / scrollTrack.clientHeight;
            galleryContainer.scrollTop = startScrollTop + (deltaY * scrollRatio);
        });
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            scrollThumb.style.background = 'transparent';
            scrollThumb.style.borderColor = '#fafafa';
        }
    });

    // Click on track to scroll
    scrollTrack.addEventListener('click', (e) => {
        if (e.target === scrollTrack) {
            const clickPosition = e.clientY - scrollTrack.getBoundingClientRect().top;
            const scrollPercentage = clickPosition / scrollTrack.clientHeight;
            galleryContainer.scrollTop = scrollPercentage * (galleryContainer.scrollHeight - galleryContainer.clientHeight);
        }
    });
}

// ============================================================================
// DETAILS PANEL SCROLLBAR FUNCTIONALITY
// ============================================================================
function initDetailsScrollbar() {
    const detailsContainer = document.getElementById('detailsScrollContainer');
    const detailsScrollThumb = document.getElementById('detailsScrollThumb');
    const detailsScrollTrack = document.querySelector('.custom-scrollbar-right');

    if (!detailsContainer || !detailsScrollThumb || !detailsScrollTrack) return;

    function updateDetailsScrollbarVisibility() {
        if (detailsContainer.scrollHeight <= detailsContainer.clientHeight) {
            detailsScrollTrack.style.display = 'none';
        } else {
            detailsScrollTrack.style.display = 'block';
        }
    }

    function updateDetailsScrollThumb() {
        if (detailsContainer.scrollHeight <= detailsContainer.clientHeight) return;

        const scrollPercentage = detailsContainer.scrollTop / (detailsContainer.scrollHeight - detailsContainer.clientHeight);
        const thumbHeight = 100;
        const thumbTop = scrollPercentage * (detailsScrollTrack.clientHeight - thumbHeight);

        detailsScrollThumb.style.height = thumbHeight + 'px';
        detailsScrollThumb.style.top = thumbTop + 'px';
    }

    detailsContainer.addEventListener('scroll', updateDetailsScrollThumb);
    window.addEventListener('load', () => {
        updateDetailsScrollbarVisibility();
        updateDetailsScrollThumb();
    });
    window.addEventListener('resize', () => {
        updateDetailsScrollbarVisibility();
        updateDetailsScrollThumb();
    });

    // Make details scrollbar draggable
    let isDetailsDragging = false;
    let detailsStartY = 0;
    let detailsStartScrollTop = 0;

    detailsScrollThumb.addEventListener('mousedown', (e) => {
        isDetailsDragging = true;
        detailsStartY = e.clientY;
        detailsStartScrollTop = detailsContainer.scrollTop;
        detailsScrollThumb.style.background = '#fafafa';
        detailsScrollThumb.style.borderColor = '#141414';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDetailsDragging) return;

        requestAnimationFrame(() => {
            const deltaY = e.clientY - detailsStartY;
            const scrollRatio = detailsContainer.scrollHeight / detailsScrollTrack.clientHeight;
            detailsContainer.scrollTop = detailsStartScrollTop + (deltaY * scrollRatio);
        });
    });

    document.addEventListener('mouseup', () => {
        if (isDetailsDragging) {
            isDetailsDragging = false;
            detailsScrollThumb.style.background = '#fafafa';
            detailsScrollThumb.style.borderColor = '#141414';
        }
    });

    // Click on details track to scroll
    detailsScrollTrack.addEventListener('click', (e) => {
        if (e.target === detailsScrollTrack) {
            const clickPosition = e.clientY - detailsScrollTrack.getBoundingClientRect().top;
            const scrollPercentage = clickPosition / detailsScrollTrack.clientHeight;
            detailsContainer.scrollTop = scrollPercentage * (detailsContainer.scrollHeight - detailsContainer.clientHeight);
        }
    });
}

// ============================================================================
// QUANTITY SELECTOR
// ============================================================================
let quantity = 1;

function increaseQuantity() {
    if (quantity < 10) {
        quantity++;
        document.getElementById('quantityValue').textContent = quantity;
    }
}

function decreaseQuantity() {
    if (quantity > 1) {
        quantity--;
        document.getElementById('quantityValue').textContent = quantity;
    }
}

// ============================================================================
// ADD TO TRUCK (CART) - Product Page Version
// ============================================================================
function addToTruck() {
    const productName = document.querySelector('.product-name').textContent;
    const productCode = document.querySelector('.product-code').textContent;

    // Get selected size
    const selectedSizeElement = document.querySelector('.size-option.selected');
    const selectedSize = selectedSizeElement ? selectedSizeElement.querySelector('.size-name').textContent : null;
    const selectedDimensions = selectedSizeElement ? selectedSizeElement.getAttribute('data-dimensions') : null;

    // Get all possible material selections (check multiple class variations)
    const selectedColorElement = document.querySelector('#color-section .selected, #lacquer-section .selected, #semi-satin-lacquer-section .selected');
    const selectedHardwoodElement = document.querySelector('#hardwood-finish-section .selected');
    const selectedLocalTeakElement = document.querySelector('#local-teak-section .selected');
    const selectedAllWoodsElement = document.querySelector('#all-woods-section .selected');
    const selectedWhiteCementElement = document.querySelector('#white-cement-section .selected');
    const selectedMetalElement = document.querySelector('#metal-section .selected');
    const selectedFabricElement = document.querySelector('#fabric-section .selected');
    const selectedLeatherElement = document.querySelector('#leather-section .selected');
    const selectedGRSElement = document.querySelector('#grs-section .selected');

    // Check which sections exist AND are visible on this product page
    function isVisible(el) {
        return el && el.style.display !== 'none' && el.offsetParent !== null;
    }
    const hasColorSection = isVisible(document.getElementById('color-section')) || isVisible(document.getElementById('lacquer-section')) || isVisible(document.getElementById('semi-satin-lacquer-section'));
    const hasHardwoodSection = isVisible(document.getElementById('hardwood-finish-section'));
    const hasLocalTeakSection = isVisible(document.getElementById('local-teak-section'));
    const hasAllWoodsSection = isVisible(document.getElementById('all-woods-section'));
    const hasWhiteCementSection = isVisible(document.getElementById('white-cement-section'));
    const hasMetalSection = isVisible(document.getElementById('metal-section'));
    const hasFabricSection = isVisible(document.getElementById('fabric-section'));
    const hasLeatherSection = isVisible(document.getElementById('leather-section'));
    const hasGRSSection = isVisible(document.getElementById('grs-section'));

    // Count available and selected materials
    const availableSections = [hasColorSection, hasHardwoodSection, hasLocalTeakSection, hasAllWoodsSection, hasWhiteCementSection, hasMetalSection, hasFabricSection, hasLeatherSection, hasGRSSection].filter(Boolean).length;
    const selectedMaterials = [selectedColorElement, selectedHardwoodElement, selectedLocalTeakElement, selectedAllWoodsElement, selectedWhiteCementElement, selectedMetalElement, selectedFabricElement, selectedLeatherElement, selectedGRSElement].filter(Boolean).length;

    // Validate based on material selection mode (set per product page)
    const mode = window.materialSelectionMode || 'none';

    if (mode === 'none') {
        // No validation needed
    } else if (mode === '1') {
        if (selectedMaterials === 0 || selectedMaterials > 1) {
            showSelectionWarning();
            return;
        }
    } else if (mode === '2') {
        if (selectedMaterials < 2 || selectedMaterials > 2) {
            showSelectionWarning();
            return;
        }
    } else if (mode === '3') {
        if (selectedMaterials < 3 || selectedMaterials > 3) {
            showSelectionWarning();
            return;
        }
    } else if (mode === 'all') {
        if (selectedMaterials < availableSections) {
            showSelectionWarning();
            return;
        }
    }

    // Get price - handle both regular and sale price formats
    const priceElement = document.querySelector('.product-price');
    let priceValue;
    let originalPrice = null;
    const salePriceSpan = priceElement.querySelector('span[style*="font-weight: 600"]');
    if (salePriceSpan) {
        priceValue = parseInt(salePriceSpan.textContent.replace(/[^0-9]/g, ''));
        const strikethroughSpan = priceElement.querySelector('span[style*="text-decoration: line-through"]');
        if (strikethroughSpan) {
            originalPrice = parseInt(strikethroughSpan.textContent.replace(/[^0-9]/g, ''));
        }
    } else {
        priceValue = parseInt(priceElement.textContent.replace(/[^0-9]/g, ''));
    }

    // Get thumbnail image
    const imageUrl = window.productThumbnailUrl || '';

    // Get material descriptions for cart display
    const selectedHardwood = selectedHardwoodElement ? (selectedHardwoodElement.getAttribute('title') || 'Hardwood') : 'N/A';
    const selectedLocalTeak = selectedLocalTeakElement ? (selectedLocalTeakElement.getAttribute('title') || 'Local Teak') : 'N/A';
    const selectedAllWoods = selectedAllWoodsElement ? (selectedAllWoodsElement.getAttribute('title') || 'Wood') : 'N/A';
    const selectedWhiteCement = selectedWhiteCementElement ? (selectedWhiteCementElement.getAttribute('title') || 'White Cement') : 'N/A';
    const selectedColor = selectedColorElement ? (selectedColorElement.getAttribute('title') || 'Color') : 'N/A';
    const selectedMetal = selectedMetalElement ? (selectedMetalElement.getAttribute('title') || 'Metal') : 'N/A';
    const selectedFabric = selectedFabricElement ? (selectedFabricElement.getAttribute('title') || 'Fabric') : 'N/A';
    const selectedLeather = selectedLeatherElement ? (selectedLeatherElement.getAttribute('title') || 'Leather') : 'N/A';
    const selectedGRS = selectedGRSElement ? (selectedGRSElement.getAttribute('title') || 'GRS') : 'N/A';

    // Build material description string
    let materials = [];
    if (selectedLocalTeak !== 'N/A') materials.push(`Wood: ${selectedLocalTeak}`);
    if (selectedHardwood !== 'N/A') materials.push(`Wood: ${selectedHardwood}`);
    if (selectedAllWoods !== 'N/A') materials.push(`Wood: ${selectedAllWoods}`);
    if (selectedWhiteCement !== 'N/A') materials.push(`Cement: ${selectedWhiteCement}`);
    if (selectedColor !== 'N/A') materials.push(`Color: ${selectedColor}`);
    if (selectedMetal !== 'N/A') materials.push(`Metal: ${selectedMetal}`);
    if (selectedFabric !== 'N/A') materials.push(`Fabric: ${selectedFabric}`);
    if (selectedLeather !== 'N/A') materials.push(`Leather: ${selectedLeather}`);
    if (selectedGRS !== 'N/A') materials.push(`GRS: ${selectedGRS}`);

    // Add each quantity as a separate item with full specifications
    for (let i = 0; i < quantity; i++) {
        addToCartWithDetails({
            name: productName,
            image: imageUrl,
            size: selectedSize,
            dimensions: selectedDimensions,
            materials: materials.join(', '),
            price: priceValue,
            originalPrice: originalPrice,
            code: `${productCode}-${Date.now()}-${i}`
        });
    }

    // Reset quantity
    quantity = 1;
    document.getElementById('quantityValue').textContent = quantity;

    // Show cart
    toggleCart();
}

// Extended addToCart for product pages with material details
function addToCartWithDetails(item) {
    if (!cartItems.find(cartItem => cartItem.code === item.code)) {
        cartItems.push(item);
        saveCart();
    }
    updateCart();
}

// ============================================================================
// MATERIAL & SIZE SELECTION
// ============================================================================
function selectSize(element) {
    document.querySelectorAll('.size-option').forEach(option => {
        option.classList.remove('selected');
    });
    element.classList.add('selected');

    const price = element.getAttribute('data-price');
    document.querySelector('.product-price').textContent = '$' + price + ' + iva';
}

function selectColor(element) {
    document.querySelectorAll('.color-swatch, .color-swatch-matte').forEach(swatch => {
        swatch.classList.remove('selected');
    });
    element.classList.add('selected');

    // If mode is 'one', deselect hardwood finishes when MDF color is selected (do not touch fabric section)
    if (window.materialSelectionMode === 'one') {
        const fabricSection = document.getElementById('fabric-section');
        document.querySelectorAll('.color-swatch-image').forEach(swatch => {
            if (!fabricSection || !fabricSection.contains(swatch)) {
                swatch.classList.remove('selected');
            }
        });
    }
}

function selectCedarColor(element) {
    document.querySelectorAll('.color-swatch-image').forEach(swatch => {
        swatch.classList.remove('selected');
    });
    element.classList.add('selected');

    // If mode is 'one', deselect MDF colors when hardwood finish is selected (do not touch fabric section)
    if (window.materialSelectionMode === 'one') {
        const fabricSection = document.getElementById('fabric-section');
        document.querySelectorAll('.color-swatch, .color-swatch-matte').forEach(swatch => {
            if (!fabricSection || !fabricSection.contains(swatch)) {
                swatch.classList.remove('selected');
            }
        });
    }

    if (typeof updatePriceWithUpcharges === 'function') {
        updatePriceWithUpcharges();
    }
}

function selectTeakFinish(element) {
    const teakSection = document.getElementById('local-teak-section');
    if (teakSection) {
        teakSection.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.classList.remove('selected');
        });
    }
    element.classList.add('selected');
}

function selectMaterial(element) {
    const fabricSection = document.getElementById('fabric-section');
    if (fabricSection && fabricSection.contains(element)) {
        // Fabric: only one selection at a time
        fabricSection.querySelectorAll('.color-swatch-image.selected, .color-swatch.selected').forEach(el => {
            el.classList.remove('selected');
        });
    } else {
        document.querySelectorAll('.material-chip').forEach(chip => {
            chip.classList.remove('selected');
        });
    }
    element.classList.add('selected');
}

// Update price based on material selections (including upcharges)
function updatePriceWithUpcharges() {
    const selectedSize = document.querySelector('.size-option.selected');
    let basePrice = selectedSize ? parseInt(selectedSize.getAttribute('data-price')) : (window.baseProductPrice || 0);

    if (window.materialUpcharges) {
        const leatherSection = document.getElementById('leather-section');
        if (leatherSection && leatherSection.querySelector('.color-swatch-image.selected')) {
            if (window.materialUpcharges.Leather) {
                basePrice += window.materialUpcharges.Leather;
            }
        }
    }

    document.querySelector('.product-price').textContent = '$' + basePrice.toLocaleString() + ' + iva';
}

// ============================================================================
// SPECIFICATION ACCORDION
// ============================================================================
function toggleSpec(element) {
    element.classList.toggle('open');
}

// ============================================================================
// SELECTION WARNING MODAL
// ============================================================================
function showSelectionWarning() {
    document.getElementById('selectionWarningModal').classList.add('active');
}

function closeSelectionWarning() {
    document.getElementById('selectionWarningModal').classList.remove('active');
}

// ============================================================================
// AUTO-SELECT LOCAL TEAK (disabled by default)
// ============================================================================
function autoSelectLocalTeak() {
    const localTeakSection = document.getElementById('local-teak-section');
    if (localTeakSection && localTeakSection.style.display !== 'none') {
        const firstOption = localTeakSection.querySelector('.color-swatch');
        if (firstOption && !firstOption.classList.contains('selected')) {
            selectTeakFinish(firstOption);
        }
    }
}

// ============================================================================
// PRODUCT PAGE INITIALIZATION
// ============================================================================
function initProductPage() {
    // Apply sale price if applicable
    checkAndApplySalePrice();

    // Initialize scrollbars
    initGalleryScrollbar();
    initDetailsScrollbar();

    // Load cart (from main.js)
    if (typeof loadCart === 'function') {
        loadCart();
    }

    // Initialize ticker (from main.js)
    if (typeof initializeTicker === 'function') {
        initializeTicker();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initProductPage);
