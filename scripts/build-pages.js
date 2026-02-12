const fs = require('fs');
const path = require('path');
const interiorsProjectImages = require('./interiors-project-images.js');

// Configuration for each page
const pages = [
    {
        name: 'index',
        title: 'Laurel Depto. de Diseño',
        contentFile: 'content/index-content.html',
        outputFile: 'index.html',
        headerConfig: {
            showBackArrow: false,
            activeNav: null, // null means no active nav item
            iconColor: '#141414', // Dark icons for light background
        },
        scripts: [
            '<script src="js/products-data.js"></script>',
            '<script src="js/main.js"></script>'
        ]
    },
    {
        name: 'interiors',
        title: 'LDD - Interior Design',
        contentFile: 'content/interiors-content.html',
        outputFile: 'interiors.html',
        headerConfig: {
            showBackArrow: true,
            activeNav: 'interiors',
            iconColor: '#141414' // Dark icons (no white)
        },
        scripts: [
            '<script src="js/products-data.js"></script>',
            '<script src="js/main.js"></script>',
            '<script>if (typeof loadCart === "function") loadCart();</script>',
            '<script>',
            '// Initialize carousel dots and navigation',
            'function initCarouselDots() {',
            '    for (let i = 1; i <= 11; i++) {',
            '        const carousel = document.getElementById(`carousel${i}`);',
            '        const dotsContainer = document.getElementById(`dots${i}`);',
            '        if (!carousel || !dotsContainer) continue;',
            '        ',
            '        const slides = carousel.querySelectorAll("div");',
            '        const slideCount = slides.length;',
            '        ',
            '        // Clear existing dots',
            '        dotsContainer.innerHTML = "";',
            '        ',
            '        // Create dots for each slide',
            '        for (let j = 0; j < slideCount; j++) {',
            '            const dotWrapper = document.createElement("div");',
            '            dotWrapper.className = "carousel-dot-wrapper";',
            '            const dot = document.createElement("div");',
            '            dot.className = "carousel-dot";',
            '            if (j === 0) dot.style.opacity = "1";',
            '            else dot.style.opacity = "0.3";',
            '            ',
            '            dotWrapper.addEventListener("click", () => {',
            '                goToSlide(i, j);',
            '            });',
            '            ',
            '            dotWrapper.appendChild(dot);',
            '            dotsContainer.appendChild(dotWrapper);',
            '        }',
            '        // Plus button: open project lightbox at first image (like reference)',
            '        dotsContainer.style.position = "relative";',
            '        const plusButton = document.createElement("div");',
            '        plusButton.style.cssText = "position: absolute; right: -5px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; opacity: 1; padding: 10px;";',
            '        plusButton.innerHTML = \'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#141414" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>\';',
            '        plusButton.onmouseover = () => { plusButton.style.transform = "translateY(-50%) scale(1.4)"; };',
            '        plusButton.onmouseout = () => { plusButton.style.transform = "translateY(-50%) scale(1)"; };',
            '        plusButton.onclick = (e) => { e.stopPropagation(); openMagazineLightbox(0, i); };',
            '        dotsContainer.appendChild(plusButton);',
            '    }',
            '}',
            '',
            '// Navigate to a specific slide',
            'function goToSlide(carouselNum, slideIndex) {',
            '    const carousel = document.getElementById(`carousel${carouselNum}`);',
            '    const dotsContainer = document.getElementById(`dots${carouselNum}`);',
            '    if (!carousel || !dotsContainer) return;',
            '    ',
            '    const slides = carousel.querySelectorAll("div");',
            '    const slideWidth = slides[0] ? slides[0].offsetWidth : 424;',
            '    ',
            '    // Update carousel position',
            '    carousel.style.transform = `translateX(-${slideIndex * slideWidth}px)`;',
            '    carousel.setAttribute("data-current", slideIndex);',
            '    ',
            '    // Update dot states',
            '    const dots = dotsContainer.querySelectorAll(".carousel-dot");',
            '    dots.forEach((dot, index) => {',
            '        if (index === slideIndex) {',
            '            dot.style.opacity = "1";',
            '        } else {',
            '            dot.style.opacity = "0.3";',
            '        }',
            '    });',
            '}',
            '',
            '// Project images for magazine lightbox (full sets from reference; project 4 filled from carousel)',
            ('const projectImages = ' + JSON.stringify(interiorsProjectImages) + ';'),
            'const projectDescriptions = {',
            '    1: { title: "Casa Piedras Blancas", text: "Contemporary organic residence defined by warm whites, natural oak tones, and fluted details with low-profile furniture and curved forms throughout. This neutral home is accentuated by pops of blue and pattern. While each interior creates its own serene moment, our favorite feature remains the floor treatments—an array of natural Tempisque stone in varying formats and textures paired with bespoke cement mosaics to deliver a lasting impact.", collaborators: [{ label: "Photography", name: "Alvaro Arroyo" }, { label: "Architecture Studio", name: "Anthony Way" }, { label: "General Contractor", name: "Frame Projects" }] },',
            '    2: { title: "A House of Color", text: "This permanent residence embodies the clients\' artistic vision brought to life through unapologetic color and bold design choices. With a clear creative direction from the outset, the owners embraced vibrant hues as the home\'s defining characteristic. Planters punctuate the architecture throughout, designed with anticipation—waiting for gardens to overflow and eventually envelope the home in greenery. Bespoke trellis work and custom elements provide the supporting structure for this evolving dialogue between architecture and nature.", collaborators: [{ label: "Photography", name: "Roberto Castillo" }, { label: "Architecture Studio", name: "RAWA Arquitectura" }, { label: "General Contractor", name: "Frame Projects" }] },',
            '    3: { title: "Casa Sirena", text: "A complete renovation that reimagined every element. New flooring, redesigned ceilings, custom cabinetry, and carefully selected finishes throughout transformed this residence into a refined coastal retreat. Drawing inspiration from sirens and the marine world, the color palette embraces oceanic hues—deep blues and aquatic tones that resurface throughout the spaces, bringing cohesion and contemporary elegance to every space.", collaborators: [{ label: "Photography", name: "Juan Tribaldos" }, { label: "General Contractor", name: "Remodelaciones RMR" }] },',
            '    4: { title: "Prado Ochenta & Tres", text: "This was a partial scope project, encompassing conceptual and design development services, material and finish selections, furnishing specifications, and detailed construction documentation. Through iterative refinement and client collaboration, we established a comprehensive design direction that balanced aesthetic vision with functional requirements. These slides offer a glimpse into our design deliverables. We hope that the comprehensive design package will help our clients successfully market this exceptional investment property opportunity.", collaborators: [] },',
            '    5: { title: "A House for Susanne", text: "A Kelly Green love affair. Our client expressed a deep desire to have this signature color present throughout the home—a directive we embraced wholeheartedly. Working closely with the homeowners, we harmonized four essential elements: Spanish colonial architecture, tropical building materials, elegant finishes, and the underlining memory of a mid-western North American ranch. Rich wood details, custom millwork, and carefully selected furnishings come together in a home defined by craftsmanship and understated elegance.", collaborators: [{ label: "Photography", name: "Juan Tribaldos" }, { label: "Architecture Studio", name: "Lake Geneva Architects" }, { label: "General Contractor", name: "Constructora Alfaco" }] },',
            '    6: { title: "Friends & Family", text: "Current trends meet everyday comfort. Natural light and thoughtful spatial planning are complemented by warm wood tones, layered textiles, and carefully curated furnishings. Special attention was paid to lighting details—choosing organic, contemporary pieces that add character throughout. The space balances minimalist sensibilities with livable warmth. Designed as a home for a family to grow into as the years go by, with all the building blocks and room necessary for personalization.", collaborators: [{ label: "Photography", name: "Alvaro Arroyo" }, { label: "Architecture Studio", name: "LOOP" }, { label: "General Contractor", name: "Inmobiliaria Diversa" }] },',
            '    7: { title: "Calle Virginia Diez", text: "Mediterranean influences meet tropical living in this warm, inviting residence. Natural materials, from weathered wood to handcrafted tile, create tactile richness throughout. The design embraces open, breathable spaces that celebrate indoor-outdoor connection, while maintaining an understated elegance. A palette of warm neutrals, terracotta, and ocean-inspired blues brings cohesion to interiors that feel effortlessly refined yet thoroughly livable.", collaborators: [{ label: "Photography", name: "Juan Tribaldos" }, { label: "Architecture Studio", name: "Lake Geneva Architects" }, { label: "General Contractor", name: "Constructora Alfaco" }] },',
            '    8: { title: "At The End of The Road", text: "This elegant coastal retreat embodies four years of meticulous design work, blending French provincial undertones with contemporary refinement. Our concept maximized texture through architectural molding, wall-coverings, and rich veneers. Despite the abundance of detail, a cohesive color palette keeps the spaces feeling light and harmonious—a true gem that balances richness with restraint.", collaborators: [{ label: "3D Rendering Studio", name: "ARCHE Studio" }, { label: "Architecture Studio", name: "RAWA Arquitectura" }, { label: "General Contractor", name: "Constructora Alfaco" }] },',
            '    9: { title: "Casa Laurel", text: "An urban tropical retreat designed as a cultivated yet modern sanctuary with a sense of sophisticated simplicity. Created as a market-ready residence, we selected furniture with broad aesthetic appeal—unique yet approachable for diverse tastes. The refined space features clean lines, natural materials, and indirect cove lighting that creates luminous, spacious interiors throughout.", collaborators: [{ label: "Photography", name: "Alvaro Arroyo" }, { label: "Architecture Studio", name: "Laurel Departamento de Diseño" }, { label: "General Contractor", name: "Machado / Solano" }] },',
            '    10: { title: "Punta Plumeria", text: "Restraint becomes luxury in this coastal residence. Working closely with the homeowners, we crafted contemporary transitional interiors suited for life by the sea. Local vendors furnished nearly every space, their pieces harmonizing with the home\'s architectural dialogue between plaster vaulted ceilings and panoramic ocean views framed by expansive glass. Each detail was considered with precision, avoiding excess while embracing the essential—creating a fresh yet elegant retreat that speaks to both place and purpose.", collaborators: [{ label: "Photography", name: "Juan Tribaldos" }, { label: "Architecture Studio", name: "RAWA Arquitectura" }, { label: "General Contractor", name: "Frame Projects" }] },',
            '    11: { title: "Casa Ventanas", text: "Project description.", collaborators: [{ label: "Photography", name: "Photographer Name" }, { label: "Architecture Studio", name: "Architecture Studio Name" }, { label: "General Contractor", name: "Contractor Name" }] }',
            '};',
            '',
            'function initProjectImages() {',
            '    for (let i = 1; i <= 11; i++) {',
            '        if (projectImages[i] && projectImages[i].length > 0) continue;',
            '        const carousel = document.getElementById(`carousel${i}`);',
            '        if (!carousel) continue;',
            '        const images = Array.from(carousel.querySelectorAll("img"));',
            '        projectImages[i] = images.map(img => ({ src: img.src, alt: img.alt || "" }));',
            '    }',
            '}',
            '',
            'function initLightboxImages() {',
            '    for (let i = 1; i <= 11; i++) {',
            '        const carousel = document.getElementById(`carousel${i}`);',
            '        if (!carousel) continue;',
            '        const wrapper = carousel.parentElement;',
            '        if (wrapper) {',
            '            wrapper.style.cursor = "pointer";',
            '            wrapper.addEventListener("click", (e) => {',
            '                if (e.target.tagName === "IMG") return;',
            '                openMagazineLightbox(0, i);',
            '            });',
            '        }',
            '        const images = carousel.querySelectorAll("img");',
            '        images.forEach((img, index) => {',
            '            img.style.cursor = "pointer";',
            '            img.addEventListener("click", (e) => { e.stopPropagation(); openMagazineLightbox(index, i); });',
            '        });',
            '    }',
            '}',
            '',
            'let isDragging = false;',
            'let startX = 0;',
            '',
            'function setupDragScroll(element) {',
            '    let currentTranslateX = 0;',
            '    function getScrollBoundaries() {',
            '        const navCenter = document.querySelector(".nav-center");',
            '        const leftBoundary = navCenter ? navCenter.getBoundingClientRect().left : 80;',
            '        const rightBoundary = window.innerWidth;',
            '        const filmstripWidth = element.scrollWidth;',
            '        return { maxScrollLeft: -(filmstripWidth - rightBoundary), minScroll: leftBoundary };',
            '    }',
            '    element.addEventListener("mousedown", (e) => {',
            '        isDragging = true;',
            '        startX = e.pageX;',
            '        const style = window.getComputedStyle(element);',
            '        const matrix = new DOMMatrix(style.transform);',
            '        currentTranslateX = matrix.m41;',
            '        element.style.transition = "none";',
            '    });',
            '    document.addEventListener("mousemove", (e) => {',
            '        if (!isDragging) return;',
            '        e.preventDefault();',
            '        const walk = e.pageX - startX;',
            '        let newPos = currentTranslateX + walk;',
            '        const { maxScrollLeft, minScroll } = getScrollBoundaries();',
            '        newPos = Math.max(maxScrollLeft, Math.min(minScroll, newPos));',
            '        element.style.transform = `translateX(${newPos}px)`;',
            '    });',
            '    document.addEventListener("mouseup", (e) => {',
            '        if (!isDragging) return;',
            '        isDragging = false;',
            '        const walk = e.pageX - startX;',
            '        let finalPos = currentTranslateX + walk;',
            '        const { maxScrollLeft, minScroll } = getScrollBoundaries();',
            '        finalPos = Math.max(maxScrollLeft, Math.min(minScroll, finalPos));',
            '        element.style.transform = `translateX(${finalPos}px)`;',
            '    });',
            '}',
            '',
            'function openMagazineLightbox(imageIndex, projectId) {',
            '    const lightbox = document.getElementById("magazineLightbox");',
            '    const filmstrip = document.getElementById("magazineFilmstrip");',
            '    const textPanel = document.getElementById("magazineTextPanel");',
            '    if (!lightbox || !filmstrip) return;',
            '    const images = projectImages[projectId] || [];',
            '    if (images.length === 0) return;',
            '    filmstrip.style.opacity = "0";',
            '    filmstrip.innerHTML = "";',
            '    images.forEach((img) => {',
            '        const slide = document.createElement("div");',
            '        slide.className = "magazine-film-slide";',
            '        const imageEl = document.createElement("img");',
            '        imageEl.src = img.src;',
            '        imageEl.alt = img.alt;',
            '        slide.appendChild(imageEl);',
            '        filmstrip.appendChild(slide);',
            '    });',
            '    const projectDesc = projectDescriptions[projectId];',
            '    if (textPanel) {',
            '        if (projectDesc) {',
            '            textPanel.innerHTML = "";',
            '            const titleEl = document.createElement("h3");',
            '            titleEl.style.cssText = "font-size: 1.1rem; line-height: 1.2; color: #141414; margin-bottom: 16px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; text-align: left;";',
            '            titleEl.textContent = projectDesc.title;',
            '            textPanel.appendChild(titleEl);',
            '            const descEl = document.createElement("p");',
            '            descEl.style.cssText = "font-size: 0.85rem; line-height: 1.5; color: #583c4a; margin-bottom: 16px; font-weight: 300; text-align: left;";',
            '            descEl.textContent = projectDesc.text;',
            '            textPanel.appendChild(descEl);',
            '            if (projectDesc.collaborators && projectDesc.collaborators.length > 0) {',
            '                const collabContainer = document.createElement("div");',
            '                collabContainer.style.cssText = "font-size: 0.85rem; line-height: 1.5; color: #583c4a; margin-top: 20px; text-align: left;";',
            '                const collabTitle = document.createElement("p");',
            '                collabTitle.style.cssText = "margin-bottom: 10px; font-weight: 300;";',
            '                collabTitle.textContent = "In collaboration with:";',
            '                collabContainer.appendChild(collabTitle);',
            '                projectDesc.collaborators.forEach(function(c) {',
            '                    const item = document.createElement("p");',
            '                    item.style.cssText = "margin-top: 6px; font-weight: 300;";',
            '                    item.innerHTML = "<strong style=\\"color: #141414; font-weight: 500;\\">" + c.label + "</strong><br>" + c.name;',
            '                    collabContainer.appendChild(item);',
            '                });',
            '                textPanel.appendChild(collabContainer);',
            '            }',
            '            textPanel.style.display = "block";',
            '            setTimeout(function() {',
            '                const navCenter = document.querySelector(".nav-center");',
            '                const leftBoundary = navCenter ? navCenter.getBoundingClientRect().left : 80;',
            '                const centerPosition = (leftBoundary / 2) - (280 / 2) + 20;',
            '                textPanel.style.left = centerPosition + "px";',
            '            }, 50);',
            '        } else textPanel.style.display = "none";',
            '    }',
            '    lightbox.classList.add("active");',
            '    document.body.style.overflow = "hidden";',
            '    setTimeout(() => {',
            '        const navCenter = document.querySelector(".nav-center");',
            '        const leftBoundary = navCenter ? navCenter.getBoundingClientRect().left : 80;',
            '        filmstrip.style.transition = "none";',
            '        filmstrip.style.transform = `translateX(${leftBoundary}px)`;',
            '        setTimeout(() => { filmstrip.style.transition = "opacity 0.3s ease"; filmstrip.style.opacity = "1"; }, 20);',
            '    }, 100);',
            '    setupDragScroll(filmstrip);',
            '}',
            '',
            'function closeMagazineLightbox() {',
            '    const lb = document.getElementById("magazineLightbox");',
            '    if (lb) lb.classList.remove("active");',
            '    document.body.style.overflow = "";',
            '    isDragging = false;',
            '}',
            '',
            'document.addEventListener("keydown", (e) => {',
            '    if (e.key === "Escape") closeMagazineLightbox();',
            '});',
            '',
            '// Run carousel/lightbox init (used on both full load and Turbo visit)',
            'function runInteriorsCarouselInit() {',
            '    initCarouselDots();',
            '    initProjectImages();',
            '    initLightboxImages();',
            '}',
            'document.addEventListener("DOMContentLoaded", runInteriorsCarouselInit);',
            'document.addEventListener("turbo:load", runInteriorsCarouselInit);',
            '</script>'
        ]
    },
    {
        name: 'furniture',
        title: 'Furniture — Laurel Depto. de Diseño',
        contentFile: 'content/furniture-content.html',
        outputFile: 'furniture.html',
        headerConfig: {
            showBackArrow: true,
            activeNav: 'furniture',
            iconColor: '#141414', // Dark icons for light background
            iconsInsideNav: true // Icons inside nav-ribbon for furniture.css absolute positioning
        },
        scripts: [
            '<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script>',
            '<script src="js/products-data.js"></script>',
            '<script src="js/main.js"></script>',
            '<script src="js/furniture.js"></script>',
            '<script>',
            '// Initialize furniture page (grid + cart) on full load and on Turbo visit',
            'function runFurniturePageInit() {',
            '    if (typeof loadCart === "function") loadCart();',
            '    if (typeof generateSeasonMarkdownGrid === "function") generateSeasonMarkdownGrid();',
            '    if (typeof syncGridBadges === "function") syncGridBadges();',
            '}',
            'document.addEventListener("DOMContentLoaded", runFurniturePageInit);',
            'document.addEventListener("turbo:load", runFurniturePageInit);',
            '</script>'
        ],
        additionalCSS: ['<link rel="stylesheet" href="css/furniture.css">']
    },
    {
        name: 'product-template',
        title: '{{PAGE_TITLE}}',
        contentFile: 'content/product-content.html',
        outputFile: 'product-template.html',
        headerConfig: {
            showBackArrow: true,
            activeNav: null,
            iconColor: '#141414', // Dark icons for light background
            iconsInsideNav: true, // Icons inside nav-ribbon for furniture.css absolute positioning
            overridePaths: true // Override navigation paths for pages/products/ directory
        },
        scripts: [
            '<script src="../../js/products-data.js"></script>',
            '<script src="../../js/main.js"></script>',
            '<script>window.productThumbnailUrl = \'{{THUMBNAIL_URL}}\';</script>',
            '<script src="../../js/product.js"></script>'
        ],
        // Override CSS paths for product template (used to generate pages in pages/products/)
        overrideCSSPaths: true
    }
];

