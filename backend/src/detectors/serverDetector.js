const TECH_DEFINITIONS = require('../techDefinitions');

/**
 * Detect server-side technologies
 * @param {Object} headers - HTTP response headers
 * @param {Object} $ - Cheerio instance
 * @param {string} html - Raw HTML content
 * @returns {Object} Object containing detections and signals
 */
function detectServerSide(headers, $, html) {
    const detections = {};
    const signals = {};

    function addSignal(tech, signal) {
        if (!signals[tech]) signals[tech] = [];
        signals[tech].push(signal);
    }

    // Check server header
    if (headers.server) {
        detections.server = headers.server;
        addSignal('server', `Server header: ${headers.server}`);
    }

    // PHP detection
    if (headers['x-powered-by'] && headers['x-powered-by'].toLowerCase().includes('php')) {
        detections.php = true;
        addSignal('php', 'X-Powered-By header contains "PHP"');
    }

    // ASP.NET detection
    if (headers['x-aspnet-version']) {
        detections.aspnet = true;
        addSignal('aspnet', 'X-AspNet-Version header present');
    }
    if (headers['x-powered-by'] && headers['x-powered-by'].toLowerCase().includes('asp.net')) {
        detections.aspnet = true;
        addSignal('aspnet', 'X-Powered-By header contains "ASP.NET"');
    }

    // Express detection
    if (headers['x-powered-by'] && headers['x-powered-by'].toLowerCase().includes('express')) {
        detections.express = true;
        addSignal('express', 'X-Powered-By header contains "Express"');
    }

    // Node.js detection
    if (headers['x-powered-by'] && headers['x-powered-by'].toLowerCase().includes('nodejs')) {
        detections.nodejs = true;
        addSignal('nodejs', 'X-Powered-By header contains "Node.js"');
    }

    // Django detection
    if (headers['x-framework'] && headers['x-framework'].toLowerCase().includes('django')) {
        detections.django = true;
        addSignal('django', 'X-Framework header contains "Django"');
    }

    // Ruby on Rails detection
    if (headers['x-powered-by'] && headers['x-powered-by'].toLowerCase().includes('phusion passenger')) {
        detections.rails = true;
        addSignal('rails', 'X-Powered-By header contains "Phusion Passenger"');
    }

    // Enhanced Laravel detection
    // First check for Laravel-specific cookies
    if (headers['set-cookie']) {
        const cookies = Array.isArray(headers['set-cookie'])
            ? headers['set-cookie']
            : [headers['set-cookie']];

        if (cookies.some(cookie =>
            cookie.includes('laravel_session') ||
            cookie.includes('XSRF-TOKEN')
        )) {
            detections.laravel = true;
            addSignal('laravel', 'Laravel-specific cookies detected');
        }
    }

    // Check for Laravel-specific HTML patterns
    if (html) {
        if (html.includes('csrf-token') && html.includes('Laravel')) {
            detections.laravel = true;
            addSignal('laravel', 'Laravel CSRF token meta tag detected');
        }

        if (html.includes('Illuminate\\') || html.includes('laravel_session')) {
            detections.laravel = true;
            addSignal('laravel', 'Laravel-specific code patterns detected');
        }

        // Check for Laravel debugging or error pages
        if (html.includes('laravel') ||
            html.includes('Whoops!') && html.includes('Illuminate\\') ||
            html.includes('SymfonyDisplayer')) {
            detections.laravel = true;
            addSignal('laravel', 'Laravel error page or debug information detected');
        }

        // Look for Laravel Blade syntax
        if (html.match(/{{\s*\$[\w\d_]+\s*}}/)) {
            detections.laravel = true;
            addSignal('laravel', 'Laravel Blade template syntax detected');
        }

        // Check for Vite with Laravel
        if (html.includes('@vite') || html.includes('vite/assets')) {
            detections.laravel = true;
            addSignal('laravel', 'Laravel Vite integration detected');
        }
    }

    // Check for other HTTP headers that might indicate Laravel
    if (headers['x-vapor-base-path'] || headers['x-vapor-source-version']) {
        detections.laravel = true;
        addSignal('laravel', 'Laravel Vapor headers detected');
    }

    // Cloudflare detection
    if (headers['cf-ray']) {
        detections.cloudflare = true;
        addSignal('cloudflare', 'CF-Ray header present');
    }
    if (headers['server'] === 'cloudflare') {
        detections.cloudflare = true;
        addSignal('cloudflare', 'Server header is "cloudflare"');
    }

    // Vercel detection
    if (headers['x-vercel-id']) {
        detections.vercel = true;
        addSignal('vercel', 'X-Vercel-Id header present');
    }
    if (headers['server'] === 'Vercel') {
        detections.vercel = true;
        addSignal('vercel', 'Server header is "Vercel"');
    }

    // Netlify detection
    if (headers['x-nf-request-id']) {
        detections.netlify = true;
        addSignal('netlify', 'X-Nf-Request-Id header present');
    }
    if (headers['server'] === 'Netlify') {
        detections.netlify = true;
        addSignal('netlify', 'Server header is "Netlify"');
    }

    return { detections, signals };
}

module.exports = detectServerSide;