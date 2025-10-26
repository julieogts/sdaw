// Comprehensive script to fix ALL localhost references
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing ALL localhost references...');

// Find all HTML and JS files
const files = [
    'staff-dashboard-backup-latest.html',
    'staff-dashboard-backup.html',
    'test-api.html'
];

function fixFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  File not found: ${filePath}`);
            return;
        }

        let content = fs.readFileSync(filePath, 'utf8');
        let changes = 0;

        // Fix various localhost patterns
        const patterns = [
            {
                from: /http:\/\/localhost:3000\/api\/([^"'\s`]+)/g,
                to: 'API_CONFIG.getApiUrl("/$1")'
            },
            {
                from: /fetch\(['"`]http:\/\/localhost:3000\/api\/([^"'\s`]+)['"`]\)/g,
                to: 'fetch(API_CONFIG.getApiUrl("/$1"))'
            },
            {
                from: /fetch\(`http:\/\/localhost:3000\/api\/([^`]+)`\)/g,
                to: 'fetch(API_CONFIG.getApiUrl("/$1"))'
            }
        ];

        patterns.forEach(pattern => {
            const newContent = content.replace(pattern.from, pattern.to);
            if (newContent !== content) {
                content = newContent;
                changes++;
            }
        });

        if (changes > 0) {
            fs.writeFileSync(filePath, content);
            console.log(`✅ Fixed ${changes} references in ${filePath}`);
        } else {
            console.log(`✅ No changes needed in ${filePath}`);
        }

    } catch (error) {
        console.error(`❌ Error fixing ${filePath}:`, error.message);
    }
}

// Fix all files
files.forEach(fixFile);

console.log('\n🎯 All localhost references have been fixed!');
console.log('📝 Make sure to upload all files to your live website.');