// Read partial files
function readPartial(filePath) {
    try {
        return fs.readFileSync(path.join(__dirname, '..', filePath), 'utf8');
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return '';
    }
}

// Read content file
function readContent(filePath) {
    try {
        return fs.readFileSync(path.join(__dirname, '..', filePath), 'utf8');
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error.message);
        return '';
    }
}

// Generate back arrow HTML (iconColor for stroke so it matches nav on light/dark hero)
function generateBackArrow(href = 'index.html', iconColor = '#141414') {
    return `<div style="position: absolute; left: 50px; height: 100%; display: flex; align-items: center;">
            <a href="${href}" style="padding: 0; cursor: pointer; text-decoration: none; display: flex; align-items: center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="back-arrow-icon">
                    <path d="M19 12H5M12 19l-7-7 7-7" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </a>
        </div>`;
}

// Generate active nav class
function getActiveNavClass(activeNav, navItem) {
    return activeNav === navItem ? 'active' : '';
}

// Generate nav icons HTML
function generateNavIcons(iconColor, overridePaths = false) {
    const aboutPath = overridePaths ? '../../about.html' : 'about.html';
    return `<div class="nav-icons">
        <div class="nav-icon" onclick="toggleSearch()">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="1.8">
                <circle cx="10" cy="10" r="7"/>
                <path d="M21 21l-6-6" stroke-linecap="round"/>
            </svg>
        </div>

        <a href="${aboutPath}" class="nav-icon" style="text-decoration: none;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2">
                <circle cx="5" cy="12" r="1.5" fill="${iconColor}"/>
                <circle cx="12" cy="12" r="1.5" fill="${iconColor}"/>
                <circle cx="19" cy="12" r="1.5" fill="${iconColor}"/>
            </svg>
        </a>
        
        <div class="nav-icon" onclick="toggleCart()">
            <svg id="cartIcon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="1.8">
                <path d="M1.5 6.5C1.5 6.2 1.7 6 2 6H15.5C15.8 6 16 6.2 16 6.5V16H1.5V6.5Z" stroke-linejoin="round"/>
                <path d="M16 7.8L18.8 7.9L21.5 10.8C21.6 10.9 21.7 11.1 21.7 11.3V15.9H16V6" stroke-linejoin="round"/>
                <circle cx="6" cy="18.8" r="1.5" fill="${iconColor}"/>
                <circle cx="17.5" cy="18.8" r="1.5" fill="${iconColor}"/>
            </svg>
            <div class="cart-counter" id="cartCounter">0</div>
        </div>
    </div>`;
}

