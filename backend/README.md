# Stacklyzer Backend

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![API Status](https://img.shields.io/badge/API-Active-success.svg)]()
[![Node.js Version](https://img.shields.io/badge/node-16.x-green.svg)]()

> 🔍 A powerful API for detecting technologies used on websites. The backend engine for the Stacklyzer ecosystem.

Stacklyzer Backend is a Node.js API that analyzes websites and detects the technologies they use, including frameworks, libraries, CMS platforms, analytics tools, and more. The API provides detailed information about detected technologies along with confidence levels and detection signals.

## 🌟 Features

- **Comprehensive Technology Detection**: Identifies a wide range of web technologies including:

  - Frontend frameworks (React, Vue, Angular, etc.)
  - JavaScript libraries (jQuery, Bootstrap, Lodash, etc.)
  - Server-side technologies (Node.js, PHP, Laravel, etc.)
  - CMS platforms (WordPress, Drupal, Shopify, etc.)
  - Analytics tools (Google Analytics, Hotjar, Facebook Pixel, etc.)
  - E-commerce platforms (WooCommerce, Magento, etc.)
  - Build tools (Webpack, Vite, etc.)
  - PWA capabilities
  - Web3/Blockchain integrations
  - And much more!

- **High Accuracy**: Uses multiple detection patterns for each technology to minimize false positives

- **Confidence Levels**: Provides confidence ratings (Low, Medium, High) based on detection signals

- **Detailed Response**: Returns comprehensive information for each detected technology:

  - Technology name and description
  - Category classification
  - Confidence level
  - Detection signals that led to identification
  - Website URL for the technology
  - Additional features and development tools (when available)

- **Rate Limiting**: Protects the API from abuse with built-in rate limiting

- **CORS Support**: Enables cross-origin requests for web clients

## 📋 Table of Contents

- [Installation](#-installation)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Response Format](#-response-format)
- [Technology Detection Categories](#-technology-detection-categories)
- [Stacklyzer Ecosystem](#-stacklyzer-ecosystem)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Installation

Clone this repository:

```bash
git clone https://github.com/zahidlatifdev/stacklyzer-backend.git
cd stacklyzer-backend
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## 🔧 Usage

Once the server is running, you can make requests to detect technologies on websites:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"url":"https://example.com"}' http://localhost:3000/api/detect
```

Example using JavaScript:

```javascript
fetch("http://localhost:3000/api/detect", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: "https://example.com",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

## 🔌 API Endpoints

### GET /

Returns basic API information and usage instructions.

**Response Example:**

```json
{
  "message": "Website Technology Detector API",
  "usage": {
    "endpoint": "/api/detect",
    "method": "POST",
    "body": { "url": "https://example.com" },
    "rateLimit": "100 requests per 15 minutes"
  }
}
```

### POST /api/detect

Analyzes a website and returns detected technologies.

**Request Body:**

```json
{
  "url": "https://example.com"
}
```

## 📊 Response Format

The API returns a JSON response with detected technologies, organized by category:

```json
{
  "url": "https://example.com",
  "summary": {
    "totalTechnologies": 12,
    "categories": {
      "JavaScript Framework": 1,
      "CSS Framework": 2,
      "JavaScript Library": 3,
      "Analytics": 2,
      "CMS": 1,
      "Server": 1,
      "Other": 2
    }
  },
  "technologies": {
    "frameworks": [
      {
        "id": "react",
        "name": "React",
        "description": "A JavaScript library for building user interfaces",
        "category": "JavaScript Framework",
        "confidence": "High",
        "website": "https://reactjs.org/",
        "detectionDetails": [
          "Detected data-reactroot",
          "Detected reactDOM",
          "Detected reactPaths"
        ],
        "features": ["Component-based architecture", "Virtual DOM", "JSX support"],
        "devTools": ["React DevTools", "Create React App"]
      }
    ],
    "libraries": [...],
    "serverSide": [...],
    "analytics": [...],
    "cms": [...],
    "ecommerce": [...],
    "buildTools": [...],
    "misc": [...]
  },
  "meta": {
    "scanTime": "2025-04-12T15:30:45.123Z",
    "engineVersion": "1.0.0"
  }
}
```

## 🔍 Technology Detection Categories

Stacklyzer detects technologies across multiple categories:

1. **Frameworks**: React, Vue, Angular, Next.js, Nuxt.js, Svelte, etc.
2. **Libraries**: jQuery, Bootstrap, Tailwind CSS, Material UI, GSAP, etc.
3. **Server-Side Technologies**: Node.js, PHP, Laravel, Express, Django, etc.
4. **Analytics Tools**: Google Analytics, Google Tag Manager, Facebook Pixel, Hotjar, etc.
5. **CMS Platforms**: WordPress, Drupal, Joomla, Shopify, Ghost, etc.
6. **E-commerce Platforms**: WooCommerce, Magento, BigCommerce, etc.
7. **Build Tools**: Webpack, Vite, Parcel, Babel, etc.
8. **Miscellaneous**: PWA features, TypeScript, GraphQL, Web3, WebAssembly, etc.

## 🌐 Stacklyzer Ecosystem

This backend API is part of the broader Stacklyzer ecosystem:

- **[Stacklyzer Backend](https://github.com/zahidlatifdev/stacklyzer-backend)**: Node.js api for detecting used technologies
- **[Stacklyzer Frontend](https://github.com/zahidlatifdev/stacklyzer-frontend)**: Web interface for analyzing websites
- **[Stacklyzer Chrome Extension](https://github.com/zahidlatifdev/stacklyzer-chrome-extension)**: Browser extension for instant technology detection
- **[Stacklyzer Android App](https://github.com/zahidlatifdev/stacklyzer-android-app)**: Mobile app for on-the-go website analysis
- **[Stacklyzer NPM Package](https://github.com/zahidlatifdev/stacklyzer)**: NPM package for integrating technology detection in JavaScript projects

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Add or update technology detection patterns
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Areas for Contribution

- Improving detection patterns for existing technologies
- Adding detection for new technologies
- Enhancing documentation
- Adding tests
- Optimizing performance

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💖 Support the Project

Stacklyzer is 100% free and open source. If you find it useful, consider:

- Starring the repository on GitHub
- Sharing the project with others
- Contributing code or documentation
- Reporting issues or suggesting improvements

---

Made with ❤️ by [Zahid Latif](https://github.com/zahidlatifdev)
