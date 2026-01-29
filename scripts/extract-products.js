// Script to extract product data from HTML files and generate INSERT statements
const fs = require('fs');
const path = require('path');

// List of product HTML files (excluding already migrated ones)
const productFiles = [
    'barro-no2-side-table.html',
    'barro-no4-side-table.html',
    'bloque-no1-side-table.html',
    'botella-dining-table.html',
    'cazo-side-chair.html',
    'depto-parsons-desk.html',
    'dizi-coffee-table.html',
    'dizi-side-table.html',
    'filial-side-table.html',
    'fortuna-chair.html',
    'globo-side-table.html',
    'gracia-dining-table.html',
    'hache-console.html',
    'half-side-table.html',
    'mano-chair.html',
    'mano-sofa.html',
    'morfeo-daybed.html',
    'morfeo-nightstand.html',
    'pablo-side-table.html',
    'perse-chair.html',
    'petra-coffee-table.html',
    'plato-side-table.html',
    'poroti-side-table.html',
    'rio-chair.html',
    'ronda-coffee-table.html',
    'rosario-bistro-table.html',
    'sistema-sofa.html',
    'winnie-side-table.html'
];

function extractProductData(htmlContent, filename) {
    const slug = filename.replace('.html', '');
    
    // Extract product name
    const nameMatch = htmlContent.match(/<h1 class="product-name">([^<]+)<\/h1>/);
    const name = nameMatch ? nameMatch[1].trim() : '';
    
    // Extract product code
    const codeMatch = htmlContent.match(/<div class="product-code">([^<]+)<\/div>/);
    const code = codeMatch ? codeMatch[1].trim() : '';
    
    // Extract price
    const priceMatch = htmlContent.match(/<div class="product-price">\$([0-9,]+)/);
    const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0;
    
    // Extract description
    const descMatch = htmlContent.match(/<p class="product-description">\s*([^<]+(?:\s*<[^>]+>[^<]*<\/[^>]+>\s*[^<]+)*)/);
    let description = '';
    if (descMatch) {
        description = descMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    }
    
    // Extract gallery images
    const galleryImages = [];
    const imgMatches = htmlContent.matchAll(/<img src="([^"]+)"[^>]*class="product-image[^"]*"/g);
    for (const match of imgMatches) {
        if (match[1] && !match[1].includes('placeholder') && !match[1].includes('IMAGE_URL')) {
            galleryImages.push(match[1]);
        }
    }
    const thumbnailUrl = galleryImages[0] || '';
    
    // Extract size options
    const sizes = [];
    const sizeMatches = htmlContent.matchAll(/<button class="size-option[^"]*" data-price="([^"]+)" data-dimensions="([^"]*)"[^>]*>[\s\S]*?<span class="size-name">([^<]+)<\/span>/g);
    for (const match of sizeMatches) {
        sizes.push({
            name: match[3].trim(),
            price: parseInt(match[1]),
            dimensions: match[2] || ''
        });
    }
    // If no sizes found, use one size with price from product-price
    if (sizes.length === 0 && price > 0) {
        const dimMatch = htmlContent.match(/data-dimensions="([^"]+)"/);
        sizes.push({
            name: 'One Size',
            price: price,
            dimensions: dimMatch ? dimMatch[1] : ''
        });
    }
    
    // Extract dimensions
    const dimensions = [];
    const dimMatches = htmlContent.matchAll(/<span class="dimension-label">([^<]+)<\/span>\s*<span class="dimension-value">([^<]+)<\/span>/g);
    for (const match of dimMatches) {
        dimensions.push({
            label: match[1].trim(),
            value: match[2].trim()
        });
    }
    
    // Extract materials spec (from Materials spec-item)
    let materialsSpec = '';
    const materialsSectionMatch = htmlContent.match(/<div class="spec-item"[^>]*>\s*<div class="spec-header">\s*<span>Materials<\/span>[\s\S]*?<div class="spec-content">([\s\S]*?)<\/div>/);
    if (materialsSectionMatch) {
        materialsSpec = materialsSectionMatch[1].replace(/<!--[^>]*-->/g, '').trim();
    }
    
    // Extract care instructions (from Care Instructions spec-item)
    let careInstructions = '';
    const careSectionMatch = htmlContent.match(/<div class="spec-item"[^>]*>\s*<div class="spec-header">\s*<span>Care Instructions<\/span>[\s\S]*?<div class="spec-content">([\s\S]*?)<\/div>/);
    if (careSectionMatch) {
        careInstructions = careSectionMatch[1].replace(/<!--[^>]*-->/g, '').trim();
    }
    
    // Extract shipping info (from Shipping & Delivery spec-item)
    let shippingInfo = '';
    const shippingSectionMatch = htmlContent.match(/<div class="spec-item"[^>]*>\s*<div class="spec-header">\s*<span>Shipping[^<]*<\/span>[\s\S]*?<div class="spec-content">([\s\S]*?)<\/div>/);
    if (shippingSectionMatch) {
        shippingInfo = shippingSectionMatch[1].replace(/<!--[^>]*-->/g, '').trim();
    }
    
    // Extract craftsmanship
    const craftsmanshipTitleMatch = htmlContent.match(/<h2 class="craft-title">([^<]+)<\/h2>/);
    const craftsmanshipTitle = craftsmanshipTitleMatch ? craftsmanshipTitleMatch[1].trim() : 'Hand-Crafted in San José';
    
    const craftsmanshipTextMatch = htmlContent.match(/<p class="craft-text">\s*([^<]+(?:\s*<[^>]+>[^<]*<\/[^>]+>\s*[^<]+)*)/);
    let craftsmanshipText = '';
    if (craftsmanshipTextMatch) {
        craftsmanshipText = craftsmanshipTextMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    }
    
    // Extract lead time
    const leadTimeMatch = htmlContent.match(/Lead Time:\s*([^<]+)/);
    const leadTime = leadTimeMatch ? leadTimeMatch[1].trim() : '6-8 weeks';
    
    // Check for material sections
    const hasLocalTeak = htmlContent.includes('id="local-teak-section"') && !htmlContent.includes('id="local-teak-section" style="display: none"');
    const hasSemiSatinLacquer = htmlContent.includes('id="semi-satin-lacquer-section"') && !htmlContent.includes('id="semi-satin-lacquer-section" style="display:none"');
    const hasWhiteCement = htmlContent.includes('id="white-cement-section"') && !htmlContent.includes('id="white-cement-section" style="display: none"');
    const hasMetal = htmlContent.includes('id="metal-section"') && !htmlContent.includes('id="metal-section" style="display: none"');
    const hasHardwood = htmlContent.includes('id="hardwood-finish-section"') && !htmlContent.includes('id="hardwood-finish-section" style="display: none"');
    const hasFabric = htmlContent.includes('id="fabric-section"') && !htmlContent.includes('id="fabric-section" style="display: none"');
    const hasLeather = htmlContent.includes('id="leather-section"') && !htmlContent.includes('id="leather-section" style="display: none"');
    const hasGRS = htmlContent.includes('id="grs-section"') && !htmlContent.includes('id="grs-section" style="display: none"');
    
    // Check for color section
    const hasColorSection = htmlContent.includes('id="color-section"') && !htmlContent.includes('id="color-section" style="display: none"');
    
    // Extract color options if color section exists (only from #color-section, not other sections)
    let colorOptions = [];
    if (hasColorSection) {
        const colorSectionMatch = htmlContent.match(/<div class="selector-group" id="color-section">([\s\S]*?)<\/div>\s*<\/div>/);
        if (colorSectionMatch) {
            const colorSection = colorSectionMatch[1];
            const colorMatches = colorSection.matchAll(/<div class="color-swatch-matte"[^>]*style="background-color:\s*#([A-F0-9]+);"[^>]*title="([^"]+)"/gi);
            const seenColors = new Set();
            for (const match of colorMatches) {
                const colorKey = `${match[2]}-${match[1]}`;
                if (!seenColors.has(colorKey)) {
                    seenColors.add(colorKey);
                    colorOptions.push({
                        name: match[2],
                        color: `#${match[1]}`
                    });
                }
            }
        }
    }
    
    // Determine material selection mode
    let materialSelectionMode = 'none';
    if (hasColorSection || hasLocalTeak || hasSemiSatinLacquer || hasWhiteCement || hasMetal || hasHardwood || hasFabric || hasLeather || hasGRS) {
        const visibleSections = [hasColorSection, hasLocalTeak, hasSemiSatinLacquer, hasWhiteCement, hasMetal, hasHardwood, hasFabric, hasLeather, hasGRS].filter(Boolean).length;
        if (visibleSections === 1) {
            materialSelectionMode = '1';
        } else if (visibleSections === 2) {
            materialSelectionMode = '2';
        } else {
            materialSelectionMode = 'all';
        }
    }
    
    // Determine category from filename
    const categories = [];
    if (filename.includes('side-table') || filename.includes('coffee-table') || filename.includes('dining-table') || filename.includes('bistro-table')) {
        categories.push('tables');
        if (filename.includes('side-table')) categories.push('side-tables');
        if (filename.includes('coffee-table')) categories.push('coffee-tables');
        if (filename.includes('dining-table')) categories.push('dining-tables');
    }
    if (filename.includes('chair')) {
        categories.push('seating', 'chairs');
    }
    if (filename.includes('sofa')) {
        categories.push('seating', 'sofas');
    }
    if (filename.includes('daybed')) {
        categories.push('seating', 'daybeds');
    }
    if (filename.includes('desk') || filename.includes('console') || filename.includes('nightstand')) {
        categories.push('storage');
    }
    if (filename.includes('outdoor') || filename.includes('barro')) {
        categories.push('outdoor');
    }
    
    return {
        slug,
        name,
        code,
        price,
        description,
        thumbnailUrl,
        galleryImages,
        sizes,
        dimensions,
        materialsSpec,
        careInstructions,
        shippingInfo,
        craftsmanshipTitle,
        craftsmanshipText,
        leadTime,
        hasLocalTeak,
        hasSemiSatinLacquer,
        hasWhiteCement,
        hasMetal,
        hasHardwood,
        hasFabric,
        hasLeather,
        hasGRS,
        colorOptions,
        materialSelectionMode,
        categories
    };
}