// Build header with replacements
function buildHeader(config) {
    let header = readPartial('partials/header.html');
    
    // Replace icon colors (default to light if not specified) – used for back arrow and nav icons
    const iconColor = config.iconColor || '#faf8f3';

    // Replace back arrow slot
    if (config.showBackArrow) {
        const backArrowPath = config.overridePaths ? '../../index.html' : 'index.html';
        header = header.replace('{{BACK_ARROW_SLOT}}', generateBackArrow(backArrowPath, iconColor));
    } else {
        header = header.replace('{{BACK_ARROW_SLOT}}', '');
    }
    
    // Replace active nav classes
    header = header.replace('{{ACTIVE_FURNITURE}}', getActiveNavClass(config.activeNav, 'furniture'));
    header = header.replace('{{ACTIVE_INTERIORS}}', getActiveNavClass(config.activeNav, 'interiors'));
    header = header.replace('{{ACTIVE_PROPERTIES}}', getActiveNavClass(config.activeNav, 'properties'));
    
    // Override navigation paths for product pages (in pages/products/)
    if (config.overridePaths) {
        header = header.replace('href="furniture.html"', 'href="../../furniture.html"');
        header = header.replace('href="interiors.html"', 'href="../../interiors.html"');
        header = header.replace('href="properties.html"', 'href="../../properties.html"');
        header = header.replace('href="about.html"', 'href="../../about.html"');
    }
    
    // Determine nav-icons placement: inside nav-ribbon for furniture/product pages, outside for index/interiors
    const iconsInside = config.iconsInsideNav || false;
    const navIconsHtml = generateNavIcons(iconColor, config.overridePaths);
    
    if (iconsInside) {
        header = header.replace('{{NAV_ICONS_SLOT}}', navIconsHtml);
        header = header.replace('{{NAV_ICONS_OUTSIDE_SLOT}}', '');
    } else {
        header = header.replace('{{NAV_ICONS_SLOT}}', '');
        header = header.replace('{{NAV_ICONS_OUTSIDE_SLOT}}', navIconsHtml);
    }
    
    return header;
}

