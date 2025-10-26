// Simple test to check if the API is working
const http = require('http');

function testAPI() {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/debug/test',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        console.log(`✅ API Response Status: ${res.statusCode}`);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('✅ API Response:', data);
        });
    });

    req.on('error', (error) => {
        console.error('❌ API Error:', error.message);
    });

    req.end();
}

console.log('🔍 Testing API connection...');
testAPI();
