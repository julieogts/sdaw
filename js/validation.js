// Security validation utilities for input sanitization and validation

class SecurityValidator {
    // Sanitize string input
    static sanitizeString(input, maxLength = 255) {
        if (typeof input !== 'string') {
            return String(input || '').trim();
        }
        
        return input
            .trim()
            .slice(0, maxLength)
            .replace(/[<>\"'&]/g, (match) => {
                const escapeMap = {
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#x27;',
                    '&': '&amp;'
                };
                return escapeMap[match];
            });
    }

    // Validate email format
    static validateEmail(email) {
        if (!email || typeof email !== 'string') {
            return { valid: false, message: 'Email is required' };
        }
        
        const sanitizedEmail = this.sanitizeString(email, 100).toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(sanitizedEmail)) {
            return { valid: false, message: 'Invalid email format' };
        }
        
        if (sanitizedEmail.length < 5 || sanitizedEmail.length > 100) {
            return { valid: false, message: 'Email length must be between 5 and 100 characters' };
        }
        
        return { valid: true, sanitized: sanitizedEmail };
    }

    // Validate password
    static validatePassword(password) {
        if (!password || typeof password !== 'string') {
            return { valid: false, message: 'Password is required' };
        }
        
        const sanitizedPassword = password.trim();
        
        if (sanitizedPassword.length < 6) {
            return { valid: false, message: 'Password must be at least 6 characters long' };
        }
        
        if (sanitizedPassword.length > 128) {
            return { valid: false, message: 'Password must be less than 128 characters' };
        }
        
        // Check for common weak passwords
        const weakPasswords = ['password', '123456', 'admin', 'qwerty', 'letmein'];
        if (weakPasswords.includes(sanitizedPassword.toLowerCase())) {
            return { valid: false, message: 'Password is too common, please choose a stronger password' };
        }
        
        return { valid: true, sanitized: sanitizedPassword };
    }

    // Validate username
    static validateUsername(username) {
        if (!username || typeof username !== 'string') {
            return { valid: false, message: 'Username is required' };
        }
        
        const sanitizedUsername = this.sanitizeString(username, 50).toLowerCase();
        
        if (sanitizedUsername.length < 3) {
            return { valid: false, message: 'Username must be at least 3 characters long' };
        }
        
        if (sanitizedUsername.length > 50) {
            return { valid: false, message: 'Username must be less than 50 characters' };
        }
        
        // Only allow alphanumeric characters and underscores
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(sanitizedUsername)) {
            return { valid: false, message: 'Username can only contain letters, numbers, and underscores' };
        }
        
        return { valid: true, sanitized: sanitizedUsername };
    }

    // Validate full name
    static validateFullName(fullName) {
        if (!fullName || typeof fullName !== 'string') {
            return { valid: false, message: 'Full name is required' };
        }
        
        const sanitizedName = this.sanitizeString(fullName, 100);
        
        if (sanitizedName.length < 2) {
            return { valid: false, message: 'Full name must be at least 2 characters long' };
        }
        
        if (sanitizedName.length > 100) {
            return { valid: false, message: 'Full name must be less than 100 characters' };
        }
        
        // Allow letters, spaces, hyphens, and apostrophes
        const nameRegex = /^[a-zA-Z\s\-']+$/;
        if (!nameRegex.test(sanitizedName)) {
            return { valid: false, message: 'Full name can only contain letters, spaces, hyphens, and apostrophes' };
        }
        
        return { valid: true, sanitized: sanitizedName };
    }

    // Validate MongoDB ObjectId
    static validateObjectId(id) {
        if (!id || typeof id !== 'string') {
            return { valid: false, message: 'Invalid ID format' };
        }
        
        const objectIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!objectIdRegex.test(id)) {
            return { valid: false, message: 'Invalid ID format' };
        }
        
        return { valid: true, sanitized: id };
    }

    // Validate numeric input
    static validateNumber(value, min = 0, max = Number.MAX_SAFE_INTEGER) {
        if (value === null || value === undefined || value === '') {
            return { valid: false, message: 'Number is required' };
        }
        
        const num = Number(value);
        if (isNaN(num)) {
            return { valid: false, message: 'Invalid number format' };
        }
        
        if (num < min || num > max) {
            return { valid: false, message: `Number must be between ${min} and ${max}` };
        }
        
        return { valid: true, sanitized: num };
    }

    // Validate phone number (Philippine format)
    static validatePhoneNumber(phone) {
        if (!phone || typeof phone !== 'string') {
            return { valid: false, message: 'Phone number is required' };
        }
        
        const trimmedPhone = phone.trim();
        
        // Philippine phone number patterns (check original format first)
        const patterns = [
            /^09\d{9}$/, // Mobile: 09XXXXXXXXX
            /^\+639\d{9}$/, // International: +639XXXXXXXXX
            /^639\d{9}$/, // Without +: 639XXXXXXXXX
            /^0\d{2}\d{7}$/, // Landline: 0XX-XXXXXXX
        ];
        
        const isValidFormat = patterns.some(pattern => pattern.test(trimmedPhone));
        
        if (!isValidFormat) {
            return { valid: false, message: 'Invalid phone number format. Use format: 09XXXXXXXXX or +639XXXXXXXXX' };
        }
        
        // For +639 format, keep the + sign in sanitized version
        let sanitizedPhone;
        if (trimmedPhone.startsWith('+639')) {
            sanitizedPhone = trimmedPhone; // Keep +639 format
        } else {
            sanitizedPhone = trimmedPhone.replace(/\D/g, ''); // Remove all non-digits for other formats
        }
        
        return { valid: true, sanitized: sanitizedPhone };
    }

    // Validate price/amount input
    static validatePrice(price, min = 0, max = 999999.99) {
        if (price === null || price === undefined || price === '') {
            return { valid: false, message: 'Price is required' };
        }
        
        const num = Number(price);
        if (isNaN(num)) {
            return { valid: false, message: 'Invalid price format' };
        }
        
        if (num < min) {
            return { valid: false, message: `Price must be at least ${min}` };
        }
        
        if (num > max) {
            return { valid: false, message: `Price must not exceed ${max}` };
        }
        
        // Check for reasonable decimal places (max 2)
        const decimalPlaces = (price.toString().split('.')[1] || '').length;
        if (decimalPlaces > 2) {
            return { valid: false, message: 'Price can have maximum 2 decimal places' };
        }
        
        return { valid: true, sanitized: num };
    }

    // Validate bank account number
    static validateBankAccount(accountNumber) {
        if (!accountNumber || typeof accountNumber !== 'string') {
            return { valid: false, message: 'Bank account number is required' };
        }
        
        const sanitized = accountNumber.trim().replace(/\s/g, '');
        
        // Bank account should be 10-20 digits
        if (!/^\d{10,20}$/.test(sanitized)) {
            return { valid: false, message: 'Bank account must be 10-20 digits' };
        }
        
        return { valid: true, sanitized: sanitized };
    }

    // Validate GCash number
    static validateGCashNumber(gcashNumber) {
        if (!gcashNumber || typeof gcashNumber !== 'string') {
            return { valid: false, message: 'GCash number is required' };
        }
        
        const trimmed = gcashNumber.trim();
        
        // GCash number patterns (support both 09 and +639 formats)
        const patterns = [
            /^09\d{9}$/, // Standard: 09XXXXXXXXX
            /^\+639\d{9}$/, // International: +639XXXXXXXXX
        ];
        
        const isValidFormat = patterns.some(pattern => pattern.test(trimmed));
        
        if (!isValidFormat) {
            return { valid: false, message: 'GCash number must be 11 digits starting with 09 or +639' };
        }
        
        // For +639 format, keep the + sign in sanitized version
        let sanitized;
        if (trimmed.startsWith('+639')) {
            sanitized = trimmed; // Keep +639 format
        } else {
            sanitized = trimmed.replace(/\D/g, ''); // Remove all non-digits for 09 format
        }
        
        return { valid: true, sanitized: sanitized };
    }

    // Validate postal code (Philippine format)
    static validatePostalCode(postalCode) {
        if (!postalCode || typeof postalCode !== 'string') {
            return { valid: false, message: 'Postal code is required' };
        }
        
        const sanitized = postalCode.trim().replace(/\D/g, '');
        
        // Philippine postal codes are 4 digits
        if (!/^\d{4}$/.test(sanitized)) {
            return { valid: false, message: 'Postal code must be exactly 4 digits' };
        }
        
        return { valid: true, sanitized: sanitized };
    }

    // Validate product name
    static validateProductName(productName) {
        if (!productName || typeof productName !== 'string') {
            return { valid: false, message: 'Product name is required' };
        }
        
        const sanitized = this.sanitizeString(productName, 200);
        
        if (sanitized.length < 2) {
            return { valid: false, message: 'Product name must be at least 2 characters' };
        }
        
        if (sanitized.length > 200) {
            return { valid: false, message: 'Product name must be less than 200 characters' };
        }
        
        // Allow letters, numbers, spaces, hyphens, and common punctuation
        const nameRegex = /^[a-zA-Z0-9\s\-.,()&]+$/;
        if (!nameRegex.test(sanitized)) {
            return { valid: false, message: 'Product name contains invalid characters' };
        }
        
        return { valid: true, sanitized: sanitized };
    }

    // Validate customer name (for walk-in orders)
    static validateCustomerName(customerName) {
        if (!customerName || typeof customerName !== 'string') {
            return { valid: false, message: 'Customer name is required' };
        }
        
        const sanitized = this.sanitizeString(customerName, 100);
        
        if (sanitized.length < 2) {
            return { valid: false, message: 'Customer name must be at least 2 characters' };
        }
        
        if (sanitized.length > 100) {
            return { valid: false, message: 'Customer name must be less than 100 characters' };
        }
        
        // Allow letters, spaces, hyphens, and apostrophes
        const nameRegex = /^[a-zA-Z\s\-']+$/;
        if (!nameRegex.test(sanitized)) {
            return { valid: false, message: 'Customer name can only contain letters, spaces, hyphens, and apostrophes' };
        }
        
        return { valid: true, sanitized: sanitized };
    }

    // Validate address data
    static validateAddress(addressData) {
        if (!addressData || typeof addressData !== 'object') {
            return { valid: false, message: 'Address data is required' };
        }
        
        const requiredFields = ['street', 'city', 'postalCode'];
        for (const field of requiredFields) {
            if (!addressData[field] || typeof addressData[field] !== 'string') {
                return { valid: false, message: `${field} is required` };
            }
        }
        
        const sanitizedAddress = {
            street: this.sanitizeString(addressData.street, 200),
            city: this.sanitizeString(addressData.city, 100),
            postalCode: this.sanitizeString(addressData.postalCode, 20),
            province: addressData.province ? this.sanitizeString(addressData.province, 100) : '',
            country: addressData.country ? this.sanitizeString(addressData.country, 100) : 'Philippines',
            isDefault: Boolean(addressData.isDefault)
        };
        
        return { valid: true, sanitized: sanitizedAddress };
    }

    // Prevent XSS attacks
    static escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') {
            return String(unsafe || '');
        }
        
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Validate and sanitize search query
    static validateSearchQuery(query) {
        if (!query || typeof query !== 'string') {
            return { valid: false, message: 'Search query is required' };
        }
        
        const sanitizedQuery = this.sanitizeString(query, 100);
        
        if (sanitizedQuery.length < 1) {
            return { valid: false, message: 'Search query cannot be empty' };
        }
        
        // Remove potentially dangerous characters
        const dangerousChars = /[<>\"'&;(){}[\]\\]/g;
        if (dangerousChars.test(sanitizedQuery)) {
            return { valid: false, message: 'Search query contains invalid characters' };
        }
        
        return { valid: true, sanitized: sanitizedQuery };
    }

    // Rate limiting helper
    static checkRateLimit(key, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
        const now = Date.now();
        const attempts = JSON.parse(localStorage.getItem(`rateLimit_${key}`) || '[]');
        
        // Remove old attempts outside the window
        const recentAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
        
        if (recentAttempts.length >= maxAttempts) {
            return { 
                allowed: false, 
                message: 'Too many attempts. Please try again later.',
                remainingTime: Math.ceil((recentAttempts[0] + windowMs - now) / 1000)
            };
        }
        
        // Add current attempt
        recentAttempts.push(now);
        localStorage.setItem(`rateLimit_${key}`, JSON.stringify(recentAttempts));
        
        return { allowed: true };
    }

    // Clear rate limit for a key
    static clearRateLimit(key) {
        localStorage.removeItem(`rateLimit_${key}`);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityValidator;
} else {
    window.SecurityValidator = SecurityValidator;
}