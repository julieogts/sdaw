# 🚀 LIVE WEBSITE DEPLOYMENT CHECKLIST

## ✅ **FIXED ISSUES:**
- ✅ **API URLs**: All JavaScript files now use dynamic API configuration
- ✅ **Config System**: Added `js/config.js` for automatic environment detection
- ✅ **HTML Files**: Updated all HTML files to include the config script

## 📋 **DEPLOYMENT STEPS:**

### **Step 1: Upload Files to Hostinger**
1. **Upload ALL files** to your Hostinger `public_html` folder
2. **Make sure to include:**
   - `js/config.js` (NEW - critical for API routing)
   - All updated JavaScript files
   - All updated HTML files

### **Step 2: Set Up Server on Hostinger**
1. **Create `.env` file** in your project root on Hostinger:
```env
MONGODB_URI=mongodb+srv://24uglyandrew:weaklings162@sanricosite.vgnc0qj.mongodb.net/
DATABASE_NAME=MyProductsDb
JWT_SECRET=CHANGE_THIS_TO_SECURE_RANDOM_STRING
SENDER_EMAIL=sanricomercantileofficial@gmail.com
N8N_WEBHOOK_URL=http://localhost:5678/webhook/send-verification-email
PORT=3000
NODE_ENV=production
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start server:**
```bash
npm start
```

### **Step 3: Test Your Live Website**
1. **Go to:** `https://sanricomercantile.com`
2. **Check:** Products should load without errors
3. **Test:** Search, cart, and other features

## 🔧 **HOW THE FIX WORKS:**

### **Before (Broken):**
```javascript
fetch('http://localhost:3000/api/products') // ❌ Always localhost
```

### **After (Fixed):**
```javascript
fetch(API_CONFIG.getApiUrl('/products')) // ✅ Auto-detects environment
```

### **Environment Detection:**
- **Live Domain**: `https://sanricomercantile.com/api/products`
- **Localhost**: `http://localhost:3000/api/products`

## ⚠️ **IMPORTANT NOTES:**
1. **Change JWT_SECRET** to a secure random string before going live
2. **Upload ALL files** - the config system is critical
3. **Test thoroughly** after deployment

## 🎯 **EXPECTED RESULT:**
- ✅ No more `ERR_BLOCKED_BY_CLIENT` errors
- ✅ Products load correctly on live website
- ✅ All API calls work on both local and live environments
