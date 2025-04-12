'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiLoader, FiX, FiAlertCircle } from 'react-icons/fi';
import { detectTechnologies } from '../utils/api';

export default function SearchBar({ onResultsReceived }) {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!url) {
            setError('Please enter a URL');
            return;
        }

        // URL formatting and validation
        let searchUrl = url.trim();

        try {
            // Check if URL has a protocol
            if (!searchUrl.match(/^https?:\/\//i)) {
                // Add https:// as default protocol if none exists
                searchUrl = `https://${searchUrl}`;
            }

            // Create URL object for basic structure validation
            const urlObj = new URL(searchUrl);

            // Validate domain name format with regex
            // This checks for a valid domain name pattern with at least one dot and proper TLD
            const validDomainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/i;

            if (!validDomainRegex.test(urlObj.hostname)) {
                setError('Please enter a valid domain name (e.g., example.com)');
                return;
            }

            // This is a valid URL with proper domain, proceed with the request
            setIsLoading(true);
            setError('');

            try {
                const data = await detectTechnologies(searchUrl);

                if (onResultsReceived) {
                    onResultsReceived(data);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to analyze website. Please try again.');
            } finally {
                setIsLoading(false);
            }
        } catch (err) {
            // This catches any URL parsing errors
            setError('Please enter a valid URL (e.g., example.com or https://example.com)');
        }
    };

    const clearInput = () => {
        setUrl('');
        setError('');
    };

    const popularSites = ['github.com', 'netflix.com', 'airbnb.com', 'spotify.com'];

    return (
        <div className="w-full max-w-3xl mx-auto">
            <motion.form
                onSubmit={handleSearch}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className={`relative rounded-xl transition-all duration-300 ${isFocused ? 'shadow-lg ring-2 ring-[var(--primary)]/20' : 'shadow-md'}`}>
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted-foreground)] h-5 w-5" />
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Enter website URL (e.g. example.com)"
                        className="w-full h-14 pl-10 pr-20 rounded-xl border-0 focus:outline-none bg-[var(--card)] text-[var(--card-foreground)]"
                    />

                    {/* Clear (X) Button */}
                    <AnimatePresence>
                        {url && (
                            <motion.button
                                type="button"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    clearInput();
                                }}
                                className="absolute right-20 inset-y-0 my-auto z-10 flex items-center justify-center text-[var(--muted-foreground)]/70 hover:text-[var(--muted-foreground)] p-1.5 rounded-full hover:bg-[var(--secondary)] transition-colors h-9 w-9"
                            >
                                <FiX className="h-4 w-4 pointer-events-none" />
                            </motion.button>
                        )}
                    </AnimatePresence>


                    {/* Submit (Analyze) Button */}
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={isLoading}
                        className="absolute right-2 inset-y-0 my-auto flex items-center justify-center min-w-[80px] h-9 px-4 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:opacity-90 transition-all disabled:opacity-70 font-medium z-0"
                    >
                        {isLoading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="flex items-center justify-center pointer-events-none"
                            >
                                <FiLoader className="h-5 w-5" />
                            </motion.div>
                        ) : (
                            <span className="pointer-events-none">Analyze</span>
                        )}
                    </motion.button>

                </div>
            </motion.form>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-3 flex items-center text-white text-sm bg-red-500 border border-red-600 p-3 rounded-lg shadow-md"
                    >
                        <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>



            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 flex items-center justify-center flex-wrap gap-2 text-sm text-[var(--muted-foreground)]"
            >
                <span className="text-xs mr-1">Try these:</span>
                <div className="flex flex-wrap gap-2 justify-center">
                    {popularSites.map((site) => (
                        <button
                            key={site}
                            onClick={() => setUrl(site)}
                            className="px-2 py-1 rounded-md hover:bg-[var(--secondary)] transition-colors text-xs hover:text-[var(--foreground)]"
                        >
                            {site}
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}