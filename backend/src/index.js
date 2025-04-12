require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { detectTechnologies } = require('./detector');
const emailService = require('./services/emailService');
const AuthMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Enhanced CORS to handle both web and mobile requests
app.use((req, res, next) => {
    // For non-browser clients like Android app
    if (req.headers['x-app-platform'] === 'android') {
        // Skip CORS for Android app requests
        next();
    } else {
        // Apply standard CORS for web requests
        cors({
            origin: process.env.FRONTEND_URL,
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            optionsSuccessStatus: 200
        })(req, res, next);
    }
});

// Apply authentication middleware
app.use(AuthMiddleware.verifyOrigin);
app.use(AuthMiddleware.authenticate());
app.use(AuthMiddleware.handleAuthError);

// Apply general rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        error: 'Too many requests, please try again later',
        retryAfter: '15 minutes'
    }
});

// Specific stricter rate limit for contact form
const contactFormLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // limit each IP to 5 contact form submissions per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many contact form submissions, please try again later',
        retryAfter: '1 hour'
    }
});

// Apply the general rate limiting middleware to API routes
app.use('/api', apiLimiter);

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Website Technology Detector API',
        usage: {
            endpoint: '/api/detect',
            method: 'POST',
            body: { url: 'https://example.com' },
            rateLimit: '100 requests per 15 minutes'
        }
    });
});

// API token generation for frontend and mobile apps
app.get('/api/token', (req, res) => {
    // Identify the platform requesting the token
    const platform = req.headers['x-app-platform'] || 'web';

    // For Android app, verify the app secret
    if (platform === 'android') {
        const appToken = req.headers['x-app-token'];
        if (!appToken || appToken !== process.env.ANDROID_APP_SECRET) {
            return res.status(403).json({
                error: 'Unauthorized application',
                message: 'Invalid app credentials'
            });
        }
    }

    // Generate a token specific to the platform
    const token = AuthMiddleware.generateApiToken(platform);
    res.json({
        token,
        expiresIn: 300, // 5 minutes in seconds
        issuedAt: new Date().toISOString(),
        oneTimeUse: true
    });
});

// Website technology detection endpoint
app.post('/api/detect', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Validate URL format
        try {
            new URL(url.startsWith('http') ? url : `https://${url}`);
        } catch (e) {
            return res.status(400).json({
                error: 'Invalid URL format',
                message: 'Please provide a valid URL (e.g., example.com or https://example.com)'
            });
        }

        try {
            const technologies = await detectTechnologies(url);
            return res.json(technologies);
        } catch (error) {
            // Only log the error message without the stack trace
            console.log(`Error analyzing ${url}: ${error.message}`);

            // Handle specific error types
            if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo') ||
                error.message.includes('Website not found')) {
                return res.status(404).json({
                    error: 'Website not found',
                    message: 'The domain could not be resolved. Please check if the URL is correct.'
                });
            } else if (error.message.includes('ETIMEDOUT') || error.message.includes('timeout')) {
                return res.status(408).json({
                    error: 'Request timeout',
                    message: 'The website took too long to respond. It might be down or too slow.'
                });
            } else if (error.message.includes('ECONNREFUSED') || error.message.includes('Connection refused')) {
                return res.status(503).json({
                    error: 'Connection refused',
                    message: 'The website server refused the connection. It might be down or blocking requests.'
                });
            } else if (error.code === 'INVALID_URL' || error.message.includes('Invalid URL')) {
                return res.status(400).json({
                    error: 'Invalid URL',
                    message: 'The URL format is invalid or cannot be processed.'
                });
            } else if (error.response && error.response.status) {
                // Handle HTTP error responses
                const statusCode = error.response.status;
                return res.status(statusCode).json({
                    error: `HTTP Error ${statusCode}`,
                    message: `The website returned an error: ${error.response.statusText || 'Unknown error'}`
                });
            }

            return res.status(500).json({
                error: 'Failed to detect technologies',
                message: 'An error occurred while analyzing the website. Please try again later.'
            });
        }
    } catch (error) {
        // This catch block handles any unexpected errors in the outer try block
        console.error('Unexpected error:', error.message);
        return res.status(500).json({
            error: 'Server error',
            message: 'An unexpected error occurred. Please try again later.'
        });
    }
});

// Contact form endpoint with strict rate limiting
app.post('/api/contact', contactFormLimiter, async (req, res) => {
    try {
        // Check authorization
        if (!req.auth) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const { name, email, subject, message } = req.body;

        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'Name, email, and message are required'
            });
        }

        // Send email using the EmailService
        await emailService.sendContactEmail({
            name,
            email,
            message
        });

        return res.status(200).json({
            success: true,
            message: 'Your message has been sent successfully!'
        });
    } catch (error) {
        console.log(`Error sending contact email: ${error.message}`);

        if (error.message.includes('Missing required fields') ||
            error.message.includes('Invalid email format')) {
            return res.status(400).json({
                error: 'Validation error',
                message: error.message
            });
        }

        return res.status(500).json({
            error: 'Failed to send email',
            message: 'An error occurred while sending your message. Please try again later.'
        });
    }
});

// General error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({
        error: 'Server error',
        message: 'An unexpected error occurred'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});