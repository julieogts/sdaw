function formatPHPPrice(price) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP'
    }).format(price);
}

// Handle header search functionality
document.addEventListener('DOMContentLoaded', () => {
    const headerSearchForm = document.querySelector('.header-search');
    let searchTimeout;
    let searchDropdown;
    let products = [];
    
    // Load products from API
    async function loadProducts() {
        try {
            const response = await fetch(API_CONFIG.getApiUrl('/products'));
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            products = await response.json();
            // Convert price to number - prefer SellingPrice, but fall back gracefully
            const toNumber = (val) => {
                if (val === null || val === undefined) return NaN;
                if (typeof val === 'object' && val.$numberDecimal !== undefined) return parseFloat(val.$numberDecimal);
                return parseFloat(val);
            };
            products = products.map(product => {
                const candidates = [product.SellingPrice, product.sellingPrice, product.Price, product.price];
                let finalPrice = NaN;
                for (const c of candidates) {
                    const n = toNumber(c);
                    if (!isNaN(n)) { finalPrice = n; break; }
                }
                return { ...product, price: finalPrice };
            });
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    // Create search dropdown if it doesn't exist
    function createSearchDropdown() {
        if (!searchDropdown) {
            searchDropdown = document.createElement('div');
            searchDropdown.className = 'search-dropdown';
            searchDropdown.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                margin-top: 8px;
                z-index: 1000;
                display: none;
                max-height: 400px;
                overflow-y: auto;
            `;
            headerSearchForm.appendChild(searchDropdown);
        }
    }

    // Find closest matches using Levenshtein distance
    function findClosestMatches(query, products, limit = 3) {
        if (!query || !products.length) return [];
        
        // First try to find exact matches
        const exactMatches = products.filter(product => 
            product.name.toLowerCase() === query.toLowerCase()
        );

        if (exactMatches.length > 0) {
            return exactMatches;
        }

        // If no exact matches, find partial matches
        const partialMatches = products
            .filter(product => 
                product.name.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, limit);

        return partialMatches;
    }

    // Calculate Levenshtein distance between two strings
    function levenshteinDistance(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matrix = [];

        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        return matrix[b.length][a.length];
    }

    // Update search results
    function updateSearchResults(query) {
        if (!searchDropdown || !products.length) return;

        const matches = findClosestMatches(query, products);

        if (matches.length > 0) {
            searchDropdown.innerHTML = matches.map(product => `
                <a href="product.html?id=${product._id}" class="search-result-item">
                    <img src="${product.image || 'images/sanrico_logo_1.png'}" alt="${product.name}">
                    <div class="search-result-info">
                        <div class="search-result-name">${product.name}</div>
                        <div class="search-result-price">${formatPHPPrice(product.price)}</div>
                    </div>
                </a>
            `).join('');

            // Add styles for search results
            const style = document.createElement('style');
            style.textContent = `
                .search-result-item {
                    display: flex;
                    align-items: center;
                    padding: 12px;
                    text-decoration: none;
                    color: inherit;
                    border-bottom: 1px solid #eee;
                    transition: background 0.2s;
                }
                .search-result-item:last-child {
                    border-bottom: none;
                }
                .search-result-item:hover {
                    background: #f5f5f5;
                }
                .search-result-item img {
                    width: 40px;
                    height: 40px;
                    object-fit: cover;
                    border-radius: 4px;
                    margin-right: 12px;
                }
                .search-result-info {
                    flex: 1;
                }
                .search-result-name {
                    font-weight: 500;
                    margin-bottom: 4px;
                }
                .search-result-price {
                    color: #e53935;
                    font-weight: 600;
                }
            `;
            document.head.appendChild(style);

            searchDropdown.style.display = 'block';
        } else {
            searchDropdown.style.display = 'none';
        }
    }
    
    if (headerSearchForm) {
        createSearchDropdown();
        const searchInput = headerSearchForm.querySelector('input');

        // Load products when the page loads
        loadProducts();

        // Handle input changes
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            // Clear previous timeout
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }

            // Set new timeout
            searchTimeout = setTimeout(() => {
                updateSearchResults(query);
            }, 300); // 300ms delay for better performance
        });

        // Handle form submission
        headerSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            
            if (query) {
                window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!headerSearchForm.contains(e.target)) {
                searchDropdown.style.display = 'none';
            }
        });
    }
});
