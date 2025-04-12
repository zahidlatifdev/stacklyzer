'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import { FiArrowLeft } from 'react-icons/fi';

export default function PrivacyPolicy() {
    return (
        <main className="flex min-h-screen flex-col">
            <Header />

            <div className="container mx-auto px-4 py-8 flex-1">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mx-auto"
                >
                    <Link href="/" className="inline-flex items-center text-[var(--primary)] hover:underline mb-6">
                        <FiArrowLeft className="mr-2" /> Back to Home
                    </Link>

                    <div className="bg-[var(--card)] rounded-xl shadow-md p-6 md:p-8 mb-8">
                        <h1 className="text-3xl font-bold mb-6 text-[var(--card-foreground)]">Privacy Policy</h1>

                        <div className="space-y-6">
                            <p className="text-[var(--muted-foreground)] text-sm">
                                Last Updated: April 13, 2025
                            </p>

                            <section>
                                <h2 className="text-xl font-semibold mb-3 text-[var(--card-foreground)]">Overview</h2>
                                <p className="text-[var(--card-foreground)] leading-relaxed">
                                    Welcome to Stacklyzer ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal information.
                                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website technology detection service.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3 text-[var(--card-foreground)]">Information We Collect</h2>
                                <p className="text-[var(--card-foreground)] mb-3 leading-relaxed">
                                    We collect information that you provide directly to us when using our services:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-[var(--card-foreground)]">
                                    <li><strong>Website URLs</strong>: When you enter a URL for analysis, we collect and process this URL.</li>
                                    <li><strong>Contact Information</strong>: If you contact us or submit information through our contact form, we collect details such as your name and email address.</li>
                                    <li><strong>Usage Data</strong>: We automatically collect information about how you interact with our services, including IP address, browser type, pages visited, and time spent on the site.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3 text-[var(--card-foreground)]">How We Use Your Information</h2>
                                <p className="text-[var(--card-foreground)] mb-3 leading-relaxed">We use the information we collect to:</p>
                                <ul className="list-disc pl-6 space-y-2 text-[var(--card-foreground)]">
                                    <li>Provide and maintain our services</li>
                                    <li>Improve and optimize our technology detection engine</li>
                                    <li>Respond to your inquiries and provide support</li>
                                    <li>Monitor and analyze usage patterns and trends</li>
                                    <li>Protect against fraudulent or unauthorized activity</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3 text-[var(--card-foreground)]">Information Sharing</h2>
                                <p className="text-[var(--card-foreground)] mb-3 leading-relaxed">
                                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described below:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-[var(--card-foreground)]">
                                    <li><strong>Service Providers</strong>: We may share information with trusted third parties who assist us in operating our services and conducting our business.</li>
                                    <li><strong>Legal Requirements</strong>: We may disclose information if required to do so by law or in response to valid legal requests.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3 text-[var(--card-foreground)]">Data Security</h2>
                                <p className="text-[var(--card-foreground)] leading-relaxed">
                                    We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
                                    However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3 text-[var(--card-foreground)]">Your Rights</h2>
                                <p className="text-[var(--card-foreground)] mb-3 leading-relaxed">Depending on your location, you may have certain rights regarding your personal information, including:</p>
                                <ul className="list-disc pl-6 space-y-2 text-[var(--card-foreground)]">
                                    <li>The right to access the personal information we hold about you</li>
                                    <li>The right to request correction or deletion of your personal information</li>
                                    <li>The right to restrict or object to our processing of your personal information</li>
                                    <li>The right to data portability</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3 text-[var(--card-foreground)]">Cookies and Similar Technologies</h2>
                                <p className="text-[var(--card-foreground)] leading-relaxed">
                                    We use cookies and similar tracking technologies to enhance your experience on our site.
                                    These technologies help us understand how users interact with our services and allow us to remember your preferences.
                                    You can set your browser to refuse all or some browser cookies or to alert you when websites set or access cookies.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3 text-[var(--card-foreground)]">Changes to This Policy</h2>
                                <p className="text-[var(--card-foreground)] leading-relaxed">
                                    We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.
                                    We will notify you of any material changes by posting the updated policy on this page with a revised "Last Updated" date.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold mb-3 text-[var(--card-foreground)]">Contact Us</h2>
                                <p className="text-[var(--card-foreground)] leading-relaxed">
                                    If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us at:
                                    <a href="mailto:zahidlatif.dev@gmail.com" className="text-[var(--primary)] hover:underline ml-1">
                                        zahidlatif.dev@gmail.com
                                    </a>
                                </p>
                            </section>
                        </div>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}