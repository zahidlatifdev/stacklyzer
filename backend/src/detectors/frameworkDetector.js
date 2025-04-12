const TECH_DEFINITIONS = require('../techDefinitions');

/**
 * Detect frontend frameworks
 * @param {Object} $ - Cheerio instance
 * @param {string} html - Raw HTML content
 * @param {Array} scripts - Array of script URLs
 * @returns {Object} Object containing detections and signals
 */
function detectFrameworks($, html, scripts) {
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
    const combinedScripts = scripts.filter(src => src).join(' ');

    // React detection - look for specific patterns, not just keywords
    const reactPatterns = {
        'data-reactroot': $('[data-reactroot]').length > 0,
        'data-reactid': $('[data-reactid]').length > 0,
        'reactDOM': html.includes('ReactDOM'),
        'createElement': html.includes('React.createElement') || inlineScriptContent.includes('React.createElement'),
        'useState': inlineScriptContent.includes('useState(') || inlineScriptContent.includes('React.useState'),
        'reactPaths': scripts.some(src => src && (
            /\/react(@|-)[\d.]+\//.test(src) ||
            /\/react-dom(@|-)[\d.]+\//.test(src) ||
            /\/(umd|cjs|esm)\/react\./.test(src) ||
            src.endsWith('react.js') ||
            src.endsWith('react.min.js') ||
            src.endsWith('react-dom.js') ||
            src.endsWith('react-dom.min.js')
        ))
    };

    const reactSignalCount = Object.values(reactPatterns).filter(Boolean).length;
    if (reactSignalCount > 0) {
        detections.react = true;
        Object.entries(reactPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('react', `Detected ${pattern}`);
        });
    }

    // Vue detection with version differentiation (Vue 2 vs Vue 3)
    const vuePatterns = {
        'vueInstance': html.includes('new Vue(') || inlineScriptContent.includes('new Vue('),
        'vueCreateApp': html.includes('createApp(') || inlineScriptContent.includes('createApp('),
        'vueDirectives': $('[v-if], [v-for], [v-model], [v-bind], [v-on], [v-show], [v-else]').length > 0,
        'vueInterpolation': html.includes('{{') && html.includes('}}') && !html.includes('{{%'),
        'vueDataAttributes': html.includes('data-v-'),
        'vueConstructor': html.includes('__vue__') || inlineScriptContent.includes('__vue__'),
        'vueVersion': html.match(/vue@[\d.]+/) !== null,
        'vuePaths': scripts.some(src => src && (
            /\/vue(@|-)[\d.]+\//.test(src) ||
            src.endsWith('vue.js') ||
            src.endsWith('vue.min.js') ||
            src.includes('vue-router') ||
            src.includes('vuex')
        ))
    };

    const vueSignalCount = Object.values(vuePatterns).filter(Boolean).length;
    if (vueSignalCount > 0) {
        detections.vue = true;
        Object.entries(vuePatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('vue', `Detected ${pattern}`);
        });

        // Determine Vue version
        if (html.includes('createApp(') || inlineScriptContent.includes('createApp(') ||
            scripts.some(src => src && src.includes('vue@3'))) {
            addSignal('vue', 'Using Vue 3.x');
        } else if (html.includes('new Vue(') || inlineScriptContent.includes('new Vue(') ||
            scripts.some(src => src && src.includes('vue@2'))) {
            addSignal('vue', 'Using Vue 2.x');
        }
    }

    // Angular detection (distinguish between AngularJS and Angular 2+)
    const angularPatterns = {
        'ngApp': $('[ng-app]').length > 0,
        'ngController': $('[ng-controller]').length > 0,
        'ngDirectives': $('[ng-repeat], [ng-if], [ng-show], [ng-hide], [ng-class], [ng-model]').length > 0,
        'angularModule': html.includes('angular.module') || inlineScriptContent.includes('angular.module'),
        'angularPaths': scripts.some(src => src && (
            src.includes('angular.js') ||
            src.includes('angular.min.js') ||
            src.includes('angular-route') ||
            src.includes('angular-resource')
        )),
        'angular2Components': $('[_nghost], [_ngcontent]').length > 0,
        'angularDeclarations': inlineScriptContent.includes('@Component') || inlineScriptContent.includes('@NgModule'),
        'angular2Paths': scripts.some(src => src && (
            src.includes('@angular/') ||
            src.includes('angular2.') ||
            src.includes('zone.js')
        ))
    };

    const angularSignalCount = Object.values(angularPatterns).filter(Boolean).length;
    if (angularSignalCount > 0) {
        detections.angular = true;
        Object.entries(angularPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('angular', `Detected ${pattern}`);
        });

        // Distinguish AngularJS vs Angular 2+
        const isAngular2Plus = angularPatterns.angular2Components ||
            angularPatterns.angularDeclarations ||
            angularPatterns.angular2Paths;
        const isAngularJS = angularPatterns.ngApp ||
            angularPatterns.ngController ||
            angularPatterns.angularModule;

        if (isAngular2Plus && !isAngularJS) {
            addSignal('angular', 'Using Angular 2+ (Modern Angular)');
        } else if (isAngularJS && !isAngular2Plus) {
            addSignal('angular', 'Using AngularJS (Angular 1.x)');
        }
    }

    // Next.js detection with specific patterns
    const nextPatterns = {
        'nextData': html.includes('__NEXT_DATA__'),
        'nextRuntime': html.includes('__NEXT_LOADED_PAGES__') || html.includes('next/dist/'),
        'nextPaths': scripts.some(src => src && (
            src.includes('/_next/') ||
            src.includes('next/dist') ||
            src.includes('next.js') ||
            src.includes('next-client-pages-loader')
        )),
        'nextHeaders': $('meta[name="next-head-count"]').length > 0,
        'nextImage': $('span[data-next-image-wrapper]').length > 0
    };

    const nextSignalCount = Object.values(nextPatterns).filter(Boolean).length;
    if (nextSignalCount > 0) {
        detections.nextjs = true;
        Object.entries(nextPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('nextjs', `Detected ${pattern}`);
        });
    }

    // Nuxt.js detection
    const nuxtPatterns = {
        'nuxtData': html.includes('__NUXT__') || html.includes('window.__NUXT__'),
        'nuxtPaths': scripts.some(src => src && (
            src.includes('/_nuxt/') ||
            src.includes('nuxt.js') ||
            src.includes('nuxt-link')
        )),
        'nuxtAttributes': $('[data-n-head]').length > 0 || $('[data-hid]').length > 0,
        'nuxtMeta': $('meta[data-n-head="ssr"]').length > 0
    };

    const nuxtSignalCount = Object.values(nuxtPatterns).filter(Boolean).length;
    if (nuxtSignalCount > 0) {
        detections.nuxtjs = true;
        Object.entries(nuxtPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('nuxtjs', `Detected ${pattern}`);
        });
    }

    // Svelte detection
    const sveltePatterns = {
        'svelteClass': html.match(/svelte-[\w\d]{6}/) !== null,
        'svelteHydrate': html.includes('__SVELTE') || html.includes('hydrate:'),
        'sveltePaths': scripts.some(src => src && (
            src.includes('svelte') ||
            src.includes('.svelte.') ||
            src.endsWith('.svelte')
        ))
    };

    const svelteSignalCount = Object.values(sveltePatterns).filter(Boolean).length;
    if (svelteSignalCount > 0) {
        detections.svelte = true;
        Object.entries(sveltePatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('svelte', `Detected ${pattern}`);
        });
    }

    // Gatsby detection
    const gatsbyPatterns = {
        'gatsbyRoot': html.includes('___gatsby'),
        'gatsbyLoader': html.includes('window.___webpackCompilationHash'),
        'gatsbyPaths': scripts.some(src => src && (
            src.includes('gatsby-') ||
            src.includes('page-data.json')
        )),
        'gatsbyData': html.includes('window.pageData') || html.includes('window.___chunkMapping')
    };

    const gatsbySignalCount = Object.values(gatsbyPatterns).filter(Boolean).length;
    if (gatsbySignalCount > 0) {
        detections.gatsby = true;
        Object.entries(gatsbyPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('gatsby', `Detected ${pattern}`);
        });
    }

    // Remix detection
    const remixPatterns = {
        'remixContext': html.includes('__remixContext'),
        'remixManifest': html.includes('__remixManifest'),
        'remixRouteModules': html.includes('__remixRouteModules'),
        'remixPaths': scripts.some(src => src && (
            src.includes('remix') ||
            src.includes('routes-module')
        ))
    };

    const remixSignalCount = Object.values(remixPatterns).filter(Boolean).length;
    if (remixSignalCount > 0) {
        detections.remix = true;
        Object.entries(remixPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('remix', `Detected ${pattern}`);
        });
    }

    // Alpine.js detection
    const alpinePatterns = {
        'alpineDirective': $('[x-data], [x-bind], [x-on], [x-show], [x-if], [x-for]').length > 0,
        'alpineScript': scripts.some(src => src && (
            src.includes('alpine.js') ||
            src.includes('alpinejs') ||
            src.includes('cdn.jsdelivr.net/gh/alpinejs')
        )),
        'alpineInit': html.includes('x-data=') || html.includes('$data') || html.includes('Alpine.data')
    };

    const alpineSignalCount = Object.values(alpinePatterns).filter(Boolean).length;
    if (alpineSignalCount > 0) {
        detections.alpine = true;
        Object.entries(alpinePatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('alpine', `Detected ${pattern}`);
        });
    }

    // Preact detection
    const preactPatterns = {
        'preactImport': inlineScriptContent.includes('from "preact"') || inlineScriptContent.includes("from 'preact'"),
        'preactRequire': inlineScriptContent.includes('require("preact")') || inlineScriptContent.includes("require('preact')"),
        'preactPaths': scripts.some(src => src && (
            src.includes('preact.') ||
            src.includes('preact/') ||
            src.includes('preact-') ||
            src.endsWith('preact.js') ||
            src.endsWith('preact.min.js')
        ))
    };

    const preactSignalCount = Object.values(preactPatterns).filter(Boolean).length;
    if (preactSignalCount > 0) {
        detections.preact = true;
        Object.entries(preactPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('preact', `Detected ${pattern}`);
        });
    }

    // Ember.js detection
    const emberPatterns = {
        'emberApp': html.includes('data-ember-app') || html.includes('ember-application'),
        'emberView': html.includes('data-ember-view') || html.includes('ember-view'),
        'emberLoad': html.includes('ember-load'),
        'emberPaths': scripts.some(src => src && (
            src.includes('ember.') ||
            src.includes('ember-') ||
            src.endsWith('ember.js') ||
            src.endsWith('ember.min.js')
        )),
        'emberInit': inlineScriptContent.includes('Ember.Application') || inlineScriptContent.includes('DS.Model')
    };

    const emberSignalCount = Object.values(emberPatterns).filter(Boolean).length;
    if (emberSignalCount > 0) {
        detections.ember = true;
        Object.entries(emberPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('ember', `Detected ${pattern}`);
        });
    }

    // SolidJS detection
    const solidPatterns = {
        'solidPaths': scripts.some(src => src && (
            src.includes('solid-js') ||
            src.includes('solid.') ||
            src.endsWith('solid.js') ||
            src.endsWith('solid.min.js')
        )),
        'solidImport': inlineScriptContent.includes('from "solid-js"') || inlineScriptContent.includes("from 'solid-js'"),
        'solidSignals': inlineScriptContent.includes('createSignal') || inlineScriptContent.includes('createResource') || inlineScriptContent.includes('createStore')
    };

    const solidSignalCount = Object.values(solidPatterns).filter(Boolean).length;
    if (solidSignalCount > 0) {
        detections.solidjs = true;
        Object.entries(solidPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('solidjs', `Detected ${pattern}`);
        });
    }

    // Lit detection
    const litPatterns = {
        'litElement': html.includes('lit-html') || html.includes('lit-element'),
        'litDecorators': inlineScriptContent.includes('@customElement') || inlineScriptContent.includes('@property'),
        'litImports': inlineScriptContent.includes('from "lit"') || inlineScriptContent.includes("from 'lit'"),
        'litPaths': scripts.some(src => src && (
            src.includes('lit-element') ||
            src.includes('lit-html') ||
            src.includes('lit.') ||
            src.includes('lit/')
        ))
    };

    const litSignalCount = Object.values(litPatterns).filter(Boolean).length;
    if (litSignalCount > 0) {
        detections.lit = true;
        Object.entries(litPatterns).forEach(([pattern, detected]) => {
            if (detected) addSignal('lit', `Detected ${pattern}`);
        });
    }

    return { detections, signals };
}

module.exports = detectFrameworks;