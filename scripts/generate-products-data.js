// Build-time script to generate products data JS from Supabase
// This creates a products-data.js file loaded via <script> tag before main.js
// Run this during Netlify build: node scripts/generate-products-data.js

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

// Output file
const outputFile = path.join(__dirname, '../js/products-data.js');

// Main function
async function generateProductsData() {
    console.log('Fetching products from Supabase...');

    // Try full select first (includes is_grid if migration was run)
    let products = null;
    let error = null;

    const resFull = await supabase
        .from('products')
        .select('id, code, name, slug, price, original_price, thumbnail_url, category, is_grid')
        .order('name');

    if (resFull.error && resFull.error.code === '42703') {
        // Column is_grid doesn't exist yet — run supabase/migration.sql
        console.warn('Column is_grid not found. Using defaults. Run supabase/migration.sql to add it.');
        const resFallback = await supabase
            .from('products')
            .select('id, code, name, slug, price, original_price, thumbnail_url, category')
            .order('name');
        products = resFallback.data;
        error = resFallback.error;
    } else {
        products = resFull.data;
        error = resFull.error;
    }

    if (error) {
        console.error('Error fetching products:', error);
        process.exit(1);
    }

    if (!products || products.length === 0) {
        console.warn('No products found in Supabase');
        fs.writeFileSync(outputFile, 'var productsDatabase = [];\n', 'utf8');
        return;
    }

    // Transform (is_grid may be missing until migration is run)
    const transformedProducts = products.map(product => ({
        name: product.name,
        code: product.code,
        price: parseFloat(product.price) || 0,
        originalPrice: product.original_price ? parseFloat(product.original_price) : null,
        url: `pages/products/${product.slug}.html`,
        image: product.thumbnail_url || '',
        category: product.category || [],
        isGrid: product.is_grid === true
    }));
    
    // Write as JS file with var declaration (loaded via <script> tag)
    const jsContent = 'var productsDatabase = ' + JSON.stringify(transformedProducts, null, 2) + ';\n';
    fs.writeFileSync(outputFile, jsContent, 'utf8');
    console.log(`✅ Generated products-data.js with ${transformedProducts.length} products`);
}

// Run the script
generateProductsData().catch(error => {
    console.error('Error generating products data:', error);
    process.exit(1);
});
