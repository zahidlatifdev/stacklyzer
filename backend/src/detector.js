const axios = require('axios');
const cheerio = require('cheerio');
const detectFrameworks = require('./detectors/frameworkDetector');
const detectLibraries = require('./detectors/libraryDetector');
const detectServerSide = require('./detectors/serverDetector');
const detectAnalytics = require('./detectors/analyticsDetector');
const detectCMS = require('./detectors/cmsDetector');
const TECH_DEFINITIONS = require('./techDefinitions');

/**
 * Calculate confidence level based on detection signals
 * @param {number} signalCount - Number of signals detected
 * @returns {string} - Confidence level
 */
function calculateConfidence(signalCount) {
    if (signalCount >= 3) return "High";
    if (signalCount === 2) return "Medium";
    return "Low";
}

/**
 * Enhance the detected technology with descriptions and confidence levels
 * @param {Object} detections - Raw detection results 
 * @param {Object} signals - Signals that led to the detection
 * @returns {Array} - Enhanced technology list with descriptions and confidence
 */
function enhanceDetections(detections, signals = {}) {
    const result = [];

    for (const [techKey, isDetected] of Object.entries(detections)) {
        if (isDetected) {
            const techInfo = TECH_DEFINITIONS[techKey] || {
                name: techKey.charAt(0).toUpperCase() + techKey.slice(1),
                description: "A web technology",
                category: "Other"
            };

            // Get the list of detection signals for this technology
            const techSignals = signals[techKey] || [];
            const confidence = calculateConfidence(techSignals.length);

            result.push({
                id: techKey,
                name: techInfo.name,
                description: techInfo.description,
                category: techInfo.category,
                confidence: confidence,
                website: techInfo.website,
                detectionDetails: techSignals.length > 0 ? techSignals : undefined,
                features: techInfo.features,
                devTools: techInfo.devTools
            });
        }
    }

    return result;
}

/**
 * Detect technologies used by a website
 * @param {string} url - The URL of the website to analyze
 * @returns {Promise<Object>} - Object containing detected technologies with explanations
 */
async function detectTechnologies(url) {
    // Validate URL
    let formattedUrl;
    try {
        // Check if URL is valid
        formattedUrl = url.startsWith('http://') || url.startsWith('https://')
            ? url
            : 'https://' + url;

        // This will throw an error if URL is invalid
        new URL(formattedUrl);
    } catch (error) {
        const err = new Error(`Invalid URL format: ${url}`);
        err.code = 'INVALID_URL';
        throw err;
    }

    try {
        // Fetch the website HTML
        const response = await axios.get(formattedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 15000, // Increased timeout for slower sites
            maxRedirects: 5,  // Limit redirects to prevent infinite loops
            validateStatus: status => status < 500 // Accept any status code less than 500
        });

        // If we received an error status code, handle it
        if (response.status >= 400) {
            const err = new Error(`HTTP Error: ${response.status} ${response.statusText}`);
            err.response = response;
            throw err;
        }

        const html = response.data;

        // Check if we actually got HTML content
        if (typeof html !== 'string') {
            throw new Error('Response is not HTML content');
        }

        const $ = cheerio.load(html);

        // Extract scripts and links
        const scripts = [];
        $('script[src]').each((i, el) => {
            scripts.push($(el).attr('src'));
        });

        const links = [];
        $('link[href]').each((i, el) => {
            links.push({
                href: $(el).attr('href'),
                rel: $(el).attr('rel')
            });
        });

        const metaTags = {};
        $('meta').each((i, el) => {
            const name = $(el).attr('name') || $(el).attr('property');
            if (name) {
                metaTags[name] = $(el).attr('content');
            }
        });

        // Store detection signals for confidence calculation
        const signals = {};

        // Run all detectors
        const { detections: frameworksDetection, signals: frameworksSignals } = detectFrameworks($, html, scripts);
        const { detections: librariesDetection, signals: librariesSignals } = detectLibraries($, html, scripts);
        const { detections: serverDetection, signals: serverSignals } = detectServerSide(response.headers, $, html);
        const { detections: analyticsDetection, signals: analyticsSignals } = detectAnalytics($, html, scripts);
        const { detections: cmsDetection, signals: cmsSignals } = detectCMS($, html, scripts, metaTags);

        // We need to add the additional missing detection functions
        const { detections: miscDetection, signals: miscSignals } = detectMisc($, html, scripts, links, metaTags);
        const { detections: ecommerceDetection, signals: ecommerceSignals } = detectEcommerce($, html);
        const { detections: buildToolsDetection, signals: buildToolsSignals } = detectBuildTools($, html, scripts);

        // Combine all signals
        Object.assign(signals,
            frameworksSignals,
            librariesSignals,
            serverSignals,
            analyticsSignals,
            cmsSignals,
            miscSignals,
            ecommerceSignals,
            buildToolsSignals
        );

        // Enhance the detections with descriptions and additional info
        const enhancedResults = {
            url: url,
            summary: {
                totalTechnologies: 0,
                categories: {}
            },
            technologies: {
                frameworks: enhanceDetections(frameworksDetection, signals),
                libraries: enhanceDetections(librariesDetection, signals),
                serverSide: enhanceDetections(serverDetection, signals),
                analytics: enhanceDetections(analyticsDetection, signals),
                cms: enhanceDetections(cmsDetection, signals),
                ecommerce: enhanceDetections(ecommerceDetection, signals),
                buildTools: enhanceDetections(buildToolsDetection, signals),
                misc: enhanceDetections(miscDetection, signals)
            },
            meta: {
                scanTime: new Date().toISOString(),
                engineVersion: "1.0.0"
            }
        };

        // Calculate summary statistics
        let totalTech = 0;
        const categories = {};

        Object.values(enhancedResults.technologies).forEach(techGroup => {
            totalTech += techGroup.length;

            techGroup.forEach(tech => {
                if (categories[tech.category]) {
                    categories[tech.category]++;
                } else {
                    categories[tech.category] = 1;
                }
            });
        });

        enhancedResults.summary.totalTechnologies = totalTech;
        enhancedResults.summary.categories = categories;

        return enhancedResults;
    } catch (error) {
        // Enhance error message based on error type without including stack traces
        if (error.code === 'ENOTFOUND') {
            throw new Error(`Website not found: ${formattedUrl}`);
        } else if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
            throw new Error(`Request timeout: ${formattedUrl} took too long to respond`);
        } else if (error.code === 'ECONNREFUSED') {
            throw new Error(`Connection refused: ${formattedUrl} is refusing connections`);
        } else if (error.code === 'ECONNRESET') {
            throw new Error(`Connection reset: The connection to ${formattedUrl} was reset`);
        } else if (error.response) {
            throw new Error(`HTTP Error ${error.response.status}: ${error.response.statusText || 'Unknown error'}`);
        } else {
            // Re-throw with just the message
            throw new Error(error.message);
        }
    }
}

