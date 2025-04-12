'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiExternalLink, FiCheck, FiInfo, FiChevronDown, FiChevronUp, FiLink, FiCode, FiDatabase, FiLayers, FiActivity, FiPackage, FiShield } from 'react-icons/fi';

export default function TechResults({ results }) {
    const [expandedCategories, setExpandedCategories] = useState({});

    if (!results) return null;

    const { url, summary, technologies, meta } = results;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const toggleCategory = (category) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const getConfidenceBadgeClasses = (confidence) => {
        const baseClasses = "text-xs font-medium px-2.5 py-0.5 rounded-full";

        if (confidence === 'High') {
            return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300`;
        } else if (confidence === 'Medium') {
            return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300`;
        } else {
            return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-300`;
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'frameworks': return <FiLayers className="h-4 w-4" />;
            case 'libraries': return <FiPackage className="h-4 w-4" />;
            case 'serverSide': return <FiDatabase className="h-4 w-4" />;
            case 'analytics': return <FiActivity className="h-4 w-4" />;
            case 'cms': return <FiCode className="h-4 w-4" />;
            case 'ecommerce': return <FiShield className="h-4 w-4" />;
            case 'buildTools': return <FiCode className="h-4 w-4" />;
            case 'misc': return <FiCode className="h-4 w-4" />;
            default: return <FiCode className="h-4 w-4" />;
        }
    };

    const renderTechCategory = (title, items, category) => {
        if (!items || items.length === 0) return null;

        const isExpanded = expandedCategories[category] !== false; // Default to expanded

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <div
                    className="flex items-center justify-between bg-[var(--card)] shadow-md rounded-lg p-4 cursor-pointer hover-card"
                    onClick={() => toggleCategory(category)}
                >
                    <h3 className="text-lg font-medium flex items-center">
                        <span className="mr-2 p-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                            {getCategoryIcon(category)}
                        </span>
                        {title} <span className="ml-2 text-sm text-[var(--muted-foreground)]">({items.length})</span>
                    </h3>
                    <div className="text-[var(--muted-foreground)]">
                        {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                    </div>
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            key={`${category}-content`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {items.map((tech) => (
                                    <motion.div
                                        key={tech.id}
                                        variants={item}
                                        className="border shadow-sm rounded-lg p-4 bg-[var(--card)]/70 hover-card"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-medium text-[var(--card-foreground)]">{tech.name}</h4>
                                            <div className={getConfidenceBadgeClasses(tech.confidence)}>
                                                {tech.confidence}
                                            </div>
                                        </div>
                                        <p className="text-sm text-[var(--muted-foreground)] mb-3">{tech.description}</p>

                                        {/* Detection details collapsible section */}
                                        {tech.detectionDetails && tech.detectionDetails.length > 0 && (
                                            <div className="mb-3">
                                                <details className="text-xs">
                                                    <summary className="cursor-pointer text-[var(--primary)] hover:underline mb-1">
                                                        Detection signals
                                                    </summary>
                                                    <ul className="ml-4 mt-1 list-disc text-[var(--muted-foreground)] space-y-1">
                                                        {tech.detectionDetails.map((detail, idx) => (
                                                            <li key={idx}>{detail}</li>
                                                        ))}
                                                    </ul>
                                                </details>
                                            </div>
                                        )}

                                        {tech.website && (
                                            <a
                                                href={tech.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-xs text-[var(--primary)] hover:underline mt-2 group"
                                            >
                                                <FiExternalLink className="mr-1 h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                                                Learn more
                                            </a>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    };

    return (
        <div className="mt-12 w-full max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-5 rounded-xl shadow-lg border border-[var(--border)] mb-8"
            >
                <div className="flex items-center gap-2 mb-4">
                    <div className="px-3 py-1 bg-[var(--primary)]/10 rounded-full text-sm font-medium text-[var(--primary)]">
                        Analysis Complete
                    </div>
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--muted)]"></div>
                    <div className="text-sm text-[var(--muted-foreground)]">
                        {new Date().toLocaleString()}
                    </div>
                </div>

                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    Results for <span className="text-[var(--primary)] truncate max-w-[300px]">{url}</span>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    >
                        <FiLink className="h-4 w-4" />
                    </a>
                </h2>

                <div className="p-4 bg-[var(--card)]/80 rounded-lg mb-4 shadow-sm">
                    <h3 className="font-medium mb-2 flex items-center">
                        <FiInfo className="mr-2 h-4 w-4 text-[var(--primary)]" />
                        Technology Summary
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(summary.categories).map(([category, count]) => (
                            <div key={category} className="flex items-center bg-[var(--secondary)]/80 text-[var(--secondary-foreground)] rounded-full px-3 py-1 text-sm shadow-sm">
                                <FiCheck className="mr-1 h-3 w-3 text-[var(--primary)]" />
                                {category}: <span className="font-medium ml-1">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-sm text-[var(--muted-foreground)] flex items-center justify-between">
                    <div className="flex items-center">
                        <FiInfo className="mr-1 h-4 w-4" />
                        Total technologies detected: <span className="font-medium ml-1">{summary.totalTechnologies}</span>
                    </div>
                    <div className="text-xs">
                        {meta?.engineVersion && `Engine v${meta.engineVersion}`}
                    </div>
                </div>
            </motion.div>

            {renderTechCategory('Frameworks', technologies.frameworks, 'frameworks')}
            {renderTechCategory('Libraries', technologies.libraries, 'libraries')}
            {renderTechCategory('Server-Side Technologies', technologies.serverSide, 'serverSide')}
            {renderTechCategory('CMS', technologies.cms, 'cms')}
            {renderTechCategory('Analytics', technologies.analytics, 'analytics')}
            {renderTechCategory('E-commerce', technologies.ecommerce, 'ecommerce')}
            {renderTechCategory('Build Tools', technologies.buildTools, 'buildTools')}
            {renderTechCategory('Other', technologies.misc, 'misc')}
        </div>
    );
}