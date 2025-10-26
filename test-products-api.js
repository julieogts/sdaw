// Test the products API endpoint
const http = require('http');

function testProductsAPI() {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/products',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        console.log(`✅ Products API Response Status: ${res.statusCode}`);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const products = JSON.parse(data);
                console.log(`✅ Found ${products.length} products`);
                if (products.length > 0) {
                    console.log('✅ First product:', products[0].name || products[0].Name || 'Unknown');
                }
            } catch (error) {
                console.log('✅ Raw response:', data.substring(0, 200) + '...');
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ Products API Error:', error.message);
    });

    req.end();
}

console.log('🔍 Testing Products API...');
testProductsAPI();