/**
 * Detect miscellaneous technologies
 * @param {Object} $ - Cheerio instance
 * @param {string} html - Raw HTML content
 * @param {Array} scripts - Array of script URLs
 * @param {Array} links - Array of link elements
 * @param {Object} metaTags - Object containing meta tags
 * @returns {Object} Object containing detections and signals
 */
function detectMisc($, html, scripts, links, metaTags) {
    const detections = {};
    const signals = {};

    function addSignal(tech, signal) {
        if (!signals[tech]) signals[tech] = [];
        signals[tech].push(signal);
    }

    // PWA detection
    const pwaManifest = links.some(link => link.rel === 'manifest');
    const serviceWorker = html.includes('serviceWorker') ||
        html.includes('navigator.serviceWorker');

    if (pwaManifest || serviceWorker) {
        detections.pwa = true;
        if (pwaManifest) addSignal('pwa', 'Web app manifest detected');
        if (serviceWorker) addSignal('pwa', 'Service worker registration detected');
    }

    // TypeScript detection
    const typeScriptPatterns = scripts.some(src => src && (
        src.includes('.ts') ||
        src.includes('typescript') ||
        html.includes('__extends') ||
        html.includes('__assign') ||
        html.includes('__awaiter')
    ));

    if (typeScriptPatterns) {
        detections.typescript = true;
        addSignal('typescript', 'TypeScript compilation artifacts detected');
    }

    // GraphQL detection
    const graphqlPatterns = html.includes('graphql') ||
        html.includes('ApolloClient') ||
        html.includes('gql`') ||
        scripts.some(src => src && (
            src.includes('graphql') ||
            src.includes('apollo')
        ));

    if (graphqlPatterns) {
        detections.graphql = true;
        addSignal('graphql', 'GraphQL/Apollo client detected');
    }

    // Web3/Blockchain detection
    const web3Patterns = html.includes('web3') ||
        html.includes('ethereum') ||
        html.includes('metamask') ||
        scripts.some(src => src && (
            src.includes('web3') ||
            src.includes('ethers') ||
            src.includes('blockchain')
        ));

    if (web3Patterns) {
        detections.web3 = true;
        addSignal('web3', 'Web3 or blockchain integration detected');
    }

    // WebAssembly detection
    const wasmPatterns = html.includes('WebAssembly') ||
        scripts.some(src => src && (
            src.endsWith('.wasm') ||
            src.includes('wasm')
        ));

    if (wasmPatterns) {
        detections.webassembly = true;
        addSignal('webassembly', 'WebAssembly usage detected');
    }

    // Font Awesome detection
    const fontAwesomePatterns = $('[class*="fa-"]').length > 0 ||
        html.includes('fontawesome') ||
        links.some(link => link.href && (
            link.href.includes('font-awesome') ||
            link.href.includes('fontawesome')
        ));

    if (fontAwesomePatterns) {
        detections.fontAwesome = true;
        addSignal('fontAwesome', 'Font Awesome icons detected');
    }

    return { detections, signals };
}

