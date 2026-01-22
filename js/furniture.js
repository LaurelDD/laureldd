// furniture.js

// ============================================================================
// SEASON MARKDOWNS CONFIGURATION
// ============================================================================
// To update the grid: add/remove items from this array
// Grid will automatically generate based on this list
const seasonMarkdowns = [
    { 
        code: 'RUG001', 
        name: 'CJ Rug (11\' x 15\')', 
        image: 'https://i.imgur.com/catLL4R.jpg', 
        originalPrice: 2300, 
        salePrice: 1955, 
        url: null, // No product page
        source: 'curated',
        gridPosition: 1,
        wide: false,
        imageStyle: 'transform: scale(1.10); object-fit: cover;'
    },
    { 
        code: 'CT018', 
        name: 'Petra Coffee Table', 
        image: 'https://i.imgur.com/qPjmklI.jpg', 
        originalPrice: 1900, 
        salePrice: 1615, 
        url: 'petra-coffee-table.html',
        source: 'makemake',
        gridPosition: 2,
        wide: false,
        imageStyle: ''
    },
    { 
        code: 'VES001', 
        name: 'Aged Terracotta Vessel', 
        image: 'https://i.imgur.com/lpQ4exS.jpg', 
        originalPrice: 310, 
        salePrice: 265, 
        url: null,
        source: 'curated',
        gridPosition: 3,
        wide: false,
        imageStyle: ''
    },
    { 
        code: 'CH020', 
        name: 'Dane Chair', 
        image: 'https://i.imgur.com/xd8FO8T.jpg', 
        originalPrice: 1800, 
        salePrice: 1530, 
        url: null,
        source: 'curated',
        gridPosition: 4,
        wide: false,
        imageStyle: ''
    },
    { 
        code: 'SB001', 
        name: 'Kinser Sideboard', 
        image: 'https://i.imgur.com/UpOOzHG.jpg', 
        originalPrice: 2225, 
        salePrice: 1891, 
        url: null,
        source: 'curated',
        gridPosition: 5,
        wide: false,
        imageStyle: ''
    },
    { 
        code: 'SO009',
        name: 'Sistema Sofa', 
        image: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1763335644/Sistema_3Seater_ryg1qz.jpg', 
        originalPrice: 5900, 
        salePrice: 5015, 
        url: 'sistema-sofa.html',
        source: 'makemake',
        gridPosition: 6,
        wide: true,
        imageStyle: ''
    },
    { 
        code: 'DT015', 
        name: 'Cobie Dining Table', 
        image: 'https://i.imgur.com/cVy6Ys1.jpg', 
        originalPrice: 1700, 
        salePrice: 1445, 
        url: null,
        source: 'curated',
        gridPosition: 7,
        wide: false,
        imageStyle: ''
    },
    { 
        code: 'CON001', 
        name: 'Ginger Console', 
        image: 'https://i.imgur.com/6xbSNIk.jpg', 
        originalPrice: 2200, 
        salePrice: 1870, 
        url: null,
        source: 'curated',
        gridPosition: 8,
        wide: true,
        imageStyle: 'object-position: center 70%;'
    },
    { 
        code: 'CH021', 
        name: 'Lowell Swivel Chair', 
        image: 'https://i.imgur.com/mpIKJmJ.jpg', 
        originalPrice: 1700, 
        salePrice: 1445, 
        url: null,
        source: 'curated',
        gridPosition: 9,
        wide: false,
        imageStyle: ''
    },
    { 
        code: 'AT006',
        name: 'Dizi Side Table', 
        image: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1763159484/Dizi_Thumbnail_zomhav.jpg', 
        originalPrice: 526, 
        salePrice: 447, 
        url: 'dizi-side-table.html',
        source: 'makemake',
        gridPosition: 10,
        wide: false,
        imageStyle: 'transform: scale(1.15) translateY(30px); transform-origin: center bottom; object-fit: cover; object-position: center 70%;'
    }
];

