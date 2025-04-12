const TECH_DEFINITIONS = require('../techDefinitions');

/**
 * Detect JavaScript libraries
 * @param {Object} $ - Cheerio instance
 * @param {string} html - Raw HTML content
 * @param {Array} scripts - Array of script URLs
 * @returns {Object} Object containing detections and signals
 */
function detectLibraries($, html, scripts) {
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

    // jQuery detection
    const jQueryPatterns = {
        'jqueryVariable': html.includes('jQuery') || inlineScriptContent.includes('jQuery'),
        'jqueryDollar': html.includes('$(') || inlineScriptContent.includes('$('),
        'jqueryImport': scripts.some(src => src && (
            /jquery(@|-)[\d.]+/.test(src) ||
            src.endsWith('jquery.js') ||
            src.endsWith('jquery.min.js') ||
            src.includes('/jquery/')
        )),
        'jqueryPlugins': scripts.some(src => src && (
            src.includes('jquery.') ||
            src.includes('.jquery.')
        ))
    };

    const jquerySignalCount = Object.values(jQueryPatterns).filter(Boolean).length;
    if (jquerySignalCount > 0) {
        detections.jquery = true;
        Object.entries(jQueryPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('jquery', `Detected ${pattern}`);
        });
    }

    // Bootstrap detection
    const bootstrapPatterns = {
        'bootstrapClasses': $('[class*="navbar-"], [class*="btn-"], [class*="modal-"], [class*="carousel-"], [class*="collapse"]').length > 0,
        'bootstrapAttributes': $('[data-bs-toggle], [data-toggle="tooltip"], [data-toggle="modal"]').length > 0,
        'bootstrapStrings': html.includes('bootstrap') || inlineScriptContent.includes('bootstrap'),
        'bootstrapImport': scripts.some(src => src && (
            /bootstrap(@|-)[\d.]+/.test(src) ||
            src.endsWith('bootstrap.js') ||
            src.endsWith('bootstrap.min.js') ||
            src.includes('/bootstrap/')
        ))
    };

    const bootstrapSignalCount = Object.values(bootstrapPatterns).filter(Boolean).length;
    if (bootstrapSignalCount > 0) {
        detections.bootstrap = true;
        Object.entries(bootstrapPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('bootstrap', `Detected ${pattern}`);
        });
    }

    // Lodash/underscore detection
    const lodashPatterns = {
        'lodashVariable': html.includes('_.') || inlineScriptContent.includes('_.'),
        'lodashImport': scripts.some(src => src && (
            src.includes('lodash') ||
            src.includes('underscore')
        )),
        'lodashFunctions': inlineScriptContent.includes('_.map(') ||
            inlineScriptContent.includes('_.filter(') ||
            inlineScriptContent.includes('_.debounce(')
    };

    const lodashSignalCount = Object.values(lodashPatterns).filter(Boolean).length;
    if (lodashSignalCount > 0) {
        detections.lodash = true;
        Object.entries(lodashPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('lodash', `Detected ${pattern}`);
        });
    }

    // Tailwind CSS detection - more precise pattern matching
    const tailwindPatterns = {
        'tailwindUtilities': $('[class*="text-"], [class*="bg-"], [class*="flex"], [class*="grid"], [class*="p-"], [class*="m-"], [class*="rounded-"]').length > 5,
        'tailwindPrefix': $('[class*="tw-"]').length > 0,
        'tailwindDarkMode': $('html').attr('class')?.includes('dark:') || html.includes('dark:'),
        'tailwindImport': scripts.some(src => src && src.includes('tailwind')),
        'tailwindConfig': html.includes('tailwind.config') || inlineScriptContent.includes('tailwind.config')
    };

    const tailwindSignalCount = Object.values(tailwindPatterns).filter(Boolean).length;
    if (tailwindSignalCount > 0) {
        detections.tailwind = true;
        Object.entries(tailwindPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('tailwind', `Detected ${pattern}`);
        });
    }

    // Material UI detection - better specificity
    const materialUIPatterns = {
        'muiClasses': $('[class*="MuiButton"], [class*="MuiTypography"], [class*="MuiBox"], [class*="MuiContainer"]').length > 0,
        'muiAttributes': $('[data-mui-color-scheme]').length > 0,
        'muiStrings': html.includes('material-ui') || html.includes('@mui/') || inlineScriptContent.includes('@mui/'),
        'muiImport': scripts.some(src => src && (
            src.includes('material-ui') ||
            src.includes('@mui/') ||
            src.includes('/mui.') ||
            src.includes('mui/')
        ))
    };

    const materialUISignalCount = Object.values(materialUIPatterns).filter(Boolean).length;
    if (materialUISignalCount > 0) {
        detections.materialUI = true;
        Object.entries(materialUIPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('materialUI', `Detected ${pattern}`);
        });
    }

    // Ant Design detection - more accurate class detection
    const antDesignPatterns = {
        'antClasses': $('[class*="ant-btn"], [class*="ant-input"], [class*="ant-layout"], [class*="ant-menu"], [class*="ant-form"]').length > 0,
        'antPrefix': $('[class^="ant-"]').length > 0,
        'antConfig': html.includes('antd') || inlineScriptContent.includes('antd'),
        'antImport': scripts.some(src => src && (
            src.includes('antd') ||
            src.includes('@ant-design/')
        ))
    };

    const antDesignSignalCount = Object.values(antDesignPatterns).filter(Boolean).length;
    if (antDesignSignalCount > 0) {
        detections.antDesign = true;
        Object.entries(antDesignPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('antDesign', `Detected ${pattern}`);
        });
    }

    // Chakra UI detection
    const chakraPatterns = {
        'chakraClasses': $('[class*="chakra-"], [data-chakra-component]').length > 0,
        'chakraProviders': html.includes('ChakraProvider') || inlineScriptContent.includes('ChakraProvider'),
        'chakraImport': scripts.some(src => src && (
            src.includes('@chakra-ui/') ||
            src.includes('chakra-ui')
        ))
    };

    const chakraSignalCount = Object.values(chakraPatterns).filter(Boolean).length;
    if (chakraSignalCount > 0) {
        detections.chakraUI = true;
        Object.entries(chakraPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('chakraUI', `Detected ${pattern}`);
        });
    }

    // GSAP (GreenSock) detection
    const gsapPatterns = {
        'gsapImport': scripts.some(src => src && (
            src.includes('gsap') ||
            src.includes('greensock') ||
            src.includes('TweenMax')
        )),
        'gsapVars': inlineScriptContent.includes('gsap.') ||
            inlineScriptContent.includes('TweenMax.') ||
            inlineScriptContent.includes('TimelineMax.')
    };

    const gsapSignalCount = Object.values(gsapPatterns).filter(Boolean).length;
    if (gsapSignalCount > 0) {
        detections.gsap = true;
        Object.entries(gsapPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('gsap', `Detected ${pattern}`);
        });
    }

    // Redux detection
    const reduxPatterns = {
        'reduxImport': scripts.some(src => src && (
            src.includes('redux') ||
            src.includes('react-redux')
        )),
        'reduxHooks': inlineScriptContent.includes('useSelector') ||
            inlineScriptContent.includes('useDispatch'),
        'reduxFunctions': inlineScriptContent.includes('createStore') ||
            inlineScriptContent.includes('combineReducers')
    };

    const reduxSignalCount = Object.values(reduxPatterns).filter(Boolean).length;
    if (reduxSignalCount > 0) {
        detections.redux = true;
        Object.entries(reduxPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('redux', `Detected ${pattern}`);
        });
    }

    return { detections, signals };
}

module.exports = detectLibraries;