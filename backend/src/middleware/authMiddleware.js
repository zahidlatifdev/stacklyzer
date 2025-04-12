const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');

// Store for used tokens to prevent reuse
const usedTokens = new Map();

// Cleanup function to remove expired tokens from the store
// to prevent memory leaks
const cleanupUsedTokens = () => {
    const now = Date.now();
    for (const [token, timestamp] of usedTokens.entries()) {
        // Remove tokens older than 10 minutes (giving some buffer after expiration)
        if (now - timestamp > 10 * 60 * 1000) {
            usedTokens.delete(token);
        }
    }
};

// Run cleanup every 5 minutes
setInterval(cleanupUsedTokens, 5 * 60 * 1000);

/**
 * Authentication middleware and utilities
 */
class AuthMiddleware {
    /**
     * Setup JWT authentication middleware
     * @returns Express middleware that validates JWT tokens
     */
    static authenticate() {
        return [
            // JWT validation
            expressJwt({
                secret: process.env.JWT_SECRET,
                algorithms: ['HS256'],
                requestProperty: 'auth'
            }).unless({ path: ['/api', '/api/token', '/api/detect'] }),

            // Check if token has been used before (for one-time use)
            (req, res, next) => {
                // Skip for non-authenticated routes
                if (req.path === '/api' || req.path === '/api/token' || req.path === '/api/detect') {
                    return next();
                }

                // Get token from authorization header
                const authHeader = req.headers.authorization || '';
                const token = authHeader.split(' ')[1];

                if (!token) {
                    return next();
                }

                // Check if token has been used before
                if (usedTokens.has(token)) {
                    return res.status(401).json({
                        error: 'Token already used',
                        message: 'This token has already been used. Please request a new token.'
                    });
                }

                // Mark token as used
                usedTokens.set(token, Date.now());
                next();
            }
        ];
    }

    /**
     * Generate API token for frontend use
     * @param {string} platform - The platform requesting the token (web/android)
     * @returns {string} JWT token
     */
    static generateApiToken(platform = 'web') {
        // Create a token that expires in 5 minutes
        return jwt.sign(
            {
                origin: process.env.FRONTEND_URL,
                platform: platform,
                type: 'api-access',
                timestamp: Date.now()
            },
            process.env.JWT_SECRET,
            { expiresIn: '5m' }
        );
    }

    /**
     * Verify request origin matches allowed origin
     */
    static verifyOrigin(req, res, next) {
        const origin = req.headers.origin || req.headers.referer;

        // Skip for token endpoint
        if (req.path === '/api/token') {
            return next();
        }

        // Skip for detect endpoint
        if (req.path === '/api/detect') {
            return next();
        }

        // Check for app-specific tokens from mobile applications
        if (req.headers['x-app-platform'] === 'android') {
            // For Android app requests, verify against the app token
            const appToken = req.headers['x-app-token'];
            if (!appToken || appToken !== process.env.ANDROID_APP_SECRET) {
                return res.status(403).json({ error: 'Invalid application token' });
            }
            return next();
        }

        // Web requests must have a valid origin header
        if (!origin) {
            return res.status(403).json({ error: 'Missing origin header' });
        }

        // Check if origin is from allowed frontend
        const allowedOrigin = process.env.FRONTEND_URL;
        if (!origin.startsWith(allowedOrigin)) {
            return res.status(403).json({ error: 'Unauthorized origin' });
        }

        next();
    }

    /**
     * Handle JWT authentication errors
     */
    static handleAuthError(err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            return res.status(401).json({
                error: 'Invalid or expired token',
                message: 'Your token is invalid or has expired. Please request a new token.'
            });
        }
        next(err);
    }
}

module.exports = AuthMiddleware;