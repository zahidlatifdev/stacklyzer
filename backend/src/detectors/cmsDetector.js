const TECH_DEFINITIONS = require('../techDefinitions');

/**
 * Detect CMS platforms
 * @param {Object} $ - Cheerio instance
 * @param {string} html - Raw HTML content
 * @param {Array} scripts - Array of script URLs
 * @param {Object} metaTags - Object containing meta tags from the page
 * @returns {Object} Object containing detections and signals
 */
function detectCMS($, html, scripts, metaTags) {
    const detections = {};
    const signals = {};

    // Initialize content for regex pattern matching
    const inlineScripts = [];
    $('script:not([src])').each((i, el) => {
        inlineScripts.push($(el).html());
    });
    const inlineScriptContent = inlineScripts.join(' ');

    function addSignal(tech, signal) {
        if (!signals[tech]) signals[tech] = [];
        signals[tech].push(signal);
    }

    // WordPress detection - more specific patterns
    const wpPatterns = {
        'wpContent': html.includes('wp-content'),
        'wpIncludes': html.includes('wp-includes'),
        'wpGenerator': $('meta[name="generator"][content*="WordPress"]').length > 0,
        'wpScripts': scripts.some(src => src && (
            src.includes('wp-') ||
            src.includes('/wp-content/') ||
            src.includes('/wp-includes/')
        )),
        'wpFunctions': inlineScriptContent.includes('wp.') ||
            inlineScriptContent.includes('wpApiSettings') ||
            inlineScriptContent.includes('wp_'),
        'wpClasses': $('[class*="wp-"]').length > 0,
        'wpComments': html.includes('<!-- This site is optimized with the Yoast SEO plugin') ||
            html.includes('<!--Cached using WP-Optimize')
    };

    const wpSignalCount = Object.values(wpPatterns).filter(Boolean).length;
    if (wpSignalCount > 0) {
        detections.wordpress = true;
        Object.entries(wpPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('wordpress', `Detected ${pattern}`);
        });

        // Detect WordPress version
        const versionMatch = html.match(/ver=([0-9.]+)/);
        if (versionMatch && versionMatch[1]) {
            addSignal('wordpress', `Possible WordPress version: ${versionMatch[1]}`);
        }

        // Detect popular WordPress themes
        if (html.includes('themes/avada')) {
            addSignal('wordpress', 'Using Avada theme');
        } else if (html.includes('themes/divi')) {
            addSignal('wordpress', 'Using Divi theme');
        } else if (html.includes('themes/astra')) {
            addSignal('wordpress', 'Using Astra theme');
        }

        // Detect popular WordPress plugins
        if (html.includes('plugins/woocommerce')) {
            addSignal('wordpress', 'Using WooCommerce plugin');
        }
        if (html.includes('plugins/elementor')) {
            addSignal('wordpress', 'Using Elementor page builder');
        }
        if (html.includes('plugins/wp-rocket')) {
            addSignal('wordpress', 'Using WP Rocket plugin');
        }
        if (html.includes('plugins/yoast-seo')) {
            addSignal('wordpress', 'Using Yoast SEO plugin');
        }
    }

    // Drupal detection - more specific patterns
    const drupalPatterns = {
        'drupalKeyword': html.includes('drupal'),
        'drupalPath': html.includes('/sites/default/files/'),
        'drupalGenerator': $('meta[name="generator"][content*="Drupal"]').length > 0,
        'drupalBehaviors': inlineScriptContent.includes('Drupal.behaviors') || inlineScriptContent.includes('drupalSettings'),
        'drupalClasses': $('[class*="drupal-"]').length > 0 || $('[class*="js-drupal-"]').length > 0,
        'drupalSettings': inlineScriptContent.includes('drupalSettings') || html.includes('drupalSettings')
    };

    const drupalSignalCount = Object.values(drupalPatterns).filter(Boolean).length;
    if (drupalSignalCount > 0) {
        detections.drupal = true;
        Object.entries(drupalPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('drupal', `Detected ${pattern}`);
        });

        // Detect Drupal version
        const versionMatch = html.match(/Drupal ([0-9.]+)/) ||
            $('meta[name="generator"]').attr('content')?.match(/Drupal ([0-9.]+)/);
        if (versionMatch && versionMatch[1]) {
            addSignal('drupal', `Drupal version: ${versionMatch[1]}`);
        }
    }

    // Joomla detection - more specific patterns
    const joomlaPatterns = {
        'joomlaKeyword': html.includes('joomla'),
        'joomlaPath': html.includes('/media/jui/') || html.includes('/media/system/'),
        'joomlaGenerator': $('meta[name="generator"][content*="Joomla"]').length > 0,
        'joomlaVariable': html.includes('var joomla') || inlineScriptContent.includes('Joomla.'),
        'joomlaClasses': $('[class*="joomla"]').length > 0
    };

    const joomlaSignalCount = Object.values(joomlaPatterns).filter(Boolean).length;
    if (joomlaSignalCount > 0) {
        detections.joomla = true;
        Object.entries(joomlaPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('joomla', `Detected ${pattern}`);
        });

        // Extract Joomla version
        const versionMatch = $('meta[name="generator"]').attr('content')?.match(/Joomla! ([0-9.]+)/);
        if (versionMatch && versionMatch[1]) {
            addSignal('joomla', `Joomla version: ${versionMatch[1]}`);
        }
    }

    // Shopify detection - more specific patterns
    const shopifyPatterns = {
        'shopifyDomain': html.includes('cdn.shopify.com') || html.includes('.myshopify.com'),
        'shopifyVariable': html.includes('Shopify.') || inlineScriptContent.includes('Shopify.'),
        'shopifyGenerator': $('meta[name="generator"][content*="Shopify"]').length > 0,
        'shopifyCheckout': html.includes('/checkout.') && html.includes('shopify'),
        'shopifyApi': inlineScriptContent.includes('shopify.api')
    };

    const shopifySignalCount = Object.values(shopifyPatterns).filter(Boolean).length;
    if (shopifySignalCount > 0) {
        detections.shopify = true;
        Object.entries(shopifyPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('shopify', `Detected ${pattern}`);
        });

        // Extract Shopify shop name
        const shopMatch = html.match(/Shopify.shop\s*=\s*['"]([^'"]+)['"]/);
        if (shopMatch && shopMatch[1]) {
            addSignal('shopify', `Shopify shop name: ${shopMatch[1]}`);
        }
    }

    // Wix detection - more specific patterns
    const wixPatterns = {
        'wixDomain': html.includes('wix.com') || html.includes('wixsite.com'),
        'wixMeta': $('meta[http-equiv="X-Wix-Meta-Site-Id"]').length > 0,
        'wixVariables': html.includes('_wixCssCustom') ||
            html.includes('wixBiSession') ||
            html.includes('wixPerformanceMeasurements'),
        'wixServices': html.includes('static.wixstatic.com') ||
            html.includes('editor.wix.com'),
        'wixIds': html.match(/id="(comp-[a-zA-Z0-9]+)"/) !== null
    };

    const wixSignalCount = Object.values(wixPatterns).filter(Boolean).length;
    if (wixSignalCount > 0) {
        detections.wix = true;
        Object.entries(wixPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('wix', `Detected ${pattern}`);
        });
    }

    // Squarespace detection - more specific patterns
    const squarespacePatterns = {
        'ssKeyword': html.includes('squarespace') || html.includes('squarespace.com'),
        'ssContext': html.includes('Static.SQUARESPACE_CONTEXT') || inlineScriptContent.includes('Static.SQUARESPACE_CONTEXT'),
        'ssClasses': $('[class*="sqs-"]').length > 0,
        'ssScripts': scripts.some(src => src && src.includes('squarespace')),
        'ssGenerator': $('meta[name="generator"][content*="Squarespace"]').length > 0
    };

    const squarespaceSignalCount = Object.values(squarespacePatterns).filter(Boolean).length;
    if (squarespaceSignalCount > 0) {
        detections.squarespace = true;
        Object.entries(squarespacePatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('squarespace', `Detected ${pattern}`);
        });
    }

    // Ghost detection - more specific patterns
    const ghostPatterns = {
        'ghostKeyword': html.includes('ghost') && !html.includes('ghostery'),
        'ghostGenerator': $('meta[name="generator"][content*="Ghost"]').length > 0,
        'ghostData': html.includes('ghost-url') ||
            $('[data-ghost]').length > 0 ||
            $('link[rel="dns-prefetch"][href*="ghost.org"]').length > 0,
        'ghostClasses': $('[class*="gh-"]').length > 0,
        'ghostPost': html.includes('ghost/api/v')
    };

    const ghostSignalCount = Object.values(ghostPatterns).filter(Boolean).length;
    if (ghostSignalCount > 0) {
        detections.ghost = true;
        Object.entries(ghostPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('ghost', `Detected ${pattern}`);
        });
    }

    // Contentful detection (headless CMS)
    const contentfulPatterns = {
        'contentfulKeyword': html.includes('contentful'),
        'contentfulId': metaTags['contentful_id'] !== undefined,
        'contentfulApi': inlineScriptContent.includes('contentful') || inlineScriptContent.includes('CONTENTFUL_'),
        'contentfulSpace': inlineScriptContent.match(/contentful.createClient\(\{\s*space:\s*['"]([^'"]+)/) !== null
    };

    const contentfulSignalCount = Object.values(contentfulPatterns).filter(Boolean).length;
    if (contentfulSignalCount > 0) {
        detections.contentful = true;
        Object.entries(contentfulPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('contentful', `Detected ${pattern}`);
        });
    }

    // Sanity detection (headless CMS)
    const sanityPatterns = {
        'sanityKeyword': html.includes('sanity.io') || html.includes('sanity-content'),
        'sanityId': html.match(/projectId:\s*['"]([^'"]+)['"]/) !== null && html.includes('sanity'),
        'sanityApi': inlineScriptContent.includes('sanityClient') ||
            inlineScriptContent.includes('@sanity/client'),
        'sanityScript': scripts.some(src => src && (src.includes('sanity.io') || src.includes('sanityClient')))
    };

    const sanitySignalCount = Object.values(sanityPatterns).filter(Boolean).length;
    if (sanitySignalCount > 0) {
        detections.sanity = true;
        Object.entries(sanityPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('sanity', `Detected ${pattern}`);
        });
    }

    return { detections, signals };
}

module.exports = detectCMS;