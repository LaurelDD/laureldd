// furniture.js

// ============================================================================
// GRID ITEMS — driven by Supabase is_grid column (products-data.js)
// ============================================================================
// Grid items for the showcase and "The Grid" filter come from productsDatabase
// where isGrid === true. Set is_grid in Supabase to control.

function getGridItems() {
    const db = typeof productsDatabase !== 'undefined' ? productsDatabase : [];
    return db.filter(p => p.isGrid);
}

function getGridCodes() {
    return getGridItems().map(p => p.code);
}

// Products Database - loaded from products-data.js before main.js

// ============================================================================
// NAVIGATION FUNCTIONS
// ============================================================================

// Save scroll position before navigating to product page
function saveScrollAndNavigate(url) {
    sessionStorage.setItem('furnitureScrollPosition', window.scrollY);
    window.location.href = url;
}

// Return to full landing page
function returnHome() {
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    document.querySelectorAll('.furniture-nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show all sections
    const introSection = document.querySelector('section[style*="max-width: 900px"]');
    const gridTitleBand = document.getElementById('gridTitleBand');
    const showcaseSection = document.querySelector('.collection-showcase');
    const featuredSection = document.querySelector('.featured-products');
    const editorialSection = document.querySelectorAll('.editorial-moment');
    const triptychSection = document.querySelector('.triptych-section');
    const logoContainer = document.getElementById('logoContainer');
    const allFurnitureSection = document.querySelector('.all-furniture-section');
    
    if (introSection) introSection.style.display = 'block';
    if (gridTitleBand) gridTitleBand.style.display = 'block'; // Changed from 'flex' to 'block'
    if (showcaseSection) showcaseSection.style.display = 'block';
    if (featuredSection) featuredSection.style.display = 'block';
    editorialSection.forEach(section => section.style.display = 'flex');
    if (triptychSection) triptychSection.style.display = 'block';
    if (logoContainer) logoContainer.style.display = 'flex';
    if (allFurnitureSection) {
        allFurnitureSection.querySelector('.section-header').style.display = 'block';
    }
    
    // Show badges on home page (not viewing The Grid)
    const productGrid = document.getElementById('productGrid');
    productGrid.classList.remove('hide-grid-badges');
    
    // Reset batch counter and hide batch products
    if (typeof currentBatch !== 'undefined') {
        currentBatch = 0;
    }
    
    // Hide all batch products, show only initial 3
    document.querySelectorAll('.product-card').forEach(product => {
        const hasBatch = product.dataset.batch;
        if (hasBatch) {
            product.classList.add('hidden');
            product.style.display = 'none';
        } else {
            product.style.display = 'flex';
        }
    });
    
    // Reset button to "See More"
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            See More
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        `;
        loadMoreBtn.style.pointerEvents = 'auto';
        loadMoreBtn.style.opacity = '1';
    }
}

// ============================================================================
// CATEGORY FILTERING & NAVIGATION
// ============================================================================

// Main category filter function
// Handles: Home, All, Seating, Tables, Lighting, Outdoor, Window Treatments, The Grid
function filterCategory(category) {
    // Prevent any flash by using requestAnimationFrame
    requestAnimationFrame(() => {
        // Update active button immediately
        document.querySelectorAll('.furniture-nav-link').forEach(link => {
            link.classList.remove('active');
            const linkText = link.textContent.toLowerCase().replace(' ', '-');
            if (linkText === category || (category === 'all' && linkText === 'all')) {
                link.classList.add('active');
            }
        });
        
        // Reset "See More" button to default state when changing categories
        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                See More
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            `;
            // Restore the loadMoreProducts onclick handler
            loadMoreBtn.removeAttribute('onclick');
            loadMoreBtn.onclick = loadMoreProducts;
            loadMoreBtn.style.pointerEvents = 'auto';
            loadMoreBtn.style.opacity = '1';
        }
        
        // Get all elements to hide/show
        const introSection = document.querySelector('section[style*="max-width: 900px"]');
        const gridTitleBand = document.getElementById('gridTitleBand');
        const showcaseSection = document.querySelector('.collection-showcase');
        const featuredSection = document.querySelector('.featured-products');
        const editorialSections = document.querySelectorAll('.editorial-moment');
        const triptychSection = document.querySelector('.triptych-section');
        const logoContainer = document.getElementById('logoContainer');
        const allFurnitureSection = document.querySelector('.all-furniture-section');
        const loadMoreContainer = document.querySelector('.load-more-container');
        
        // Use CSS transitions for smooth hide/show
        const hideElement = (el) => {
            if (el) {
                el.style.transition = 'opacity 0.2s ease';
                el.style.opacity = '0';
                setTimeout(() => {
                    el.style.display = 'none';
                    el.style.opacity = '1';
                }, 200);
            }
        };
        
        const showElement = (el) => {
            if (el) {
                el.style.display = '';
                el.style.transition = 'opacity 0.2s ease';
                el.style.opacity = '0';
                requestAnimationFrame(() => {
                    el.style.opacity = '1';
                });
            }
        };
        
        // Handle different categories
        if (category === 'home') {
            // HOME = Full furniture page with all decorative sections
            document.body.classList.remove('wt-view');
            const wtSection = document.getElementById('windowTreatmentsSection');
            if (wtSection) hideElement(wtSection);
            showElement(introSection);
            showElement(logoContainer);
            showElement(gridTitleBand);
            showElement(showcaseSection);
            showElement(featuredSection);
            editorialSections.forEach(section => showElement(section));
            showElement(triptychSection);
            if (allFurnitureSection) {
                showElement(allFurnitureSection);
                showElement(allFurnitureSection.querySelector('.section-header'));
            }
            
            // Show only the first batch of products
            document.querySelectorAll('.product-card').forEach((card, index) => {
                if (index < 12 && !card.dataset.batch) {
                    card.classList.remove('hidden');
                    card.style.display = 'flex';
                } else if (card.dataset.batch) {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }
            });
            
            // Show all badges
            document.querySelectorAll('.sale-badge').forEach(badge => {
                badge.style.display = '';
            });
            
            // Show load more button
            showElement(loadMoreContainer);
            
        } else if (category === 'all') {
            // ALL = Show ALL furniture thumbnails only (no decorative sections)
            document.body.classList.remove('wt-view');
            const wtSection = document.getElementById('windowTreatmentsSection');
            if (wtSection) hideElement(wtSection);
            hideElement(introSection);
            hideElement(logoContainer);
            hideElement(gridTitleBand);
            hideElement(showcaseSection);
            hideElement(featuredSection);
            editorialSections.forEach(section => hideElement(section));
            hideElement(triptychSection);
            if (allFurnitureSection) {
                showElement(allFurnitureSection);
                hideElement(allFurnitureSection.querySelector('.section-header'));
            }
            
            // Show ALL products
            let allCount = 0;
            document.querySelectorAll('.product-card').forEach(card => {
                if (allCount < 12) {
                    card.classList.remove('hidden');
                    card.style.display = 'flex';
                    allCount++;
                } else {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }
            });
            
            // Store for load more
            window.currentFilteredCategory = 'all';
            window.currentFilteredProducts = Array.from(document.querySelectorAll('.product-card'));
            
            // Show all badges
            document.querySelectorAll('.sale-badge').forEach(badge => {
                badge.style.display = '';
            });
            
            // Show load more button
            showElement(loadMoreContainer);
            
        } else {
            // Special handling for "The Grid" - show product cards for grid items only
            if (category === 'grid') {
                // Hide all decorative sections including showcase
                hideElement(introSection);
                hideElement(logoContainer);
                hideElement(showcaseSection);
                hideElement(featuredSection);
                hideElement(gridTitleBand);
                editorialSections.forEach(section => hideElement(section));
                hideElement(triptychSection);
                if (allFurnitureSection) {
                    hideElement(allFurnitureSection.querySelector('.section-header'));
                }
                
                // Show ONLY product cards whose code is in Supabase is_grid
                const gridCodes = getGridCodes();
                const allProducts = document.querySelectorAll('.product-card');
                let gridProducts = [];

                allProducts.forEach(card => {
                    const code = (card.dataset.code || '').trim();
                    const isGrid = code && gridCodes.includes(code);
                    if (isGrid) {
                        gridProducts.push(card);
                        card.classList.remove('hidden');
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                        card.classList.add('hidden');
                    }
                });
                
                // Hide "GRID ITEM 15% OFF" badges in grid view
                document.querySelectorAll('.sale-badge').forEach(badge => {
                    if (badge.textContent.includes('GRID ITEM')) {
                        badge.style.display = 'none';
                    }
                });
                
                // Change load more button to "Back to Home" link for grid view
                if (loadMoreBtn) {
                    loadMoreBtn.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                        Back to Home
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    `;
                    // Remove old onclick attribute and set new one
                    loadMoreBtn.removeAttribute('onclick');
                    loadMoreBtn.onclick = function() { filterCategory('home'); };
                    loadMoreBtn.style.pointerEvents = 'auto';
                    loadMoreBtn.style.opacity = '1';
                }
                showElement(loadMoreContainer);
                
                // Store for reference
                window.currentFilteredCategory = 'grid';
                window.currentFilteredProducts = gridProducts;
                
                return; // Exit early, don't process normal filtering
            }
            
            // Special handling for "Window Treatments" - show WT content section
            if (category === 'window-treatments') {
                hideElement(introSection);
                hideElement(logoContainer);
                hideElement(showcaseSection);
                hideElement(featuredSection);
                hideElement(gridTitleBand);
                editorialSections.forEach(section => hideElement(section));
                hideElement(triptychSection);
                if (allFurnitureSection) {
                    hideElement(allFurnitureSection);
                }
                hideElement(loadMoreContainer);
                const wtSection = document.getElementById('windowTreatmentsSection');
                if (wtSection) {
                    showElement(wtSection);
                    initWtShowcaseCarousel();
                }
                document.body.classList.add('wt-view');
                window.currentFilteredCategory = 'window-treatments';
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            
            // Hide Window Treatments section when showing any other category
            document.body.classList.remove('wt-view');
            const wtSection = document.getElementById('windowTreatmentsSection');
            if (wtSection) {
                hideElement(wtSection);
            }
            
            // Hide decorative sections for specific categories (non-grid)
            hideElement(introSection);
            hideElement(logoContainer);
            hideElement(showcaseSection);
            hideElement(featuredSection);
            hideElement(gridTitleBand);
            editorialSections.forEach(section => hideElement(section));
            hideElement(triptychSection);
            // Show the product grid section (it may have been hidden when viewing Window Treatments)
            if (allFurnitureSection) {
                showElement(allFurnitureSection);
                hideElement(allFurnitureSection.querySelector('.section-header'));
            }
            
            // Show badges in other categories
            document.querySelectorAll('.sale-badge').forEach(badge => {
                badge.style.display = '';
            });
            
            // Filter products with smooth transition (for non-grid categories)
            const allProducts = document.querySelectorAll('.product-card');
            let visibleCount = 0;
            let matchingProducts = [];
            
            allProducts.forEach(card => {
                const cardCategories = (card.dataset.category || '').split(' ');
                const shouldShow = cardCategories.includes(category);
                
                if (shouldShow) {
                    matchingProducts.push(card);
                }
                
                // Initially hide all
                card.style.display = 'none';
                card.classList.add('hidden');
            });
            
            // Show first 12 matching products
            matchingProducts.forEach((card, index) => {
                if (index < 12) {
                    card.classList.remove('hidden');
                    card.style.display = 'flex';
                    visibleCount++;
                }
            });
            
            // Store the current category and remaining products for load more
            window.currentFilteredCategory = category;
            window.currentFilteredProducts = matchingProducts;
            
            // Show "More Options Coming Soon" if no products in category
            if (visibleCount === 0 && category !== 'all') {
                const productGrid = document.getElementById('productGrid');
                if (productGrid) {
                    // Check if placeholder already exists
                    let placeholder = document.getElementById('emptyPlaceholder');
                    if (!placeholder) {
                        placeholder = document.createElement('div');
                        placeholder.id = 'emptyPlaceholder';
                        placeholder.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 80px 20px; font-family: "Geist Mono", monospace;';
                        placeholder.innerHTML = `
                            <h3 style="font-size: 1.5rem; color: #141414; margin-bottom: 10px; font-weight: 500;">More Options Coming Soon</h3>
                            <p style="font-size: 0.9rem; color: #583c4a;">Check back later for new additions to this category</p>
                        `;
                        productGrid.appendChild(placeholder);
                    }
                    placeholder.style.display = 'block';
                }
            } else {
                // Hide placeholder if it exists
                const placeholder = document.getElementById('emptyPlaceholder');
                if (placeholder) {
                    placeholder.style.display = 'none';
                }
            }
            
            // Update load more button
            if (visibleCount === 0) {
                hideElement(loadMoreContainer);
            } else {
                showElement(loadMoreContainer);
            }
        }
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Build the main product grid from productsDatabase (thumbnail_url). Shows all products; first 12 visible, rest in "See More".
function renderProductGrid() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    const db = typeof productsDatabase !== 'undefined' ? productsDatabase : [];
    const products = db.slice().sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    if (products.length === 0) return;

    const INITIAL_VISIBLE = 12;
    let html = '';
    products.forEach((p, index) => {
        const categoryStr = Array.isArray(p.category) ? p.category.join(' ') : (p.category || '');
        const isSale = p.originalPrice != null && p.originalPrice > p.price;
        const hiddenClass = index >= INITIAL_VISIBLE ? ' hidden' : '';
        const batchAttr = index >= INITIAL_VISIBLE ? ' data-batch="1"' : '';
        const saleAttr = isSale ? ' data-sale="true"' : '';
        const imgSrc = (p.image || '').replace(/'/g, "\\'");
        const nameEsc = (p.name || '').replace(/'/g, "\\'");
        const priceHtml = isSale
            ? `<span class="price-original">$${(p.originalPrice || 0).toLocaleString()}</span><span class="price-sale">$${(p.price || 0).toLocaleString()}</span> + iva`
            : `$${(p.price || 0).toLocaleString()} + iva`;
        const saleBadge = isSale ? '<div class="sale-badge">GRID ITEM 15% OFF</div>' : '';
        html += `
                <div class="product-card${hiddenClass}" data-code="${(p.code || '').replace(/"/g, '&quot;')}" data-category="${(categoryStr || '').replace(/"/g, '&quot;')}"${batchAttr}${saleAttr}>
                    <div class="product-image-container">
                        ${saleBadge}
                        <img src="${(p.image || '').replace(/"/g, '&quot;')}" alt="${(p.name || '').replace(/"/g, '&quot;')}" class="product-image">
                    </div>
                    <button class="btn-view" onclick="saveScrollAndNavigate('${(p.url || '').replace(/'/g, "\\'")}')">View</button>
                    <div class="product-info">
                        <h3 class="product-name">${(p.name || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</h3>
                        <div class="product-price">${priceHtml}</div>
                    </div>
                    <button class="btn-add-cart" onclick="addToCart('${nameEsc}', ${p.price}, '${(p.code || '').replace(/'/g, "\\'")}', '${imgSrc}'${isSale ? ', ' + (p.originalPrice || p.price) : ''})">Add to Truck</button>
                </div>`;
    });
    grid.innerHTML = html;
    syncGridBadges();
}

// Load more products function
function loadMoreProducts() {
    const allProducts = document.querySelectorAll('.product-card');
    const activeButton = document.querySelector('.furniture-nav-link.active');
    const currentCategory = activeButton ? activeButton.textContent.toLowerCase().replace(/\s+/g, '-') : 'home';
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    // Do nothing if we're viewing The Grid - button should navigate to 'all' instead
    if (currentCategory === 'the-grid') {
        return;
    }
    
    if (currentCategory === 'home') {
        // Home view - load next batch
        const hiddenBatched = document.querySelectorAll('.product-card.hidden[data-batch]');
        let shown = 0;
        hiddenBatched.forEach(card => {
            if (shown < 12) {
                card.classList.remove('hidden');
                card.style.display = 'flex';
                shown++;
            }
        });
        
        if (shown === 0) {
            // Change button text to "More Options Coming Soon"
            if (loadMoreBtn) {
                loadMoreBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    More Options Coming Soon
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                `;
                loadMoreBtn.style.pointerEvents = 'none';
                loadMoreBtn.style.opacity = '0.6';
            }
        }
    } else if (window.currentFilteredProducts) {
        // Filtered view - show next 12 from filtered products
        let shown = 0;
        let visibleCount = 0;
        
        // Count currently visible
        window.currentFilteredProducts.forEach(card => {
            if (card.style.display === 'flex') {
                visibleCount++;
            }
        });
        
        // Show next 12
        window.currentFilteredProducts.forEach((card, index) => {
            if (index >= visibleCount && index < visibleCount + 12) {
                card.classList.remove('hidden');
                card.style.display = 'flex';
                shown++;
            }
        });
        
        // Change button text if no more to show
        if (shown === 0) {
            if (loadMoreBtn) {
                loadMoreBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    More Options Coming Soon
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                `;
                loadMoreBtn.style.pointerEvents = 'none';
                loadMoreBtn.style.opacity = '0.6';
            }
        }
    }
}

// Generate Season Markdown Grid from Supabase is_grid products
function generateSeasonMarkdownGrid() {
    const gridContainer = document.querySelector('.collection-showcase .showcase-grid');
    const items = getGridItems();
    if (!gridContainer || items.length === 0) return;

    let html = '';
    items.forEach(item => {
        // Grid is "15% Off" — use stored original or derive so cart shows strikethrough
        const salePrice = item.price;
        const originalPrice = item.originalPrice != null && item.originalPrice > salePrice
            ? item.originalPrice
            : Math.round(salePrice / 0.85);
        const sourceClass = 'makemake';
        const sourceText = 'MAKEMAKE';
        const wideClass = '';
        const discount = originalPrice > 0 ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;

        const elementTag = item.url ? 'a' : 'div';
        const hrefAttr = item.url ? `href="${item.url}"` : '';
        const addToCartOnclick = `addToCart('${(item.name || '').replace(/'/g, "\\'")}', ${salePrice}, '${(item.code || '').replace(/'/g, "\\'")}', '${(item.image || '').replace(/'/g, "\\'")}', ${originalPrice}); event.preventDefault(); event.stopPropagation();`;
        html += `
            <${elementTag} ${hrefAttr} class="showcase-item ${wideClass}">
                <img src="${(item.image || '').replace(/"/g, '&quot;')}" alt="${(item.name || '').replace(/"/g, '&quot;')}" class="showcase-item-image">
                <div class="showcase-item-overlay">
                    <div class="showcase-item-source ${sourceClass}">${sourceText}</div>
                    <div class="showcase-item-name">${(item.name || '').replace(/</g, '&lt;')}</div>
                    <div class="showcase-item-prices">
                        <span class="showcase-item-original-price">$${originalPrice.toLocaleString()}</span>
                        <span class="showcase-item-sale-price">$${salePrice.toLocaleString()}</span>
                    </div>
                    <div class="showcase-item-markdown">${discount}% Off</div>
                    <button type="button" class="showcase-item-add-btn" onclick="${addToCartOnclick}">Add to Truck</button>
                </div>
            </${elementTag}>
        `;
    });

    gridContainer.innerHTML = html;
    syncGridBadges();
}

// Sync "GRID ITEM 15% OFF" badges on product cards to Supabase is_grid (show only when code is in grid)
function syncGridBadges() {
    const gridCodes = getGridCodes();
    document.querySelectorAll('.product-card').forEach(card => {
        const code = (card.dataset.code || '').trim();
        const badge = card.querySelector('.sale-badge');
        if (badge) {
            badge.style.display = code && gridCodes.includes(code) ? '' : 'none';
        }
    });
}

// Populate product grid from Supabase (productsDatabase) on load
document.addEventListener('DOMContentLoaded', function() {
    renderProductGrid();
});

// Determine initial view based on URL
function getInitialView() {
    if (window.location.hash) {
        return window.location.hash.substring(1);
    }
    return 'home'; // default view
}

// Apply view immediately on page load
function applyInitialView() {
    const view = getInitialView();
    
    if (view !== 'home') {
        // We're coming from a product page - apply filter immediately
        // This runs BEFORE DOMContentLoaded, so we need to wait for elements
        document.addEventListener('DOMContentLoaded', function() {
            // Find and click the appropriate button without any delay
            const buttons = document.querySelectorAll('.furniture-nav-link');
            buttons.forEach(button => {
                const buttonText = button.textContent.toLowerCase().replace(/\s+/g, '-');
                if (buttonText === view ||
                    (button.textContent === 'Window Treatments' && view === 'window-treatments') ||
                    (button.textContent === 'The Grid' && view === 'grid') ||
                    (button.textContent === 'All' && view === 'all')) {
                    // Prevent scroll on initial filter
                    const originalScrollTo = window.scrollTo;
                    window.scrollTo = function() {};
                    button.click();
                    window.scrollTo = originalScrollTo;
                }
            });
        });
    }
}

// Run immediately
applyInitialView();

// ============================================================================
// WINDOW TREATMENTS — Modal & Carousel (when WT section is visible on furniture page)
// ============================================================================
var wtShowcaseCurrentSlide = 0;
var wtShowcaseSlides = null;
var wtShowcaseDots = null;
var wtShowcaseInterval = null;

function wtShowcaseGoToSlide(index) {
    wtShowcaseSlides = document.querySelectorAll('#windowTreatmentsSection .wt-showcase-slide');
    wtShowcaseDots = document.querySelectorAll('#windowTreatmentsSection .wt-showcase-dots .wt-dot-wrapper');
    if (!wtShowcaseSlides || wtShowcaseSlides.length === 0) return;
    if (wtShowcaseSlides[wtShowcaseCurrentSlide]) {
        wtShowcaseSlides[wtShowcaseCurrentSlide].classList.remove('active');
    }
    if (wtShowcaseDots && wtShowcaseDots[wtShowcaseCurrentSlide]) {
        wtShowcaseDots[wtShowcaseCurrentSlide].classList.remove('active');
    }
    wtShowcaseCurrentSlide = index;
    if (wtShowcaseSlides[wtShowcaseCurrentSlide]) wtShowcaseSlides[wtShowcaseCurrentSlide].classList.add('active');
    if (wtShowcaseDots && wtShowcaseDots[wtShowcaseCurrentSlide]) wtShowcaseDots[wtShowcaseCurrentSlide].classList.add('active');
}

function initWtShowcaseCarousel() {
    wtShowcaseSlides = document.querySelectorAll('#windowTreatmentsSection .wt-showcase-slide');
    wtShowcaseDots = document.querySelectorAll('#windowTreatmentsSection .wt-showcase-dots .wt-dot-wrapper');
    wtShowcaseCurrentSlide = 0;
    if (wtShowcaseInterval) clearInterval(wtShowcaseInterval);
    if (wtShowcaseSlides.length > 0) {
        wtShowcaseInterval = setInterval(function() {
            var next = (wtShowcaseCurrentSlide + 1) % wtShowcaseSlides.length;
            wtShowcaseGoToSlide(next);
        }, 5000);
    }
}

function openWtModal() {
    var modal = document.getElementById('wtContactModal');
    if (!modal) return;
    modal.classList.add('active');
    var form = document.getElementById('wtModalForm');
    var success = document.getElementById('wtModalSuccess');
    if (form) form.style.display = 'block';
    if (success) success.style.display = 'none';
    var input = document.getElementById('wtContactInput');
    if (input) input.value = '';
    var checkboxes = modal.querySelectorAll('input[name="swatchBatch"]');
    if (checkboxes) checkboxes.forEach(function(cb) { cb.checked = false; });
    clearWtError();
}

function closeWtModal() {
    var modal = document.getElementById('wtContactModal');
    if (modal) modal.classList.remove('active');
}

function clearWtError() {
    var err = document.getElementById('wtModalError');
    if (err) { err.textContent = ''; err.classList.remove('visible'); }
}

function submitWtContact() {
    var checkboxes = document.querySelectorAll('#wtContactModal input[name="swatchBatch"]:checked');
    var input = document.getElementById('wtContactInput');
    var form = document.getElementById('wtModalForm');
    var success = document.getElementById('wtModalSuccess');
    var errEl = document.getElementById('wtModalError');
    clearWtError();
    if (!checkboxes || checkboxes.length === 0) {
        if (errEl) { errEl.textContent = 'Please select at least one swatch collection.'; errEl.classList.add('visible'); }
        return;
    }
    if (!input || !input.value.trim()) {
        if (errEl) { errEl.textContent = 'Please enter your email.'; errEl.classList.add('visible'); }
        return;
    }
    var email = input.value.trim();
    var swatchBatches = Array.prototype.map.call(checkboxes, function(cb) { return cb.value; }).join(', ');

    if (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:') {
        if (form) form.style.display = 'none';
        if (success) success.style.display = 'block';
        setTimeout(closeWtModal, 2000);
        return;
    }

    var submitBtn = document.querySelector('#wtContactModal .wt-modal-submit');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
    fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: (typeof encodeFormData === 'function' ? encodeFormData : function(d) {
            return Object.keys(d).map(function(k) { return encodeURIComponent(k) + '=' + encodeURIComponent(d[k]); }).join('&');
        })({
            'form-name': 'wt-swatches',
            email: email,
            swatch_batches: swatchBatches
        })
    }).then(function(res) {
        if (res.ok) {
            if (form) form.style.display = 'none';
            if (success) success.style.display = 'block';
            setTimeout(closeWtModal, 2000);
        } else {
            if (errEl) { errEl.textContent = 'Something went wrong. Please try again or email contact@la-urel.com'; errEl.classList.add('visible'); }
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Request Swatches'; }
        }
    }).catch(function() {
        if (errEl) { errEl.textContent = 'Something went wrong. Please try again or email contact@la-urel.com'; errEl.classList.add('visible'); }
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Request Swatches'; }
    });
}

// Contact Us modal (Let's Get Started)
function openContactModal() {
    var modal = document.getElementById('contactUsModal');
    if (!modal) return;
    modal.classList.add('active');
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

// Close modals when clicking overlay
document.addEventListener('click', function(e) {
    var wtModal = document.getElementById('wtContactModal');
    if (wtModal && e.target === wtModal) closeWtModal();
    var contactModal = document.getElementById('contactUsModal');
    if (contactModal && e.target === contactModal) closeContactModal();
});

// ============================================================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================================================
window.saveScrollAndNavigate = saveScrollAndNavigate;
window.returnHome = returnHome;
window.filterCategory = filterCategory;
window.generateSeasonMarkdownGrid = generateSeasonMarkdownGrid;
window.syncGridBadges = syncGridBadges;
window.renderProductGrid = renderProductGrid;
window.loadMoreProducts = typeof loadMoreProducts !== 'undefined' ? loadMoreProducts : function() {};
window.wtShowcaseGoToSlide = wtShowcaseGoToSlide;
window.openWtModal = openWtModal;
window.closeWtModal = closeWtModal;
window.clearWtError = clearWtError;
window.submitWtContact = submitWtContact;
window.openContactModal = openContactModal;
window.closeContactModal = closeContactModal;
window.updateContactPlaceholder = updateContactPlaceholder;
window.submitContact = submitContact;