/**
 * Detect e-commerce platforms
 * @param {Object} $ - Cheerio instance
 * @param {string} html - Raw HTML content
 * @returns {Object} Object containing detections and signals
 */
function detectEcommerce($, html) {
    const detections = {};
    const signals = {};

    function addSignal(tech, signal) {
        if (!signals[tech]) signals[tech] = [];
        signals[tech].push(signal);
    }

    // WooCommerce detection
    const woocommercePatterns = html.includes('woocommerce') ||
        $('[class*="woocommerce"]').length > 0 ||
        html.includes('is-woocommerce');

    if (woocommercePatterns) {
        detections.woocommerce = true;
        addSignal('woocommerce', 'WooCommerce classes or code detected');
    }

    // Magento detection
    const magentoPatterns = html.includes('Magento') ||
        html.includes('Mage.') ||
        $('[data-role="mage-translation"]').length > 0;

    if (magentoPatterns) {
        detections.magento = true;
        addSignal('magento', 'Magento code or elements detected');
    }

    // PrestaShop detection
    const prestashopPatterns = html.includes('prestashop') ||
        $('meta[name="generator"][content*="PrestaShop"]').length > 0;

    if (prestashopPatterns) {
        detections.prestashop = true;
        addSignal('prestashop', 'PrestaShop code or generator tag detected');
    }

    // BigCommerce detection
    const bigcommercePatterns = html.includes('bigcommerce') ||
        html.includes('bc-') ||
        $('link[href*="bigcommerce.com"]').length > 0;

    if (bigcommercePatterns) {
        detections.bigcommerce = true;
        addSignal('bigcommerce', 'BigCommerce code or resources detected');
    }

    // OpenCart detection
    const opencartPatterns = html.includes('opencart') ||
        $('div.opencart').length > 0;

    if (opencartPatterns) {
        detections.opencart = true;
        addSignal('opencart', 'OpenCart code or elements detected');
    }

    return { detections, signals };
}

/**
 * Detect build tools
 * @param {Object} $ - Cheerio instance
 * @param {string} html - Raw HTML content
 * @param {Array} scripts - Array of script URLs
 * @returns {Object} Object containing detections and signals
 */
function detectBuildTools($, html, scripts) {
    const detections = {};
    const signals = {};

    function addSignal(tech, signal) {
        if (!signals[tech]) signals[tech] = [];
        signals[tech].push(signal);
    }

    // Webpack detection
    const webpackPatterns = html.includes('webpackJsonp') ||
        html.includes('__webpack_require__') ||
        scripts.some(src => src && src.includes('webpack'));

    if (webpackPatterns) {
        detections.webpack = true;
        addSignal('webpack', 'Webpack artifacts detected');
    }

    // Vite detection
    const vitePatterns = html.includes('/@vite/') ||
        html.includes('vite-plugin') ||
        scripts.some(src => src && (
            src.includes('/@vite/') ||
            src.includes('/vite/') ||
            src.includes('vite-hmr')
        ));

    if (vitePatterns) {
        detections.vite = true;
        addSignal('vite', 'Vite build tool artifacts detected');
    }

    // Parcel detection
    const parcelPatterns = html.includes('parcelRequire') ||
        scripts.some(src => src && src.includes('parcel'));

    if (parcelPatterns) {
        detections.parcel = true;
        addSignal('parcel', 'Parcel bundler artifacts detected');
    }

    // Babel detection
    const babelPatterns = html.includes('_classCallCheck') ||
        html.includes('_defineProperty') ||
        html.includes('_regeneratorRuntime');

    if (babelPatterns) {
        detections.babel = true;
        addSignal('babel', 'Babel transpiler artifacts detected');
    }

    return { detections, signals };
}

module.exports = {
    detectTechnologies,
    enhanceDetections,
    calculateConfidence
};