// Build-time script to generate static product pages from Supabase
// Run this during Netlify build: node scripts/generate-products.js

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set as environment variables');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Read the product template
const templatePath = path.join(__dirname, '../product-template.html');
const template = fs.readFileSync(templatePath, 'utf8');

// Output directory for generated product pages
const productsDir = path.join(__dirname, '..', 'pages', 'products');
const outputDir = productsDir;

// Function to generate HTML for a product
function generateProductHTML(product) {
    let html = template;
    
    // Replace all product data placeholders
    html = html.replace(/\{\{PRODUCT_NAME\}\}/g, escapeHtml(product.name || ''));
    html = html.replace(/\{\{PRODUCT_CODE\}\}/g, escapeHtml(product.code || ''));
    html = html.replace(/\{\{PRODUCT_BADGE\}\}/g, escapeHtml(product.badge || 'MAKEMAKE'));
    html = html.replace(/\{\{PRODUCT_SLUG\}\}/g, escapeHtml(product.slug || ''));
    
    // Price handling
    const price = parseFloat(product.price) || 0;
    const originalPrice = product.original_price ? parseFloat(product.original_price) : null;
    
    if (originalPrice && originalPrice > price) {
        const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
        html = html.replace(/\{\{PRODUCT_PRICE\}\}/g, `
            <span style="text-decoration: line-through; opacity: 0.5; font-size: 0.9em;">$${originalPrice.toLocaleString()}</span>
            <span style="color: #583c4a; font-weight: 600;">$${price.toLocaleString()} + iva</span>
            <span style="display: block; font-size: 0.75em; color: #583c4a; margin-top: 4px;">${discount}% Off Season Markdown</span>
        `);
    } else {
        html = html.replace(/\{\{PRODUCT_PRICE\}\}/g, `$${price.toLocaleString()} + iva`);
    }
    
    // Description
    html = html.replace(/\{\{PRODUCT_DESCRIPTION\}\}/g, product.description || '');
    
    // Lead time
    html = html.replace(/\{\{LEAD_TIME\}\}/g, product.lead_time || '6-8 weeks');
    
    // Gallery images - validate and generate
    const galleryImages = product.gallery_images || [];
    let galleryHTML = '';
    
    const validImages = galleryImages.filter(img => {
        if (!img || typeof img !== 'string') return false;
        if (!img.startsWith('http://') && !img.startsWith('https://') && !img.startsWith('/')) return false;
        return true;
    });
    
    if (validImages.length === 0) {
        const fallbackImage = product.thumbnail_url || '';
        if (fallbackImage) {
            console.log(`  📷 Using thumbnail for ${product.code}`);
            galleryHTML = `<img src="${escapeHtml(fallbackImage)}" alt="${escapeHtml(product.name)}" class="product-image first-image">`;
        } else {
            console.warn(`  ⚠ No images found for ${product.code}`);
            galleryHTML = `<!-- No images available -->`;
        }
    } else {
        console.log(`  📷 ${validImages.length} image(s) for ${product.code}`);
        validImages.forEach((img, index) => {
            const firstClass = index === 0 ? 'first-image' : '';
            galleryHTML += `<img src="${escapeHtml(img)}" alt="${escapeHtml(product.name)} - View ${index + 1}" class="product-image ${firstClass}">\n                    `;
        });
        galleryHTML += `<!-- Add more images as needed: <img src="[IMAGE_URL_${validImages.length + 1}]" alt="${escapeHtml(product.name)} - View ${validImages.length + 1}" class="product-image"> -->`;
    }
    
    html = html.replace(/\{\{GALLERY_IMAGES\}\}/g, galleryHTML);
    
    // Size options
    const sizes = product.sizes || [];
    let sizesHTML = '';
    if (sizes.length === 1) {
        const size = sizes[0];
        sizesHTML = `<button class="size-option selected one-size-only" data-price="${size.price}" data-dimensions="${escapeHtml(size.dimensions || '')}" onclick="selectSize(this)">
                        <span class="size-name">${escapeHtml(size.name || 'One Size')}</span>
                        <span class="size-dimensions"></span>
                    </button>`;
    } else if (sizes.length > 1) {
        sizes.forEach((size, index) => {
            const selected = index === 0 ? 'selected' : '';
            sizesHTML += `<button class="size-option ${selected}" data-price="${size.price}" data-dimensions="${escapeHtml(size.dimensions || '')}" onclick="selectSize(this)">
                        <span class="size-name">${escapeHtml(size.name || '')}</span>
                        <span class="size-dimensions"></span>
                    </button>\n                    `;
        });
    } else {
        sizesHTML = `<button class="size-option selected one-size-only" data-price="${price}" data-dimensions="" onclick="selectSize(this)">
                        <span class="size-name">One Size</span>
                        <span class="size-dimensions"></span>
                    </button>`;
    }
    html = html.replace(/\{\{SIZE_OPTIONS\}\}/g, sizesHTML);
    
    // Material sections - use display:none for unused sections instead of removing them
    
    // Local Teak section
    if (product.has_local_teak) {
        html = html.replace(/\{\{LOCAL_TEAK_SECTION\}\}/g, `
            <div class="selector-group" id="local-teak-section">
                <div class="selector-label">Local Teak</div>
                <div class="color-swatches">
                    <div class="color-swatch flat" style="background-image: url('https://res.cloudinary.com/duoqn1csd/image/upload/v1764006650/Teak_cd0mut.jpg'); background-size: cover; background-position: center;" title="Local Teak" onclick="selectTeakFinish(this)"></div>
                </div>
            </div>
        `);
    } else {
        html = html.replace(/\{\{LOCAL_TEAK_SECTION\}\}/g, `
            <div class="selector-group" id="local-teak-section" style="display: none;">
                <div class="selector-label">Local Teak</div>
                <div class="color-swatches">
                    <div class="color-swatch flat" style="background-image: url('https://res.cloudinary.com/duoqn1csd/image/upload/v1764006650/Teak_cd0mut.jpg'); background-size: cover; background-position: center;" title="Local Teak" onclick="selectTeakFinish(this)"></div>
                </div>
            </div>
        `);
    }
    
    // Semi-Satin Lacquer section
    if (product.has_semi_satin_lacquer) {
        html = html.replace(/\{\{SEMI_SATIN_LACQUER_SECTION\}\}/g, `
            <div class="selector-group" id="semi-satin-lacquer-section">
                <div class="selector-label">Semi-Satin Lacquer</div>
                <div class="color-swatches">
                    <div class="color-swatch-matte" style="background-color: #F7EDD4;" title="Crema" onclick="selectColor(this)"></div>
                    <div class="color-swatch-matte" style="background-color: #B85C4F;" title="Sienna" onclick="selectColor(this)"></div>
                    <div class="color-swatch-matte" style="background-color: #E8E4DF;" title="Dove" onclick="selectColor(this)"></div>
                    <div class="color-swatch-matte" style="background-color: #C4A57B;" title="Camel" onclick="selectColor(this)"></div>
                    <div class="color-swatch-matte" style="background-color: #B8B695;" title="Seagrass" onclick="selectColor(this)"></div>
                    <div class="color-swatch-matte" style="background-color: #5F6E52;" title="Olive" onclick="selectColor(this)"></div>
                    <div class="color-swatch-matte" style="background-color: #8A9BA8;" title="Bay" onclick="selectColor(this)"></div>
                    <div class="color-swatch-matte" style="background-color: #3A4D5C;" title="Nautical" onclick="selectColor(this)"></div>
                </div>
            </div>
        `);
    } else {
        html = html.replace(/\{\{SEMI_SATIN_LACQUER_SECTION\}\}/g, `
            <div class="selector-group" id="semi-satin-lacquer-section" style="display:none">
                <div class="selector-label">Semi-Satin Lacquer</div>
                <div class="color-swatches">
                    <div class="color-swatch-matte" style="background-color: #F7EDD4;" title="Crema" onclick="selectColor(this)"></div>
                    <div class="color-swatch-matte" style="background-color: #B85C4F;" title="Sienna" onclick="selectColor(this)"></div>
                    <div class="color-swatch-matte" style="background-color: #E8E4DF;" title="Dove" onclick="selectColor(this)"></div>
                    <div class="color-swatch-matte" style="background-color: #C4A57B;" title="Camel" onclick="selectColor(this)"></div>
                    <div class="color-swatch-matte" style="background-color: #B8B695;" title="Seagrass" onclick="selectColor(this)"></div>
                    <div class="color-swatch-matte" style="background-color: #5F6E52;" title="Olive" onclick="selectColor(this)"></div>
                    <div class="color-swatch-matte" style="background-color: #8A9BA8;" title="Bay" onclick="selectColor(this)"></div>
                    <div class="color-swatch-matte" style="background-color: #3A4D5C;" title="Nautical" onclick="selectColor(this)"></div>
                </div>
            </div>
        `);
    }
    
    // White Cement section
    const displayWhiteCement = product.has_white_cement ? '' : ' style="display: none;"';
    html = html.replace(/\{\{WHITE_CEMENT_SECTION\}\}/g, `
            <div class="selector-group" id="white-cement-section"${displayWhiteCement}>
                <div class="selector-label">White Cement Aggregate</div>
                <div class="color-swatches">
                    <div class="color-swatch-matte" style="background-color: #F5F5F5;" title="White" onclick="selectColor(this)"></div>
                    <div class="color-swatch-matte" style="background-color: #9E9E9E;" title="Grey" onclick="selectColor(this)"></div>
                </div>
            </div>
        `);
    
    // Metal section
    const displayMetal = product.has_metal ? '' : ' style="display: none;"';
    html = html.replace(/\{\{METAL_SECTION\}\}/g, `
            <div class="selector-group" id="metal-section"${displayMetal}>
                <div class="selector-label">Powder-Coated Steel</div>
                <div class="color-swatches">
                    <div class="color-swatch-matte" style="background-color: #F7EDD4;" title="Crema" onclick="selectColor(this)"></div>
                    <div class="color-swatch-matte" style="background-color: #B85C4F;" title="Sienna" onclick="selectColor(this)"></div>
                    <div class="color-swatch-matte" style="background-color: #E8E4DF;" title="Dove" onclick="selectColor(this)"></div>
                    <div class="color-swatch-matte" style="background-color: #C4A57B;" title="Camel" onclick="selectColor(this)"></div>
                    <div class="color-swatch-matte" style="background-color: #B8B695;" title="Seagrass" onclick="selectColor(this)"></div>
                    <div class="color-swatch-matte" style="background-color: #5F6E52;" title="Olive" onclick="selectColor(this)"></div>
                    <div class="color-swatch-matte" style="background-color: #8A9BA8;" title="Bay" onclick="selectColor(this)"></div>
                    <div class="color-swatch-matte" style="background-color: #3A4D5C;" title="Nautical" onclick="selectColor(this)"></div>
                </div>
            </div>
        `);
    
    // Color section (generic color picker)
    const materials = product.materials || {};
    const colorOptions = materials.color || [];
    if (colorOptions.length > 0) {
        let colorHTML = '';
        colorOptions.forEach(option => {
            const colorValue = option.color || '#ccc';
            const title = option.name || option.title || '';
            colorHTML += `<div class="color-swatch-matte" style="background-color: ${escapeHtml(colorValue)};" title="${escapeHtml(title)}" onclick="selectColor(this)"></div>`;
        });
        html = html.replace(/\{\{COLOR_SECTION\}\}/g, `
            <div class="selector-group" id="color-section">
                <div class="selector-label">Color</div>
                <div class="color-swatches">
                    ${colorHTML}
                </div>
            </div>
        `);
    } else {
        html = html.replace(/\{\{COLOR_SECTION\}\}/g, '');
    }
    
    // Hardwood section
    if (product.has_hardwood) {
        const materials = product.materials || {};
        const hardwoodOptions = materials.hardwood || [];
        let hardwoodHTML = '';
        
        if (hardwoodOptions.length > 0) {
            hardwoodOptions.forEach(option => {
                const imageUrl = option.image || '';
                const title = option.name || option.title || '';
                const style = imageUrl ? 
                    `background-image: url('${escapeHtml(imageUrl)}'); background-size: cover; background-position: center;` :
                    `background-color: ${escapeHtml(option.color || '#ccc')};`;
                hardwoodHTML += `<div class="color-swatch-image" style="${style}" title="${escapeHtml(title)}" onclick="selectCedarColor(this)"></div>`;
            });
        } else {
            // Default hardwood finish images (Guanacaste, Ebony, Cesar, Ash)
            const defaultHardwoodFinishes = [
                { url: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1771258533/Guanacaste_scwih0.jpg', title: 'Guanacaste' },
                { url: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1771258531/Ebony_fyqiqv.jpg', title: 'Ebony' },
                { url: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1771258530/Cesar_r9v21e.jpg', title: 'Cesar' },
                { url: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1771258530/Ash-Finish_vwtvjk.jpg', title: 'Ash' }
            ];
            defaultHardwoodFinishes.forEach(f => {
                hardwoodHTML += `<div class="color-swatch-image" style="background-image: url('${escapeHtml(f.url)}'); background-size: cover; background-position: center;" title="${escapeHtml(f.title)}" onclick="selectCedarColor(this)"></div>`;
            });
        }
        
        html = html.replace(/\{\{HARDWOOD_SECTION\}\}/g, `
            <div class="selector-group" id="hardwood-finish-section">
                <div class="selector-label">Hardwood Finish</div>
                <div class="color-swatches">
                    ${hardwoodHTML}
                </div>
            </div>
        `);
    } else {
        html = html.replace(/\{\{HARDWOOD_SECTION\}\}/g, '');
    }
    
    // Fabric section: show when has_fabric OR has_strippedfabric (Supabase column)
    const showFabric = product.has_fabric || product.has_strippedfabric;
    if (showFabric) {
        const materials = product.materials || {};
        const fabricOptions = materials.fabric || [];
        let fabricHTML = '';
        
        if (fabricOptions.length > 0) {
            fabricOptions.forEach(option => {
                const imageUrl = option.image || '';
                const title = option.name || option.title || '';
                const style = imageUrl ? 
                    `background-image: url('${escapeHtml(imageUrl)}'); background-size: cover; background-position: center; min-width: 40px; min-height: 40px;` :
                    `background-color: ${escapeHtml(option.color || '#ccc')}; min-width: 40px; min-height: 40px;`;
                fabricHTML += `<div class="color-swatch-image" style="${style}" title="${escapeHtml(title)}" onclick="selectMaterial(this)"></div>`;
            });
            
            html = html.replace(/\{\{FABRIC_SECTION\}\}/g, `
            <div class="selector-group" id="fabric-section">
                <div class="selector-label">Fabric</div>
                <div class="color-swatches">
                    ${fabricHTML}
                </div>
            </div>
        `);
        } else {
            // Striped fabric when has_strippedfabric; otherwise solid
            const useStriped = product.has_strippedfabric;
            const defaultStripedFabrics = [
                { url: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1764098143/42102-0004_98107560_1200_dlwasr.jpg', title: 'Striped 1' },
                { url: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1764098078/42102-0002_98107552_1200_ev98z6.jpg', title: 'Striped 2' },
                { url: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1764098005/42102-0009_98107543_1200_feikr7.jpg', title: 'Striped 3' },
                { url: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1764097907/42102-0001_98107536_1200_lafbjb.jpg', title: 'Striped 4' }
            ];
            const defaultSolidFabrics = [
                { url: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1764098143/42102-0004_98107560_1200_dlwasr.jpg', title: 'Solid 1' },
                { url: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1764098078/42102-0002_98107552_1200_ev98z6.jpg', title: 'Solid 2' },
                { url: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1764098005/42102-0009_98107543_1200_feikr7.jpg', title: 'Solid 3' },
                { url: 'https://res.cloudinary.com/duoqn1csd/image/upload/v1764097907/42102-0001_98107536_1200_lafbjb.jpg', title: 'Solid 4' }
            ];
            const defaultFabrics = useStriped ? defaultStripedFabrics : defaultSolidFabrics;
            defaultFabrics.forEach(f => {
                fabricHTML += `<div class="color-swatch-image" style="background-image: url('${escapeHtml(f.url)}'); background-size: cover; background-position: center; min-width: 40px; min-height: 40px;" title="${escapeHtml(f.title)}" onclick="selectMaterial(this)"></div>`;
            });
            html = html.replace(/\{\{FABRIC_SECTION\}\}/g, `
            <div class="selector-group" id="fabric-section">
                <div class="selector-label">Fabric</div>
                <div class="color-swatches">
                    ${fabricHTML}
                </div>
            </div>
        `);
        }
    } else {
        html = html.replace(/\{\{FABRIC_SECTION\}\}/g, '');
    }
    
    // Leather section
    if (product.has_leather) {
        const materials = product.materials || {};
        const leatherOptions = materials.leather || [];
        let leatherHTML = '';
        
        if (leatherOptions.length > 0) {
            leatherOptions.forEach(option => {
                const imageUrl = option.image || '';
                const title = option.name || option.title || '';
                const style = imageUrl ? 
                    `background-image: url('${escapeHtml(imageUrl)}'); background-size: cover; background-position: center;` :
                    `background-color: ${escapeHtml(option.color || '#ccc')};`;
                leatherHTML += `<div class="color-swatch-image" style="${style}" title="${escapeHtml(title)}" onclick="selectMaterial(this)"></div>`;
            });
            
            html = html.replace(/\{\{LEATHER_SECTION\}\}/g, `
            <div class="selector-group" id="leather-section">
                <div class="selector-label">Leather</div>
                <div class="color-swatches">
                    ${leatherHTML}
                </div>
            </div>
        `);
        } else {
            html = html.replace(/\{\{LEATHER_SECTION\}\}/g, '');
        }
    } else {
        html = html.replace(/\{\{LEATHER_SECTION\}\}/g, '');
    }
    
    // Dimensions
    const dimensions = product.dimensions || [];
    let dimensionsHTML = '';
    dimensions.forEach(dim => {
        dimensionsHTML += `<div class="dimension-row">
                            <span class="dimension-label">${escapeHtml(dim.label || '')}</span>
                            <span class="dimension-value">${escapeHtml(dim.value || '')}</span>
                        </div>\n                        `;
    });
    html = html.replace(/\{\{DIMENSIONS\}\}/g, dimensionsHTML);
    
    // Materials spec - ensure content is wrapped in <p> tags if not already
    let materialsSpec = product.materials_spec || '';
    if (materialsSpec && !materialsSpec.trim().startsWith('<')) {
        // Plain text - wrap in paragraph
        materialsSpec = `<p>${materialsSpec}</p>`;
    }
    html = html.replace(/\{\{MATERIALS_SPEC\}\}/g, materialsSpec);
    
    // Care instructions - ensure content is wrapped in <p> tags if not already
    let careInstructions = product.care_instructions || '';
    if (careInstructions) {
        if (!careInstructions.trim().startsWith('<')) {
            // Plain text - wrap in paragraph
            careInstructions = `<p>${careInstructions}</p>`;
        }
        if (!careInstructions.includes('<!-- LEATHER_CARE_PLACEHOLDER -->')) {
            careInstructions += '\n                        <!-- LEATHER_CARE_PLACEHOLDER -->';
        }
    }
    html = html.replace(/\{\{CARE_INSTRUCTIONS\}\}/g, careInstructions);
    
    // Shipping info - ensure content is wrapped in <p> tags if not already
    let shippingInfo = product.shipping_info || '';
    if (!shippingInfo) {
        shippingInfo = '<!-- WHITE_GLOVE_DELIVERY_PLACEHOLDER -->\n                        <!-- SHIPPING_RESTRICTIONS_PLACEHOLDER -->\n                        \n                        <p>Delivery is available throughout Costa Rica, with shipping costs calculated at checkout based on your location. For international orders, please contact us directly to arrange shipping. Local clients are welcome to collect their purchases at our Escazú warehouse by appointment.</p>';
    } else if (!shippingInfo.trim().startsWith('<')) {
        // Plain text - wrap in paragraph
        shippingInfo = `<p>${shippingInfo}</p>`;
    }
    html = html.replace(/\{\{SHIPPING_INFO\}\}/g, shippingInfo);
    
    // Craftsmanship
    html = html.replace(/\{\{CRAFTSMANSHIP_TITLE\}\}/g, escapeHtml(product.craftsmanship_title || 'Hand-Crafted in San José'));
    html = html.replace(/\{\{CRAFTSMANSHIP_TEXT\}\}/g, product.craftsmanship_text || '');
    
    // Page title
    html = html.replace(/\{\{PAGE_TITLE\}\}/g, `${escapeHtml(product.name)} — Laurel Depto. de Diseño`);
    
    // Thumbnail for cart
    html = html.replace(/\{\{THUMBNAIL_URL\}\}/g, product.thumbnail_url || '');
    
    // Material selection mode
    html = html.replace(/\{\{MATERIAL_SELECTION_MODE\}\}/g, product.material_selection_mode || '1');
    
    return html;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// Main function
async function generateProducts() {
    console.log('Fetching products from Supabase...');
    
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
    
    if (error) {
        console.error('Error fetching products:', error);
        process.exit(1);
    }
    
    if (!products || products.length === 0) {
        console.warn('No products found in Supabase');
        return;
    }
    
    console.log(`Found ${products.length} products. Generating static pages...\n`);
    
    // Ensure products directory exists
    if (!fs.existsSync(productsDir)) {
        fs.mkdirSync(productsDir, { recursive: true });
        console.log(`📁 Created directory: pages/products/`);
    }
    
    // Generate HTML for each product
    products.forEach(product => {
        const html = generateProductHTML(product);
        const filename = `${product.slug}.html`;
        const filepath = path.join(outputDir, filename);
        
        fs.writeFileSync(filepath, html, 'utf8');
        console.log(`✓ Generated: pages/products/${filename}`);
    });
    
    console.log('\n✅ All product pages generated successfully!');
}

// Run the script
generateProducts().catch(error => {
    console.error('Error generating products:', error);
    process.exit(1);
});