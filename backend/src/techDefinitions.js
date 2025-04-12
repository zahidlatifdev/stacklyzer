// Technology definitions with descriptions and categories
const TECH_DEFINITIONS = {
    // Frameworks
    react: {
        name: "React",
        description: "A JavaScript library for building user interfaces maintained by Facebook and a community of developers",
        category: "Frontend Framework",
        website: "https://reactjs.org",
        devTools: ["React DevTools"]
    },
    vue: {
        name: "Vue.js",
        description: "A progressive JavaScript framework for building user interfaces, designed to be incrementally adoptable",
        category: "Frontend Framework",
        website: "https://vuejs.org",
        devTools: ["Vue DevTools"]
    },
    angular: {
        name: "Angular",
        description: "A platform and framework for building single-page client applications using HTML and TypeScript",
        category: "Frontend Framework",
        website: "https://angular.io",
        devTools: ["Angular DevTools"]
    },
    nextjs: {
        name: "Next.js",
        description: "A React framework for production that enables server-side rendering and static site generation",
        category: "Frontend Framework",
        website: "https://nextjs.org",
        features: ["Server-side rendering", "Static site generation", "API routes"]
    },
    nuxtjs: {
        name: "Nuxt.js",
        description: "A Vue.js framework that offers server-side rendering, static site generation, and more",
        category: "Frontend Framework",
        website: "https://nuxtjs.org",
        features: ["Server-side rendering", "Static site generation", "Auto-routing"]
    },
    svelte: {
        name: "Svelte",
        description: "A radical new approach to building user interfaces that compiles to highly efficient vanilla JavaScript",
        category: "Frontend Framework",
        website: "https://svelte.dev",
        features: ["No virtual DOM", "Truly reactive", "Less code"]
    },
    gatsby: {
        name: "Gatsby",
        description: "A React-based open source framework with performance, scalability and security built-in",
        category: "Frontend Framework",
        website: "https://www.gatsbyjs.com",
        features: ["GraphQL data layer", "Image optimization", "Static site generation"]
    },
    remix: {
        name: "Remix",
        description: "A full stack web framework focused on web standards and modern web app UX",
        category: "Frontend Framework",
        website: "https://remix.run",
        features: ["Nested routing", "Server-side rendering", "Progressive enhancement"]
    },
    alpine: {
        name: "Alpine.js",
        description: "A minimal JavaScript framework for composing behavior directly in your markup",
        category: "Frontend Framework",
        website: "https://alpinejs.dev"
    },
    ember: {
        name: "Ember.js",
        description: "A framework for ambitious web developers that emphasizes convention over configuration",
        category: "Frontend Framework",
        website: "https://emberjs.com"
    },
    preact: {
        name: "Preact",
        description: "A fast 3kB alternative to React with the same modern API",
        category: "Frontend Framework",
        website: "https://preactjs.com"
    },
    solidjs: {
        name: "SolidJS",
        description: "A declarative, efficient, and flexible JavaScript library for building user interfaces",
        category: "Frontend Framework",
        website: "https://www.solidjs.com"
    },
    lit: {
        name: "Lit",
        description: "A simple library for building fast, lightweight web components",
        category: "Web Components",
        website: "https://lit.dev"
    },

    // Libraries
    jquery: {
        name: "jQuery",
        description: "A fast, small, and feature-rich JavaScript library that simplifies HTML document traversal and manipulation",
        category: "JavaScript Library",
        website: "https://jquery.com"
    },
    bootstrap: {
        name: "Bootstrap",
        description: "A popular CSS framework directed at responsive, mobile-first front-end web development",
        category: "UI Framework",
        website: "https://getbootstrap.com"
    },
    lodash: {
        name: "Lodash/Underscore",
        description: "A JavaScript library that provides utility functions for common programming tasks",
        category: "JavaScript Utility Library",
        website: "https://lodash.com"
    },
    tailwind: {
        name: "Tailwind CSS",
        description: "A utility-first CSS framework for rapidly building custom user interfaces",
        category: "CSS Framework",
        website: "https://tailwindcss.com"
    },
    materialUI: {
        name: "Material UI",
        description: "A popular React UI framework implementing Google's Material Design",
        category: "UI Framework",
        website: "https://mui.com"
    },
    antDesign: {
        name: "Ant Design",
        description: "A design system for enterprise-level products with a set of high-quality React components",
        category: "UI Framework",
        website: "https://ant.design"
    },
    chakraUI: {
        name: "Chakra UI",
        description: "A simple, modular and accessible component library for React applications",
        category: "UI Framework",
        website: "https://chakra-ui.com"
    },
    bulma: {
        name: "Bulma",
        description: "A free, open source CSS framework based on Flexbox",
        category: "CSS Framework",
        website: "https://bulma.io"
    },
    foundation: {
        name: "Foundation",
        description: "A responsive front-end framework that makes it easy to design responsive websites",
        category: "CSS Framework",
        website: "https://get.foundation"
    },
    semantic: {
        name: "Semantic UI",
        description: "A development framework that helps create beautiful, responsive layouts using human-friendly HTML",
        category: "UI Framework",
        website: "https://semantic-ui.com"
    },

    // Animation Libraries
    gsap: {
        name: "GSAP (GreenSock Animation Platform)",
        description: "A robust JavaScript animation library for creating high-performance animations",
        category: "Animation Library",
        website: "https://greensock.com/gsap"
    },
    animejs: {
        name: "Anime.js",
        description: "A lightweight JavaScript animation library",
        category: "Animation Library",
        website: "https://animejs.com"
    },
    framerMotion: {
        name: "Framer Motion",
        description: "A production-ready motion library for React",
        category: "Animation Library",
        website: "https://www.framer.com/motion"
    },

    // State Management
    redux: {
        name: "Redux",
        description: "A predictable state container for JavaScript apps",
        category: "State Management",
        website: "https://redux.js.org"
    },
    mobx: {
        name: "MobX",
        description: "A simple, scalable state management library",
        category: "State Management",
        website: "https://mobx.js.org"
    },
    recoil: {
        name: "Recoil",
        description: "A state management library for React applications",
        category: "State Management",
        website: "https://recoiljs.org"
    },
    zustand: {
        name: "Zustand",
        description: "A small, fast and scalable bearbones state-management solution",
        category: "State Management",
        website: "https://zustand-demo.pmnd.rs"
    },

    // Server-side
    php: {
        name: "PHP",
        description: "A popular general-purpose scripting language that is especially suited to web development",
        category: "Backend Language",
        website: "https://www.php.net"
    },
    aspnet: {
        name: "ASP.NET",
        description: "A web framework developed by Microsoft for building modern web apps and services",
        category: "Backend Framework",
        website: "https://dotnet.microsoft.com/apps/aspnet"
    },
    express: {
        name: "Express",
        description: "A minimal and flexible Node.js web application framework that provides a robust set of features",
        category: "Backend Framework",
        website: "https://expressjs.com"
    },
    nodejs: {
        name: "Node.js",
        description: "A JavaScript runtime built on Chrome's V8 JavaScript engine for building scalable network applications",
        category: "Runtime Environment",
        website: "https://nodejs.org"
    },
    django: {
        name: "Django",
        description: "A high-level Python web framework that encourages rapid development and clean, pragmatic design",
        category: "Backend Framework",
        website: "https://www.djangoproject.com"
    },
    rails: {
        name: "Ruby on Rails",
        description: "A web application framework that includes everything needed to create database-backed web apps",
        category: "Backend Framework",
        website: "https://rubyonrails.org"
    },
    laravel: {
        name: "Laravel",
        description: "A PHP web application framework with expressive, elegant syntax",
        category: "Backend Framework",
        website: "https://laravel.com"
    },
    flask: {
        name: "Flask",
        description: "A micro web framework written in Python",
        category: "Backend Framework",
        website: "https://flask.palletsprojects.com"
    },
    fastapi: {
        name: "FastAPI",
        description: "A modern, fast web framework for building APIs with Python",
        category: "Backend Framework",
        website: "https://fastapi.tiangolo.com"
    },
    spring: {
        name: "Spring",
        description: "An application framework and inversion of control container for Java",
        category: "Backend Framework",
        website: "https://spring.io"
    },
    nestjs: {
        name: "NestJS",
        description: "A progressive Node.js framework for building efficient and scalable server-side applications",
        category: "Backend Framework",
        website: "https://nestjs.com"
    },
    cloudflare: {
        name: "Cloudflare",
        description: "A content delivery network, DDoS mitigation, Internet security service, and distributed domain name server",
        category: "Infrastructure & CDN",
        website: "https://www.cloudflare.com"
    },
    vercel: {
        name: "Vercel",
        description: "A platform for frontend frameworks and static sites, providing serverless functions and global CDN",
        category: "Hosting Platform",
        website: "https://vercel.com"
    },
    netlify: {
        name: "Netlify",
        description: "A platform for modern web development, offering CI/CD, serverless functions, and global deployment",
        category: "Hosting Platform",
        website: "https://www.netlify.com"
    },

    // Analytics
    googleAnalytics: {
        name: "Google Analytics",
        description: "A web analytics service offered by Google that tracks and reports website traffic",
        category: "Analytics Tool",
        website: "https://analytics.google.com"
    },
    googleTagManager: {
        name: "Google Tag Manager",
        description: "A tag management system that allows you to quickly update tags and code snippets on your website",
        category: "Tag Management",
        website: "https://tagmanager.google.com"
    },
    facebookPixel: {
        name: "Facebook Pixel",
        description: "An analytics tool that helps you measure the effectiveness of your advertising",
        category: "Analytics Tool",
        website: "https://www.facebook.com/business/tools/meta-pixel"
    },
    hotjar: {
        name: "Hotjar",
        description: "An analytics and feedback tool that reveals user behavior and feedback through heatmaps and recordings",
        category: "User Behavior Analytics",
        website: "https://www.hotjar.com"
    },
    mixpanel: {
        name: "Mixpanel",
        description: "An advanced analytics platform for mobile and web that helps businesses understand user behavior",
        category: "Analytics Tool",
        website: "https://mixpanel.com"
    },
    segment: {
        name: "Segment",
        description: "A customer data platform that helps you collect, clean, and control your customer data",
        category: "Data Integration Platform",
        website: "https://segment.com"
    },
    plausible: {
        name: "Plausible Analytics",
        description: "A lightweight and open-source website analytics tool",
        category: "Analytics Tool",
        website: "https://plausible.io"
    },
    matomo: {
        name: "Matomo",
        description: "An open-source analytics platform formerly known as Piwik",
        category: "Analytics Tool",
        website: "https://matomo.org"
    },

    // CMS
    wordpress: {
        name: "WordPress",
        description: "The world's most popular content management system used by more than 40% of all websites",
        category: "Content Management System",
        website: "https://wordpress.org"
    },
    drupal: {
        name: "Drupal",
        description: "A content management system famous for its flexibility and scalability for complex websites",
        category: "Content Management System",
        website: "https://www.drupal.org"
    },
    joomla: {
        name: "Joomla",
        description: "A free and open-source content management system for publishing web content",
        category: "Content Management System",
        website: "https://www.joomla.org"
    },
    shopify: {
        name: "Shopify",
        description: "An e-commerce platform for online stores and retail point-of-sale systems",
        category: "E-commerce Platform",
        website: "https://www.shopify.com"
    },
    wix: {
        name: "Wix",
        description: "A cloud-based website builder platform for creating HTML5 websites and mobile sites",
        category: "Website Builder",
        website: "https://www.wix.com"
    },
    squarespace: {
        name: "Squarespace",
        description: "An all-in-one website builder and hosting service with designer templates",
        category: "Website Builder",
        website: "https://www.squarespace.com"
    },
    ghost: {
        name: "Ghost",
        description: "A free and open source blogging platform designed to simplify the process of online publishing",
        category: "Content Management System",
        website: "https://ghost.org"
    },
    contentful: {
        name: "Contentful",
        description: "A headless content management system that enables managing content and publishing it to any platform",
        category: "Headless CMS",
        website: "https://www.contentful.com"
    },
    sanity: {
        name: "Sanity",
        description: "A headless CMS platform built with structured content and real-time collaboration",
        category: "Headless CMS",
        website: "https://www.sanity.io"
    },
    strapi: {
        name: "Strapi",
        description: "An open-source headless CMS to easily build customizable APIs",
        category: "Headless CMS",
        website: "https://strapi.io"
    },

    // E-commerce
    woocommerce: {
        name: "WooCommerce",
        description: "A customizable, open-source e-commerce platform built on WordPress",
        category: "E-commerce Platform",
        website: "https://woocommerce.com"
    },
    magento: {
        name: "Magento",
        description: "An open-source e-commerce platform written in PHP for enterprise-level businesses",
        category: "E-commerce Platform",
        website: "https://magento.com"
    },
    bigcommerce: {
        name: "BigCommerce",
        description: "A SaaS e-commerce platform for online stores and retail point-of-sale systems",
        category: "E-commerce Platform",
        website: "https://www.bigcommerce.com"
    },
    prestashop: {
        name: "PrestaShop",
        description: "An efficient and innovative open source e-commerce solution",
        category: "E-commerce Platform",
        website: "https://www.prestashop.com"
    },
    opencart: {
        name: "OpenCart",
        description: "A free and open-source online store management system",
        category: "E-commerce Platform",
        website: "https://www.opencart.com"
    },

    // Build Tools
    webpack: {
        name: "Webpack",
        description: "A static module bundler for modern JavaScript applications",
        category: "Build Tool",
        website: "https://webpack.js.org"
    },
    vite: {
        name: "Vite",
        description: "A build tool that aims to provide a faster and leaner development experience for modern web projects",
        category: "Build Tool",
        website: "https://vitejs.dev"
    },
    parcel: {
        name: "Parcel",
        description: "A zero configuration web application bundler",
        category: "Build Tool",
        website: "https://parceljs.org"
    },
    babel: {
        name: "Babel",
        description: "A JavaScript compiler that converts ECMAScript 2015+ code into backwards-compatible JavaScript",
        category: "Transpiler",
        website: "https://babeljs.io"
    },

    // Misc
    pwa: {
        name: "Progressive Web App",
        description: "A type of application built using web technologies but delivering an app-like experience",
        category: "Web Technology",
        features: ["Offline capability", "Push notifications", "Home screen installation"]
    },
    graphql: {
        name: "GraphQL",
        description: "A query language for APIs and a runtime for executing those queries with your existing data",
        category: "API Technology",
        website: "https://graphql.org"
    },
    web3: {
        name: "Web3/Blockchain",
        description: "Technologies for the decentralized web, including blockchain integration and cryptocurrency features",
        category: "Blockchain Technology"
    },
    webassembly: {
        name: "WebAssembly",
        description: "A binary instruction format for a stack-based virtual machine, enabling high-performance applications on the web",
        category: "Web Technology",
        website: "https://webassembly.org"
    },
    typescript: {
        name: "TypeScript",
        description: "A strongly typed programming language that builds on JavaScript",
        category: "Programming Language",
        website: "https://www.typescriptlang.org"
    },
    serviceWorker: {
        name: "Service Worker",
        description: "A script that browsers run in the background to enable features like offline functionality and push notifications",
        category: "Web Technology",
        features: ["Offline capability", "Background sync", "Push notifications"]
    },
    fontAwesome: {
        name: "Font Awesome",
        description: "A font and icon toolkit based on CSS and LESS",
        category: "Icon Library",
        website: "https://fontawesome.com"
    },
    stripe: {
        name: "Stripe",
        description: "A payment processing platform for online businesses",
        category: "Payment Processor",
        website: "https://stripe.com"
    },
    socketio: {
        name: "Socket.IO",
        description: "A JavaScript library for real-time web applications with bidirectional communication",
        category: "Real-time Communication",
        website: "https://socket.io"
    },
    cloudinary: {
        name: "Cloudinary",
        description: "A cloud-based image and video management service",
        category: "Media Optimization",
        website: "https://cloudinary.com"
    },
    imgix: {
        name: "Imgix",
        description: "A real-time image processing and CDN service",
        category: "Media Optimization",
        website: "https://www.imgix.com"
    },
    auth0: {
        name: "Auth0",
        description: "An authentication and authorization platform",
        category: "Authentication Service",
        website: "https://auth0.com"
    },
    firebase: {
        name: "Firebase",
        description: "A platform for mobile and web application development",
        category: "Development Platform",
        website: "https://firebase.google.com"
    },
    supabase: {
        name: "Supabase",
        description: "An open-source Firebase alternative",
        category: "Development Platform",
        website: "https://supabase.com"
    }
};

module.exports = TECH_DEFINITIONS;