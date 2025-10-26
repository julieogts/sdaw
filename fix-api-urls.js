// Script to fix all localhost:3000 references in JavaScript files
const fs = require('fs');
const path = require('path');

// Files to update
const filesToUpdate = [
    'js/cart.js',
    'js/cart-tab.js', 
    'js/auth.js',
    'js/addressModal.js',
    'js/product-fixed.js',
    'js/login.js',
    'js/stockManager.js'
];

// HTML files to add config.js to
const htmlFilesToUpdate = [
    'checkout.html',
    'staff-dashboard.html',
    'profile.html',
    'order-history.html',
    'cart.html',
    'addresses.html',
    'product.html'
];

function updateJavaScriptFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace localhost:3000 with API_CONFIG.getApiUrl()
        content = content.replace(
            /http:\/\/localhost:3000\/api/g, 
            'API_CONFIG.getApiUrl("")'
        );
        
        // Fix specific patterns
        content = content.replace(
            /fetch\(`http:\/\/localhost:3000\/api\/([^`]+)`\)/g,
            'fetch(API_CONFIG.getApiUrl("/$1"))'
        );
        
        content = content.replace(
            /fetch\('http:\/\/localhost:3000\/api\/([^']+)'\)/g,
            'fetch(API_CONFIG.getApiUrl("/$1"))'
        );
        
        content = content.replace(
            /fetch\("http:\/\/localhost:3000\/api\/([^"]+)"\)/g,
            'fetch(API_CONFIG.getApiUrl("/$1"))'
        );
        
        fs.writeFileSync(filePath, content);
        console.log(`✅ Updated ${filePath}`);
    } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
    }
}

function updateHtmlFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Add config.js script before other scripts
        if (!content.includes('js/config.js')) {
            content = content.replace(
                /(<script src="js\/[^"]+\.js"><\/script>)/,
                '<script src="js/config.js"></script>\n    $1'
            );
            fs.writeFileSync(filePath, content);
            console.log(`✅ Added config.js to ${filePath}`);
        } else {
            console.log(`✅ ${filePath} already has config.js`);
        }
    } catch (error) {
        console.error(`❌ Error updating ${filePath}:`, error.message);
    }
}

console.log('🔧 Fixing API URLs in JavaScript files...');
filesToUpdate.forEach(updateJavaScriptFile);

console.log('\n🔧 Adding config.js to HTML files...');
htmlFilesToUpdate.forEach(updateHtmlFile);

console.log('\n✅ API URL fixes completed!');
console.log('📝 Remember to upload all files to your live website!');
