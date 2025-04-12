const TECH_DEFINITIONS = require('../techDefinitions');

/**
 * Detect analytics and marketing tools
 * @param {Object} $ - Cheerio instance
 * @param {string} html - Raw HTML content
 * @param {Array} scripts - Array of script URLs
 * @returns {Object} Object containing detections and signals
 */
function detectAnalytics($, html, scripts) {
    const detections = {};
    const signals = {};

    function addSignal(tech, signal) {
        if (!signals[tech]) signals[tech] = [];
        signals[tech].push(signal);
    }

    // Initialize content for regex pattern matching
    const inlineScripts = [];
    $('script:not([src])').each((i, el) => {
        inlineScripts.push($(el).html());
    });
    const inlineScriptContent = inlineScripts.join(' ');

    // Google Analytics detection - distinguish between GA4 and Universal Analytics
    const gaPatterns = {
        'gaScript': scripts.some(src => src && (
            src.includes('google-analytics.com/analytics.js') ||
            src.includes('google-analytics.com/ga.js')
        )),
        'ga4Script': scripts.some(src => src && src.includes('googletagmanager.com/gtag/js')),
        'gaVars': html.includes('GoogleAnalyticsObject') || inlineScriptContent.includes('GoogleAnalyticsObject'),
        'gaFunctions': inlineScriptContent.includes('ga(') || inlineScriptContent.includes('_gaq.push('),
        'gtagFunctions': inlineScriptContent.includes('gtag(') || html.includes('gtag('),
        'gaId': (html.match(/UA-\d{4,10}-\d{1,4}/g) || []).length > 0,
        'ga4Id': (html.match(/G-[A-Z0-9]{10}/g) || []).length > 0
    };

    const gaSignalCount = Object.values(gaPatterns).filter(Boolean).length;
    if (gaSignalCount > 0) {
        detections.googleAnalytics = true;
        Object.entries(gaPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('googleAnalytics', `Detected ${pattern}`);
        });

        // Identify GA version
        if (gaPatterns.ga4Script || gaPatterns.gtagFunctions || gaPatterns.ga4Id) {
            addSignal('googleAnalytics', 'Using Google Analytics 4');
        } else if (gaPatterns.gaScript || gaPatterns.gaFunctions || gaPatterns.gaId) {
            addSignal('googleAnalytics', 'Using Universal Analytics (GA3)');
        }
    }

    // Google Tag Manager detection - better validation
    const gtmPatterns = {
        'gtmScript': scripts.some(src => src && src.includes('googletagmanager.com/gtm.js')),
        'gtmIframe': $('iframe[src*="googletagmanager.com/ns.html"]').length > 0,
        'gtmFunctions': inlineScriptContent.includes('dataLayer.push') ||
            inlineScriptContent.includes('dataLayer = dataLayer || []'),
        'gtmId': (html.match(/GTM-[A-Z0-9]{5,7}/g) || []).length > 0
    };

    const gtmSignalCount = Object.values(gtmPatterns).filter(Boolean).length;
    if (gtmSignalCount > 0) {
        detections.googleTagManager = true;
        Object.entries(gtmPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('googleTagManager', `Detected ${pattern}`);
        });
    }

    // Facebook Pixel detection - more precise
    const fbPixelPatterns = {
        'fbPixelScript': scripts.some(src => src && (
            src.includes('connect.facebook.net') ||
            src.includes('fbevents.js')
        )),
        'fbPixelFunctions': inlineScriptContent.includes('fbq(') || html.includes('fbq('),
        'fbPixelInit': inlineScriptContent.includes('fbq("init"') ||
            inlineScriptContent.includes('fbq(\'init\'') ||
            html.includes('fbq("init"'),
        'fbPixelId': (html.match(/\d{15,16}/g) || []).some(id => {
            // Facebook Pixel IDs are 15-16 digits
            return inlineScriptContent.includes(`fbq('init', '${id}'`) ||
                inlineScriptContent.includes(`fbq("init", "${id}"`) ||
                html.includes(`fbq('init', '${id}'`) ||
                html.includes(`fbq("init", "${id}"`);
        })
    };

    const fbPixelSignalCount = Object.values(fbPixelPatterns).filter(Boolean).length;
    if (fbPixelSignalCount > 0) {
        detections.facebookPixel = true;
        Object.entries(fbPixelPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('facebookPixel', `Detected ${pattern}`);
        });
    }

    // Hotjar detection - with ID capture
    const hotjarPatterns = {
        'hjScript': scripts.some(src => src && src.includes('static.hotjar.com')),
        'hjFunctions': inlineScriptContent.includes('hj(') || html.includes('_hjSettings'),
        'hjVars': inlineScriptContent.includes('hjSiteSettings') ||
            inlineScriptContent.includes('hjid') ||
            inlineScriptContent.includes('hjsv'),
        'hjId': (function () {
            const match = html.match(/hjid:(\d+)/) || inlineScriptContent.match(/hjid:(\d+)/);
            return match !== null;
        })()
    };

    const hotjarSignalCount = Object.values(hotjarPatterns).filter(Boolean).length;
    if (hotjarSignalCount > 0) {
        detections.hotjar = true;
        Object.entries(hotjarPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('hotjar', `Detected ${pattern}`);
        });

        // Extract Hotjar ID if available
        const hjIdMatch = html.match(/hjid:(\d+)/) || inlineScriptContent.match(/hjid:(\d+)/);
        if (hjIdMatch && hjIdMatch[1]) {
            addSignal('hotjar', `Hotjar ID: ${hjIdMatch[1]}`);
        }
    }

    // Mixpanel detection - with API validation
    const mixpanelPatterns = {
        'mpScript': scripts.some(src => src && src.includes('cdn.mxpnl.com')),
        'mpFunctions': inlineScriptContent.includes('mixpanel.track') ||
            inlineScriptContent.includes('mixpanel.identify'),
        'mpInit': inlineScriptContent.includes('mixpanel.init'),
        'mpToken': (function () {
            const match = inlineScriptContent.match(/mixpanel\.init\(['"]([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})['"]/) ||
                inlineScriptContent.match(/mixpanel\.init\(['"]([a-f0-9]{32})['"]/) ||
                html.match(/mixpanel\.init\(['"]([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})['"]/) ||
                html.match(/mixpanel\.init\(['"]([a-f0-9]{32})['"]/)
            return match !== null;
        })()
    };

    const mixpanelSignalCount = Object.values(mixpanelPatterns).filter(Boolean).length;
    if (mixpanelSignalCount > 0) {
        detections.mixpanel = true;
        Object.entries(mixpanelPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('mixpanel', `Detected ${pattern}`);
        });
    }

    // Segment detection - better specifics
    const segmentPatterns = {
        'segmentScript': scripts.some(src => src && src.includes('cdn.segment.com')),
        'segmentFunctions': inlineScriptContent.includes('analytics.track') ||
            inlineScriptContent.includes('analytics.identify'),
        'segmentInit': inlineScriptContent.includes('analytics.load'),
        'segmentWriteKey': (function () {
            const match = inlineScriptContent.match(/analytics\.load\(['"]([a-zA-Z0-9]{7,14})['"]/) ||
                html.match(/analytics\.load\(['"]([a-zA-Z0-9]{7,14})['"]/)
            return match !== null;
        })()
    };

    const segmentSignalCount = Object.values(segmentPatterns).filter(Boolean).length;
    if (segmentSignalCount > 0) {
        detections.segment = true;
        Object.entries(segmentPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('segment', `Detected ${pattern}`);
        });
    }

    // Plausible Analytics detection (privacy-focused analytics)
    const plausiblePatterns = {
        'plausibleScript': scripts.some(src => src && (
            src.includes('plausible.io') ||
            src.includes('plausible') && src.endsWith('.js')
        )),
        'plausibleData': $('script[data-domain]').length > 0 &&
            scripts.some(src => src && src.includes('plausible')),
        'plausibleTag': html.includes('plausible') && html.includes('data-domain')
    };

    const plausibleSignalCount = Object.values(plausiblePatterns).filter(Boolean).length;
    if (plausibleSignalCount > 0) {
        detections.plausible = true;
        Object.entries(plausiblePatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('plausible', `Detected ${pattern}`);
        });

        // Extract domain if available
        const plausibleDomain = $('script[data-domain][src*="plausible"]').attr('data-domain');
        if (plausibleDomain) {
            addSignal('plausible', `Tracking domain: ${plausibleDomain}`);
        }
    }

    // Matomo (formerly Piwik) detection
    const matomoPatterns = {
        'matomoScript': scripts.some(src => src && (
            src.includes('matomo.js') ||
            src.includes('piwik.js') ||
            src.includes('matomo.php')
        )),
        'matomoFunctions': inlineScriptContent.includes('_paq.push') || html.includes('_paq.push'),
        'matomoVars': inlineScriptContent.includes('var _paq') || html.includes('var _paq'),
        'matomoUrl': inlineScriptContent.match(/u=(https?:\/\/[^\/]+)/) !== null ||
            html.match(/u=(https?:\/\/[^\/]+)/) !== null
    };

    const matomoSignalCount = Object.values(matomoPatterns).filter(Boolean).length;
    if (matomoSignalCount > 0) {
        detections.matomo = true;
        Object.entries(matomoPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('matomo', `Detected ${pattern}`);
        });
    }

    return { detections, signals };
}

module.exports = detectAnalytics;