'use client';

import { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TechResults from './components/TechResults';
import { Footer } from './components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUp } from 'react-icons/fi';

export default function Home() {
  const [results, setResults] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const resultsRef = useRef(null);

  // Function to handle setting results and scrolling
  const handleResultsReceived = (data) => {
    setResults(data);
    // Scroll to results after they're rendered
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Handle scroll-to-top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <main className="flex min-h-screen flex-col">
      <Header />

      <div className="flex-1">
        <Hero onResultsReceived={handleResultsReceived} />

        <div className="container mx-auto px-4 py-8">
          {results && (
            <div ref={resultsRef}>
              <TechResults results={results} />
            </div>
          )}
        </div>
      </div>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg z-40"
            aria-label="Scroll to top"
          >
            <FiArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