// Products Database for Search
const productsDatabase = [
    { name: 'Rosario Bistro Table', code: 'BT001', price: 715, url: 'rosario-bistro-table.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/w_400/v1763160838/Rosario_Thumbnail_gyybkh.jpg' },
    { name: 'Petra Coffee Table', code: 'CT018', price: 1615, originalPrice: 1900, url: 'petra-coffee-table.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1763160629/Petra_Thumbnail_n7tgb1.png' },
    { name: 'Mano Sofa', code: 'SO010', price: 2255, url: 'mano-sofa.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/c_pad,w_400,h_600/v1763325273/Mano_Sofa_Thumbnail_kfl44u.jpg' },
    { name: 'Depto Parsons Desk', code: 'DK001', price: 1150, url: 'depto-parsons-desk.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1763156930/Depto._Parsons__Thumbnail_mhnnjq.jpg' },
    { name: 'Globo Side Table', code: 'AT001', price: 675, url: 'globo-side-table.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1763338971/Globo_Thumbnail_unymli.jpg' },
    { name: 'Ronda Coffee Table', code: 'CT001', price: 1380, url: 'ronda-coffee-table.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1763160052/Ronda_Coffee_Thumbnail_wdfbmj.jpg' },
    { name: 'Dizi Side Table', code: 'AT006', price: 446, originalPrice: 525, url: 'dizi-side-table.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1763159484/Dizi_Thumbnail_zomhav.jpg' },
    { name: 'Dizi Coffee Table', code: 'CT004', price: 1200, url: 'dizi-coffee-table.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1763160506/Dizi_Coffee_Thumbnail_uzac9u.png' },
    { name: 'Cazo Side Chair', code: 'SCH002', price: 900, url: 'cazo-side-chair.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1763160786/Cazo_Thumbnail_ogbvfi.jpg' },
    { name: 'Barro No2 Side Table', code: 'AT016', price: 555, url: 'barro-no2-side-table.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1763161511/Barro_No.2_Thumbnail_vebhc6.jpg' },
    { name: 'Mano Chair', code: 'CH017', price: 1240, url: 'mano-chair.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/c_pad/v1763326215/Mano_Chair_Thumbnail_nk1oir.jpg' },
    { name: 'Rio Chair', code: 'CH005', price: 1130, url: 'rio-chair.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1763340150/Silla_Rio_Thumbnail_o91sh0.jpg' },
    { name: 'Perse Chair', code: 'CH010', price: 815, url: 'perse-chair.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1764016863/Perse_Thumbnail_x31dc6.jpg' },
    { name: 'Fortuna Chair', code: 'CH012', price: 695, url: 'fortuna-chair.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1764017495/Fortuna_Thumbnail_g0mngb.jpg' },
    { name: 'Poroti Side Table', code: 'AT007', price: 565, url: 'poroti-side-table.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1763328213/Poroti_Thumbnail_mh0wer.jpg' },
    { name: 'Bloque No1 Side Table', code: 'AT009', price: 400, url: 'bloque-no1-side-table.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1763328240/BloqueNo1_Thumbnail_erl34n.jpg' },
    { name: 'Plato Side Table', code: 'AT018', price: 675, url: 'plato-side-table.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1763328562/Plato_Thumbnail_amcs4n.jpg' },
    { name: 'Half Side Table', code: 'AT004', price: 495, url: 'half-side-table.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1763328283/Half_Thumbnail_bphvyz.jpg' },
    { name: 'Pablo Side Table', code: 'AT020', price: 475, url: 'pablo-side-table.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1763328308/Pablo_Thumbnail_pix7xx.jpg' },
    { name: 'Amanita Side Table', code: 'AT026', price: 700, url: 'amanita-side-table.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1764019628/Amanita_Thumbnail_vc22ih.jpg' },
    { name: 'Gracia Dining Table', code: 'DT012', price: 2650, url: 'gracia-dining-table.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1763328499/Gracia_Thumbnail_igvbct.jpg' },
    { name: 'Winnie Side Table', code: 'AT028', price: 515, url: 'winnie-side-table.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1763337412/Winnie_Thumb_iajm0w.jpg' },
    { name: 'Morfeo Daybed', code: 'DB001', price: 2225, url: 'morfeo-daybed.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/w_600,h_600,c_pad,b_white,e_background_removal,f_auto,q_auto/v1763328852/Morfeo_Daybed_Thumbnail_flklnb.jpg' },
    { name: 'Morfeo Nightstand', code: 'NT001', price: 575, url: 'morfeo-nightstand.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/w_600,h_600,c_pad,b_white,e_background_removal,f_auto,q_auto/v1763321510/Morfeo_Nightstand_Thumbnail_dyc9fc.jpg' },
    { name: 'Sistema Sofa', code: 'SO009', price: 1275, originalPrice: 1500, url: 'sistema-sofa.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1763335644/Sistema_3Seater_ryg1qz.jpg' },
    { name: 'Botella Dining Table', code: 'DT001', price: 1700, url: 'botella-dining-table.html', image: 'https://res.cloudinary.com/duoqn1csd/image/upload/w_600,h_600,c_pad,b_white,e_background_removal,f_auto,q_auto/v1763322945/Botella_Thumbnail_mllejo.jpg' }
];

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
            showElement(introSection);
            showElement(logoContainer);
            showElement(gridTitleBand);
            showElement(showcaseSection);
            showElement(featuredSection);
            editorialSections.forEach(section => showElement(section));
            showElement(triptychSection);
            if (allFurnitureSection) {
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
            hideElement(introSection);
            hideElement(logoContainer);
            hideElement(gridTitleBand);
            hideElement(showcaseSection);
            hideElement(featuredSection);
            editorialSections.forEach(section => hideElement(section));
            hideElement(triptychSection);
            if (allFurnitureSection) {
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
                
                // Show ONLY product cards that have "grid" category
                const allProducts = document.querySelectorAll('.product-card');
                let gridProducts = [];
                
                allProducts.forEach(card => {
                    const cardCategories = (card.dataset.category || '').split(' ');
                    if (cardCategories.includes('grid')) {
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
            
            // Hide decorative sections for specific categories (non-grid)
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

// Generate Season Markdown Grid dynamically
function generateSeasonMarkdownGrid() {
    const gridContainer = document.querySelector('.collection-showcase .showcase-grid');
    if (!gridContainer || seasonMarkdowns.length === 0) return;

    // Sort by grid position
    const sortedItems = [...seasonMarkdowns].sort((a, b) => a.gridPosition - b.gridPosition);
    
    let html = '';
    sortedItems.forEach(item => {
        const sourceClass = item.source === 'makemake' ? 'makemake' : 'curated';
        const sourceText = item.source === 'makemake' ? 'MAKEMAKE' : 'Curated';
        const wideClass = item.wide ? 'showcase-item-wide' : '';
        const discount = Math.round(((item.originalPrice - item.salePrice) / item.originalPrice) * 100);
        
        // Wrap in <a> if product page exists, otherwise <div>
        const elementTag = item.url ? 'a' : 'div';
        const hrefAttr = item.url ? `href="${item.url}"` : '';
        
        html += `
            <${elementTag} ${hrefAttr} class="showcase-item ${wideClass}">
                <img src="${item.image}" alt="${item.name}" class="showcase-item-image" ${item.imageStyle ? `style="${item.imageStyle}"` : ''}>
                <div class="showcase-item-overlay">
                    <div class="showcase-item-source ${sourceClass}">${sourceText}</div>
                    <div class="showcase-item-name">${item.name}</div>
                    <div class="showcase-item-prices">
                        <span class="showcase-item-original-price">$${item.originalPrice.toLocaleString()}</span>
                        <span class="showcase-item-sale-price">$${item.salePrice.toLocaleString()}</span>
                    </div>
                    <div class="showcase-item-markdown">${discount}% Off</div>
                </div>
            </${elementTag}>
        `;
    });
    
    gridContainer.innerHTML = html;
}

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
