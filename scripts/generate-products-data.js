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
    
    const { data: products, error } = await supabase
        .from('products')
        .select('id, code, name, slug, price, original_price, thumbnail_url, category')
        .order('name');
    
    if (error) {
        console.error('Error fetching products:', error);
        process.exit(1);
    }
    
    if (!products || products.length === 0) {
        console.warn('No products found in Supabase');
        // Create empty array file
        fs.writeFileSync(outputFile, 'var productsDatabase = [];\n', 'utf8');
        return;
    }
    
    // Transform products to match existing format
    const transformedProducts = products.map(product => ({
        name: product.name,
        code: product.code,
        price: parseFloat(product.price) || 0,
        originalPrice: product.original_price ? parseFloat(product.original_price) : null,
        url: `${product.slug}.html`,
        image: product.thumbnail_url || '',
        category: product.category || []
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
