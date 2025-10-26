// API Configuration for different environments
const API_CONFIG = {
    // Automatically detect environment
    getBaseUrl: function() {
        // If we're on the live domain, use the live API
        if (window.location.hostname === 'sanricomercantile.com' || 
            window.location.hostname === 'www.sanricomercantile.com') {
            return 'https://sanricomercantile.com/api';
        }
        
        // If we're on localhost, use local API
        if (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3000/api';
        }
        
        // Default fallback
        return 'http://localhost:3000/api';
    },
    
    // Get the full API URL for any endpoint
    getApiUrl: function(endpoint) {
        const baseUrl = this.getBaseUrl();
        return `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    }
};

// Make it globally available
window.API_CONFIG = API_CONFIG;
