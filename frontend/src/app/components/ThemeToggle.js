'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const [isHovered, setIsHovered] = useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative p-2 rounded-full bg-[var(--secondary)] hover:bg-opacity-80 transition-colors overflow-hidden"
            aria-label="Toggle theme"
        >
            {/* Sun/Moon icon with animation */}
            <div className="relative z-10">
                {theme === 'dark' ? (
                    <FiSun className="h-5 w-5 text-amber-300" />
                ) : (
                    <FiMoon className="h-5 w-5 text-indigo-500" />
                )}
            </div>

            {/* Animated background */}
            {isHovered && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className={`absolute inset-0 ${theme === 'dark' ? 'bg-amber-300/20' : 'bg-indigo-500/20'}`}
                />
            )}

            {/* Toggle animation */}
            <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="absolute inset-0 flex items-center justify-center opacity-0"
            />
        </motion.button>
    );
}