function generateInsertStatement(product) {
    const escapeSql = (str) => {
        if (!str) return '';
        return str.replace(/'/g, "''").replace(/\n/g, ' ');
    };
    
    const galleryImagesJson = JSON.stringify(product.galleryImages || []);
    const sizesJson = JSON.stringify(product.sizes || []);
    const dimensionsJson = JSON.stringify(product.dimensions || []);
    const materialsJson = product.colorOptions.length > 0 
        ? JSON.stringify({ color: product.colorOptions })
        : 'null';
    
    return `INSERT INTO products (
    code,
    name,
    slug,
    badge,
    price,
    description,
    lead_time,
    thumbnail_url,
    gallery_images,
    sizes,
    dimensions,
    materials_spec,
    care_instructions,
    shipping_info,
    craftsmanship_title,
    craftsmanship_text,
    material_selection_mode,
    has_local_teak,
    has_semi_satin_lacquer,
    has_white_cement,
    has_metal,
    has_hardwood,
    has_fabric,
    has_leather,
    has_grs,
    materials,
    category
) VALUES (
    '${product.code}',
    '${escapeSql(product.name)}',
    '${product.slug}',
    'MAKEMAKE',
    ${product.price},
    '${escapeSql(product.description)}',
    '${product.leadTime}',
    '${product.thumbnailUrl}',
    '${galleryImagesJson}'::jsonb,
    '${sizesJson}'::jsonb,
    '${dimensionsJson}'::jsonb,
    '${escapeSql(product.materialsSpec)}',
    '${escapeSql(product.careInstructions)}',
    '${escapeSql(product.shippingInfo)}',
    '${escapeSql(product.craftsmanshipTitle)}',
    '${escapeSql(product.craftsmanshipText)}',
    '${product.materialSelectionMode}',
    ${product.hasLocalTeak},
    ${product.hasSemiSatinLacquer},
    ${product.hasWhiteCement},
    ${product.hasMetal},
    ${product.hasHardwood},
    ${product.hasFabric},
    ${product.hasLeather},
    ${product.hasGRS},
    ${materialsJson === 'null' ? 'null' : `'${materialsJson}'::jsonb`},
    ARRAY[${product.categories.map(c => `'${c}'`).join(', ')}]
);`;
}

// Main execution
const rootDir = path.join(__dirname, '..');
const outputDir = path.join(__dirname, '..', 'supabase');
const inserts = [];

console.log('Extracting product data from HTML files...\n');

productFiles.forEach(filename => {
    const filePath = path.join(rootDir, filename);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${filename}`);
        return;
    }
    
    try {
        const htmlContent = fs.readFileSync(filePath, 'utf8');
        const productData = extractProductData(htmlContent, filename);
        
        if (!productData.name || !productData.code) {
            console.log(`⚠️  Could not extract data from: ${filename}`);
            return;
        }
        
        const insert = generateInsertStatement(productData);
        inserts.push(insert);
        
        console.log(`✓ Extracted: ${productData.name} (${productData.code})`);
    } catch (error) {
        console.error(`✗ Error processing ${filename}:`, error.message);
    }
});

// Write all INSERT statements to a file
const outputFile = path.join(outputDir, 'insert-all-products.sql');
const outputContent = `-- INSERT statements for all products
-- Generated automatically from HTML files
-- Run these in your Supabase SQL Editor

${inserts.join('\n\n')}
`;

fs.writeFileSync(outputFile, outputContent, 'utf8');
console.log(`\n✅ Generated ${inserts.length} INSERT statements in: supabase/insert-all-products.sql`);
