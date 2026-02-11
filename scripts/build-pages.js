const fs = require('fs');
const path = require('path');

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
            iconColor: '#faf8f3' // Light icons for dark hero background
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
            '// Project images gallery - stores all images for each project',
            '// This object can be extended with additional images beyond what\'s in the carousel',
            'const projectImages = {};',
            '',
            '// Initialize project images from carousels',
            'function initProjectImages() {',
            '    for (let i = 1; i <= 11; i++) {',
            '        const carousel = document.getElementById(`carousel${i}`);',
            '        if (!carousel) continue;',
            '        ',
            '        // Extract ALL images from carousel (all slides, not just visible ones)',
            '        const images = Array.from(carousel.querySelectorAll("img"));',
            '        projectImages[i] = images.map(img => img.src);',
            '    }',
            '}',
            '',
            '// Initialize lightbox: click on image opens at that slide; click on carousel area opens big carousel at first image',
            'function initLightboxImages() {',
            '    for (let i = 1; i <= 11; i++) {',
            '        const carousel = document.getElementById(`carousel${i}`);',
            '        if (!carousel) continue;',
            '        const wrapper = carousel.parentElement;',
            '        if (wrapper) {',
            '            wrapper.style.cursor = "pointer";',
            '            wrapper.addEventListener("click", (e) => {',
            '                if (e.target.tagName === "IMG") return;',
            '                openLightbox(i, 0);',
            '            });',
            '        }',
            '        const images = carousel.querySelectorAll("img");',
            '        images.forEach((img, index) => {',
            '            img.style.cursor = "pointer";',
            '            img.addEventListener("click", (e) => {',
            '                e.stopPropagation();',
            '                openLightbox(i, index);',
            '            });',
            '        });',
            '    }',
            '}',
            '',
            '// Lightbox state',
            'let currentLightboxIndex = 0;',
            'let currentLightboxImages = [];',
            '',
            '// Create lightbox element (only once)',
            'function createLightbox() {',
            '    let lightbox = document.getElementById("interiorsLightbox");',
            '    if (lightbox) return lightbox;',
            '    ',
            '    lightbox = document.createElement("div");',
            '    lightbox.id = "interiorsLightbox";',
            '    lightbox.style.cssText = "display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.95); z-index: 10000; align-items: center; justify-content: center; cursor: pointer;";',
            '    ',
            '    const closeBtn = document.createElement("button");',
            '    closeBtn.innerHTML = "×";',
            '    closeBtn.style.cssText = "position: absolute; top: 20px; right: 30px; background: none; border: none; color: white; font-size: 40px; cursor: pointer; z-index: 10001; font-family: sans-serif;";',
            '    closeBtn.onclick = (e) => { e.stopPropagation(); closeLightbox(); };',
            '    ',
            '    const lightboxImg = document.createElement("img");',
            '    lightboxImg.id = "lightboxImage";',
            '    lightboxImg.style.cssText = "max-width: 90%; max-height: 90%; object-fit: contain;";',
            '    ',
            '    const prevBtn = document.createElement("button");',
            '    prevBtn.innerHTML = "‹";',
            '    prevBtn.style.cssText = "position: absolute; left: 20px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.2); border: none; color: white; font-size: 50px; cursor: pointer; padding: 10px 20px; border-radius: 5px;";',
            '    ',
            '    const nextBtn = document.createElement("button");',
            '    nextBtn.innerHTML = "›";',
            '    nextBtn.style.cssText = "position: absolute; right: 20px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.2); border: none; color: white; font-size: 50px; cursor: pointer; padding: 10px 20px; border-radius: 5px;";',
            '    ',
            '    function updateLightboxImage() {',
            '        if (currentLightboxImages.length > 0) {',
            '            lightboxImg.src = currentLightboxImages[currentLightboxIndex];',
            '        }',
            '    }',
            '    ',
            '    prevBtn.onclick = (e) => {',
            '        e.stopPropagation();',
            '        currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;',
            '        updateLightboxImage();',
            '    };',
            '    ',
            '    nextBtn.onclick = (e) => {',
            '        e.stopPropagation();',
            '        currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;',
            '        updateLightboxImage();',
            '    };',
            '    ',
            '    lightbox.onclick = (e) => {',
            '        if (e.target === lightbox || e.target === lightboxImg) {',
            '            closeLightbox();',
            '        }',
            '    };',
            '    ',
            '    lightbox.appendChild(closeBtn);',
            '    lightbox.appendChild(lightboxImg);',
            '    lightbox.appendChild(prevBtn);',
            '    lightbox.appendChild(nextBtn);',
            '    document.body.appendChild(lightbox);',
            '    ',
            '    // Keyboard navigation',
            '    document.addEventListener("keydown", (e) => {',
            '        const lightbox = document.getElementById("interiorsLightbox");',
            '        if (lightbox && lightbox.style.display === "flex") {',
            '            if (e.key === "Escape") closeLightbox();',
            '            if (e.key === "ArrowLeft") {',
            '                currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;',
            '                updateLightboxImage();',
            '            }',
            '            if (e.key === "ArrowRight") {',
            '                currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;',
            '                updateLightboxImage();',
            '            }',
            '        }',
            '    });',
            '    ',
            '    return lightbox;',
            '}',
            '',
            '// Open lightbox with all images from a project',
            '// Uses projectImages object which contains the full gallery for each project',
            'function openLightbox(carouselNum, startIndex) {',
            '    // Get full gallery from projectImages object',
            '    // This contains all images for the project, not just carousel slides',
            '    if (projectImages[carouselNum] && projectImages[carouselNum].length > 0) {',
            '        currentLightboxImages = projectImages[carouselNum];',
            '    } else {',
            '        // Fallback: extract from carousel if projectImages not initialized',
            '        const carousel = document.getElementById(`carousel${carouselNum}`);',
            '        if (carousel) {',
            '            const images = Array.from(carousel.querySelectorAll("img"));',
            '            currentLightboxImages = images.map(img => img.src);',
            '        } else {',
            '            return;',
            '        }',
            '    }',
            '    ',
            '    currentLightboxIndex = startIndex || 0;',
            '    ',
            '    const lightbox = createLightbox();',
            '    const lightboxImg = document.getElementById("lightboxImage");',
            '    if (lightboxImg && currentLightboxImages.length > 0) {',
            '        lightboxImg.src = currentLightboxImages[currentLightboxIndex];',
            '    }',
            '    lightbox.style.display = "flex";',
            '    document.body.style.overflow = "hidden";',
            '}',
            '',
            '// Close lightbox',
            'function closeLightbox() {',
            '    const lightbox = document.getElementById("interiorsLightbox");',
            '    if (lightbox) {',
            '        lightbox.style.display = "none";',
            '        document.body.style.overflow = "";',
            '    }',
            '}',
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
            '// Initialize furniture page on load',
            'document.addEventListener("DOMContentLoaded", function() {',
            '    if (typeof loadCart === "function") loadCart();',
            '    if (typeof generateSeasonMarkdownGrid === "function") generateSeasonMarkdownGrid();',
            '    if (typeof syncGridBadges === "function") syncGridBadges();',
            '});',
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

// Generate back arrow HTML
function generateBackArrow(href = 'index.html') {
    return `<div style="position: absolute; left: 50px; height: 100%; display: flex; align-items: center;">
            <a href="${href}" style="padding: 0; cursor: pointer; text-decoration: none; display: flex; align-items: center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="back-arrow-icon">
                    <path d="M19 12H5M12 19l-7-7 7-7" stroke="#141414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
    
    // Replace back arrow slot
    if (config.showBackArrow) {
        const backArrowPath = config.overridePaths ? '../../index.html' : 'index.html';
        header = header.replace('{{BACK_ARROW_SLOT}}', generateBackArrow(backArrowPath));
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
    
    // Replace icon colors (default to light if not specified)
    const iconColor = config.iconColor || '#faf8f3';
    
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
    
    // Override CSS paths for product-template (used to generate pages in pages/products/)
    if (pageConfig.overrideCSSPaths) {
        head = head.replace('href="css/main.css"', 'href="../../css/main.css"');
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