// Build complete page
function buildPage(pageConfig) {
    let head = readPartial('partials/head.html');
    const header = buildHeader(pageConfig.headerConfig);
    const content = readContent(pageConfig.contentFile);
    const footer = readPartial('partials/footer.html');
    const modals = readPartial('partials/modals.html');
    
    // Replace page title in head
    head = head.replace('{{PAGE_TITLE}}', pageConfig.title);
    
    // Override asset paths for product-template (pages live in pages/products/, so need ../../)
    if (pageConfig.overrideCSSPaths) {
        head = head.replace('href="css/main.css"', 'href="../../css/main.css"');
        head = head.replace('href="images/favicon.ico"', 'href="../../images/favicon.ico"');
        head = head.replace('href="favicon-32x32.png"', 'href="../../favicon-32x32.png"');
        head = head.replace('href="favicon-16x16.png"', 'href="../../favicon-16x16.png"');
        head = head.replace('href="apple-touch-icon.png"', 'href="../../apple-touch-icon.png"');
    }
    
    // Add additional CSS if specified
    if (pageConfig.additionalCSS) {
        const cssLinks = pageConfig.additionalCSS.join('\n    ');
        head = head.replace('</head>', `    ${cssLinks}\n</head>`);
    }
    
    // Combine scripts
    const scriptsHtml = pageConfig.scripts.join('\n    ');
    
    // Assemble full page
    const fullPage = `<!DOCTYPE html>
<html lang="en">
${head}
<body>
    ${header}
    ${content}
    ${footer}
    ${modals}
    ${scriptsHtml}
</body>
</html>`;
    
    return fullPage;
}

// Main build function
function build() {
    console.log('Building pages...\n');
    
    pages.forEach(page => {
        try {
            const html = buildPage(page);
            const outputPath = path.join(__dirname, '..', page.outputFile);
            fs.writeFileSync(outputPath, html, 'utf8');
            console.log(`✓ Built ${page.outputFile}`);
        } catch (error) {
            console.error(`✗ Error building ${page.outputFile}:`, error.message);
        }
    });
    
    console.log('\nBuild complete!');
}

// Run build
build();
