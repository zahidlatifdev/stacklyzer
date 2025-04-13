# Stacklyzer Backend

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![API Status](https://img.shields.io/badge/API-Active-success.svg)]()
[![Node.js Version](https://img.shields.io/badge/node-18.x-green.svg)]()
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)]()

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

- **Security Features**:

  - Rate limiting to protect the API from abuse
  - Authentication middleware for secure access
  - Platform-specific token generation

- **CORS Support**: Enables cross-origin requests with configurable origins
- **Error Handling**: Comprehensive error handling with user-friendly messages

## 📋 Table of Contents

- [Installation](#-installation)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Response Format](#-response-format)
- [Technology Detection Categories](#-technology-detection-categories)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Stacklyzer Ecosystem](#-stacklyzer-ecosystem)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Installation

Clone this repository:

```bash
git clone https://github.com/zahidlatifdev/stacklyzer.git
cd stacklyzer/backend
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
curl -X POST -H "Content-Type: application/json" -d '{"url":"https://example.com"}' http://localhost:4000/api/detect
```

Example using JavaScript:

```javascript
fetch("http://localhost:4000/api/detect", {
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

### GET /api/token

Generates an authentication token for accessing the API.

**Response Example:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 300,
  "issuedAt": "2025-04-13T12:00:00.000Z",
  "oneTimeUse": true
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

### POST /api/contact

Sends a contact form message to the administrators.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I'd like to know more about..."
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
    "scanTime": "2025-04-13T15:30:45.123Z",
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

## 🌐 Environment Variables

Create a `.env` file in the root of the backend directory with the following variables:

```
PORT=4000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_here
EMAIL_SERVICE=smtp
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=noreply@stacklyzer.com
ANDROID_APP_SECRET=your_android_app_secret
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.js               # Main server file
│   ├── detector.js            # Core technology detection logic
│   ├── techDefinitions.js     # Technology definitions and patterns
│   ├── detectors/             # Specialized detection modules
│   │   ├── analyticsDetector.js
│   │   ├── cmsDetector.js
│   │   ├── frameworkDetector.js
│   │   ├── libraryDetector.js
│   │   └── serverDetector.js
│   ├── middleware/            # Express middleware
│   │   └── authMiddleware.js
│   └── services/              # Additional services
│       └── emailService.js
├── package.json
├── Procfile                   # Heroku deployment configuration
└── README.md
```

## 🌐 Stacklyzer Ecosystem

This backend API is part of the broader Stacklyzer ecosystem:

- **[Backend](/backend)**: Node.js API for detecting website technologies
- **[Frontend](/frontend)**: Next.js web application interface
- **Upcoming Components**:
  - Chrome Extension: For instant technology detection while browsing
  - Android App: Mobile interface for on-the-go website analysis
  - NPM Package: For integrating technology detection in JavaScript projects

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
