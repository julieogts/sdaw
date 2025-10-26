// Verify that all localhost references have been fixed
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying all localhost fixes...');

// Check for any remaining localhost:3000 references
const { execSync } = require('child_process');

try {
    const result = execSync('grep -r "localhost:3000" . --include="*.js" --include="*.html" | grep -v node_modules | grep -v ".git"', { encoding: 'utf8' });
    
    if (result.trim()) {
        console.log('❌ Found remaining localhost references:');
        console.log(result);
    } else {
        console.log('✅ No localhost:3000 references found!');
    }
} catch (error) {
    // grep returns exit code 1 when no matches found, which is good
    if (error.status === 1) {
        console.log('✅ No localhost:3000 references found!');
    } else {
        console.log('❌ Error checking files:', error.message);
    }
}

// Check if config.js exists and is properly formatted
if (fs.existsSync('js/config.js')) {
    console.log('✅ js/config.js exists');
    
    const configContent = fs.readFileSync('js/config.js', 'utf8');
    if (configContent.includes('sanricomercantile.com')) {
        console.log('✅ Config includes live domain');
    } else {
        console.log('❌ Config missing live domain');
    }
} else {
    console.log('❌ js/config.js not found!');
}

console.log('\n🎯 Verification complete!');
console.log('📝 Ready for deployment to Hostinger!');
