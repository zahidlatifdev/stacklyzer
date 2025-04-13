# 🔍 Stacklyzer Frontend

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-App_Router-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC)](https://tailwindcss.com/)

> The sleek and intuitive web interface for Stacklyzer, the open-source website technology detector.

## 🌟 Overview

Stacklyzer Frontend is a modern web application built with Next.js that provides a user-friendly interface for detecting technologies used on websites. It connects to the Stacklyzer Backend API and presents detailed, categorized results with an emphasis on user experience and accessibility.

## ✨ Features

- **Clean, Modern UI**: Responsive interface that works on all devices
- **Simple URL Input**: Easy-to-use search interface for entering website URLs
- **Organized Results Display**: Technologies categorized by type with confidence levels
- **Dark/Light Theme**: Support for both dark and light mode preferences
- **Accessibility Focus**: Built with web accessibility best practices
- **Fast Performance**: Optimized for speed with Next.js App Router architecture

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/zahidlatifdev/stacklyzer.git
   cd stacklyzer/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🧩 Project Structure

```
frontend/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js App Router pages and components
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # React context providers (theme, etc.)
│   │   ├── utils/      # Utility functions
│   │   ├── page.js     # Home page component
│   │   └── layout.js   # Root layout component
│   ├── contact/        # Contact page
│   └── privacy-policy/ # Privacy policy page
├── next.config.mjs     # Next.js configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## 🔄 API Integration

The frontend connects to the Stacklyzer Backend API for technology detection. When a user submits a URL:

1. The frontend sends a request to the backend API
2. The backend analyzes the website and returns detected technologies
3. The frontend displays the results in an organized, user-friendly format

## 🎨 UI Components

- **SearchBar**: Main component for URL input and submission
- **TechResults**: Displays detected technologies with categorization
- **ThemeToggle**: Allows switching between light and dark mode
- **Header/Footer**: Navigation and site information

## 🚢 Deployment

The frontend is designed to be deployed on Vercel for optimal performance with Next.js:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel
```

For production deployment:

```bash
vercel --prod
```

## 🤝 Contributing

Contributions to improve the frontend are welcome! Areas for contribution include:

- UI/UX enhancements
- Accessibility improvements
- Performance optimizations
- Additional features or pages
- Bug fixes and code quality improvements

Please see the main [Stacklyzer README](../README.md) for contribution guidelines.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

Made with ❤️ by [Zahid Latif](https://github.com/zahidlatifdev)
