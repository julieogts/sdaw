// Security configuration for production environment

const crypto = require('crypto');

// Generate strong JWT secret
function generateJWTSecret() {
    return crypto.randomBytes(64).toString('hex');
}

// Security configuration
const securityConfig = {
    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET || generateJWTSecret(),
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        issuer: 'sanrico-mercantile',
        audience: 'sanrico-users',
        algorithm: 'HS256'
    },
    
    // Password hashing
    bcrypt: {
        rounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
        minLength: 6,
        maxLength: 128
    },
    
    // Rate limiting
    rateLimit: {
        maxAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
        windowMs: parseInt(process.env.LOCKOUT_DURATION) || 15 * 60 * 1000, // 15 minutes
        maxRequests: 100, // per window
        windowSize: 15 * 60 * 1000 // 15 minutes
    },
    
    // Input validation
    validation: {
        maxStringLength: 255,
        maxEmailLength: 100,
        maxUsernameLength: 50,
        maxFullNameLength: 100,
        maxAddressLength: 200,
        maxSearchLength: 100
    },
    
    // CORS configuration
    cors: {
        origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://127.0.0.1:3000', 'http://localhost:3000'], // Allow specific origins
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    },
    
    // Session configuration
    session: {
        timeout: parseInt(process.env.SESSION_TIMEOUT) || 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict'
    },
    
    // Security headers
    headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;"
    },
    
    // Database security
    database: {
        maxConnectionPoolSize: 10,
        connectionTimeout: 30000,
        queryTimeout: 30000,
        enableSSL: process.env.NODE_ENV === 'production'
    },
    
    // Logging
    logging: {
        logLevel: process.env.LOG_LEVEL || 'info',
        logSecurityEvents: true,
        logFailedAttempts: true,
        logSuspiciousActivity: true
    }
};

// Security middleware functions
const securityMiddleware = {
    // Set security headers
    setSecurityHeaders: (req, res, next) => {
        Object.entries(securityConfig.headers).forEach(([key, value]) => {
            res.setHeader(key, value);
        });
        next();
    },
    
    // Rate limiting middleware
    rateLimit: (req, res, next) => {
        const clientIP = req.ip || req.connection.remoteAddress;
        const key = `rate_limit_${clientIP}`;
        
        // This would be implemented with Redis in production
        // For now, we'll use a simple in-memory store
        if (!global.rateLimitStore) {
            global.rateLimitStore = new Map();
        }
        
        const now = Date.now();
        const windowMs = securityConfig.rateLimit.windowMs;
        const maxRequests = securityConfig.rateLimit.maxRequests;
        
        if (!global.rateLimitStore.has(key)) {
            global.rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
        } else {
            const data = global.rateLimitStore.get(key);
            if (now > data.resetTime) {
                global.rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
            } else {
                data.count++;
                if (data.count > maxRequests) {
                    return res.status(429).json({
                        error: 'Too many requests',
                        retryAfter: Math.ceil((data.resetTime - now) / 1000)
                    });
                }
            }
        }
        
        next();
    },
    
    // Input sanitization middleware
    sanitizeInput: (req, res, next) => {
        const sanitizeObject = (obj) => {
            if (typeof obj !== 'object' || obj === null) return obj;
            
            const sanitized = {};
            for (const [key, value] of Object.entries(obj)) {
                if (typeof value === 'string') {
                    // Basic XSS prevention
                    sanitized[key] = value
                        .replace(/[<>\"'&]/g, (match) => {
                            const escapeMap = {
                                '<': '&lt;',
                                '>': '&gt;',
                                '"': '&quot;',
                                "'": '&#x27;',
                                '&': '&amp;'
                            };
                            return escapeMap[match];
                        })
                        .trim();
                } else if (typeof value === 'object' && value !== null) {
                    sanitized[key] = sanitizeObject(value);
                } else {
                    sanitized[key] = value;
                }
            }
            return sanitized;
        };
        
        if (req.body) {
            req.body = sanitizeObject(req.body);
        }
        if (req.query) {
            req.query = sanitizeObject(req.query);
        }
        if (req.params) {
            req.params = sanitizeObject(req.params);
        }
        
        next();
    },
    
    // Log security events
    logSecurityEvent: (event, details) => {
        if (securityConfig.logging.logSecurityEvents) {
            console.log(`[SECURITY] ${event}:`, {
                timestamp: new Date().toISOString(),
                event,
                details
            });
        }
    }
};

module.exports = {
    securityConfig,
    securityMiddleware,
    generateJWTSecret
};
