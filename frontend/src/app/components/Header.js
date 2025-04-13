'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCode, FiGithub, FiMenu, FiX, FiLinkedin, FiMail } from 'react-icons/fi';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const navItems = [
        { name: 'Contact', href: '/contact', icon: <FiMail className="h-4 w-4" /> },
        { name: 'LinkedIn', href: 'https://linkedin.com/in/zahidlatifdev', isExternal: true, icon: <FiLinkedin className="h-4 w-4" /> },
        { name: 'GitHub', href: 'https://github.com/zahidlatifdev/stacklyzer', isExternal: true, icon: <FiGithub className="h-4 w-4" /> }
    ];

    const headerVariants = {
        hidden: { y: -20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    return (
        <motion.header
            initial="hidden"
            animate="visible"
            variants={headerVariants}
            className="sticky top-0 z-50 w-full border-b bg-[var(--background)] bg-opacity-80 backdrop-blur-md supports-[backdrop-filter]:bg-opacity-60"
        >
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <motion.div
                            initial={{ rotate: -10 }}
                            animate={{ rotate: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-[var(--primary)]"
                        >
                            <FiCode color='#3b82f6' className="h-7 w-7" />
                        </motion.div>
                        <span className="font-bold text-xl sm:inline-block">Stacklyzer</span>
                    </Link>
                </div>

                {/* Desktop navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navItems.map((item, index) => (
                        item.isExternal ? (
                            <motion.a
                                key={item.name}
                                href={item.href}
                                target="_blank"
                                rel="noreferrer"
                                className="group flex items-center gap-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + (index * 0.1) }}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </motion.a>
                        ) : (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + (index * 0.1) }}
                            >
                                <Link
                                    href={item.href}
                                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1"
                                >
                                    {item.icon && item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            </motion.div>
                        )
                    ))}

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <ThemeToggle />
                    </motion.div>
                </nav>

                {/* Mobile navigation toggle */}
                <div className="flex md:hidden items-center gap-4">
                    <ThemeToggle />
                    <button
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                        className="p-2 text-[var(--foreground)] rounded-full hover:bg-[var(--secondary)] transition-colors"
                    >
                        {isMobileMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden border-t bg-[var(--background)]"
                >
                    <div className="container py-4 flex flex-col gap-3">
                        {navItems.map(item => (
                            <div key={item.name} className="py-2">
                                {item.isExternal ? (
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.icon}
                                        <span>{item.name}</span>
                                    </a>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.icon && item.icon}
                                        <span>{item.name}</span>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.header>
    );
}