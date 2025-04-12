'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiCode, FiDatabase, FiLayers, FiActivity, FiPackage } from 'react-icons/fi';
import SearchBar from './SearchBar';

export default function Hero({ onResultsReceived }) {
    return (
        <div className="relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30" />

            {/* Animated floating elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                {/* Tech icons that float */}
                <motion.div
                    className="absolute top-1/4 right-[10%] text-[var(--primary)]/5 dark:text-[var(--primary)]/5"
                    animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                >
                    <FiCode size={80} />
                </motion.div>

                <motion.div
                    className="absolute bottom-1/4 left-[15%] text-[var(--primary)]/5 dark:text-[var(--primary)]/5"
                    animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                >
                    <FiDatabase size={60} />
                </motion.div>

                <motion.div
                    className="absolute top-[60%] right-[15%] text-[var(--primary)]/5 dark:text-[var(--primary)]/3"
                    animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                >
                    <FiLayers size={70} />
                </motion.div>

                <motion.div
                    className="absolute top-[30%] left-[10%] text-[var(--primary)]/5 dark:text-[var(--primary)]/3"
                    animate={{ y: [0, 12, 0], rotate: [0, -7, 0] }}
                    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                >
                    <FiActivity size={50} />
                </motion.div>

                <motion.div
                    className="absolute bottom-[20%] right-[25%] text-[var(--primary)]/5 dark:text-[var(--primary)]/5"
                    animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
                >
                    <FiPackage size={40} />
                </motion.div>
            </div>

            <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-4 flex justify-center"
                    >
                        <span className="glass-panel px-4 py-1 rounded-full text-sm font-medium text-[var(--primary)]">
                            Detect technologies with Stacklyzer
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight relative"
                    >
                        Discover What Powers <span className="gradient-text">Any Website</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-2xl mx-auto text-lg md:text-xl text-[var(--muted-foreground)] mb-8 relative"
                    >
                        Instantly identify frameworks, libraries, analytics tools, and other technologies
                        used on any website with our powerful analysis engine.
                    </motion.p>

                    {/* Search bar positioned in the middle */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="max-w-3xl mx-auto mb-10 z-10 relative"
                    >
                        <SearchBar onResultsReceived={onResultsReceived} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-3 mb-14 relative"
                    >
                        {["Frameworks", "Libraries", "Analytics", "CMS", "Server-Side", "E-commerce",
                            "Build Tools", "And more..."].map((item, index) => (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.4 + (index * 0.05) }}
                                    className="tech-badge bg-[var(--secondary)]/80 text-[var(--secondary-foreground)]"
                                >
                                    {item}
                                </motion.div>
                            ))}
                    </motion.div>
                </div>

                {/* Code example snippet */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="max-w-lg mx-auto glass-panel rounded-lg shadow-xl overflow-hidden relative"
                >
                    <div className="bg-[var(--secondary)]/30 px-4 py-2 flex items-center">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="ml-4 text-xs font-mono opacity-70">website-technologies.js</div>
                    </div>
                    <div className="font-mono text-xs md:text-sm p-4 text-left overflow-x-auto">
                        <div><span className="text-blue-600 dark:text-blue-400">const</span> <span className="text-green-600 dark:text-green-400">result</span> = <span className="text-purple-600 dark:text-purple-400">await</span> stacklyzer.analyze(<span className="text-orange-600 dark:text-orange-400">"example.com"</span>);</div>
                        <div className="opacity-50">// Get a detailed breakdown of technologies</div>
                        <div><span className="text-blue-600 dark:text-blue-400">console</span>.log(result.<span className="text-green-600 dark:text-green-400">technologies</span>);</div>
                        <div className="text-[var(--muted-foreground)]">{'{'} </div>
                        <div className="text-[var(--muted-foreground)] ml-4"><span className="text-green-600 dark:text-green-400">frameworks</span>: [<span className="text-orange-600 dark:text-orange-400">"React"</span>, <span className="text-orange-600 dark:text-orange-400">"Next.js"</span>],</div>
                        <div className="text-[var(--muted-foreground)] ml-4"><span className="text-green-600 dark:text-green-400">libraries</span>: [<span className="text-orange-600 dark:text-orange-400">"Tailwind CSS"</span>, <span className="text-orange-600 dark:text-orange-400">"Framer Motion"</span>],</div>
                        <div className="text-[var(--muted-foreground)] ml-4"><span className="text-green-600 dark:text-green-400">analytics</span>: [<span className="text-orange-600 dark:text-orange-400">"Google Analytics"</span>],</div>
                        <div className="text-[var(--muted-foreground)]">{'}'}</div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}