'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import { FiArrowLeft, FiMail, FiSend, FiLinkedin, FiGithub } from 'react-icons/fi';
import { submitContactForm } from '../utils/api';

export default function Contact() {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Call the API to submit the form
            const response = await submitContactForm(formState);

            if (response.error) {
                setSubmitStatus({
                    success: false,
                    message: response.message || 'There was a problem sending your message. Please try again later.'
                });
            } else {
                setSubmitStatus({
                    success: true,
                    message: 'Your message has been sent successfully! We\'ll get back to you soon.'
                });

                // Reset form on success
                setFormState({
                    name: '',
                    email: '',
                    message: '',
                });
            }
        } catch (error) {
            setSubmitStatus({
                success: false,
                message: 'There was a problem sending your message. Please try again later.'
            });
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

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

                    <h1 className="text-3xl font-bold mb-8">Contact Us</h1>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
                            <p className="mb-6 text-[var(--muted-foreground)]">
                                Have questions or feedback about Stacklyzer? We'd love to hear from you!
                                Fill out the form or reach out to us directly.
                            </p>

                            <div className="space-y-4">
                                <a
                                    href="mailto:zahidlatif.dev@gmail.com"
                                    className="flex items-center gap-3 p-4 bg-[var(--card)] rounded-lg hover-card"
                                >
                                    <div className="p-2 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                                        <FiMail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Email Us</p>
                                        <p className="text-sm text-[var(--muted-foreground)]">zahidlatif.dev@gmail.com</p>
                                    </div>
                                </a>

                                <a
                                    href="https://linkedin.com/in/zahidlatifdev"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 p-4 bg-[var(--card)] rounded-lg hover-card"
                                >
                                    <div className="p-2 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                                        <FiLinkedin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">LinkedIn</p>
                                        <p className="text-sm text-[var(--muted-foreground)]">Connect with Zahid Latif</p>
                                    </div>
                                </a>

                                <a
                                    href="https://github.com/zahidlatifdev/stacklyzer"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 p-4 bg-[var(--card)] rounded-lg hover-card"
                                >
                                    <div className="p-2 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                                        <FiGithub className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">GitHub</p>
                                        <p className="text-sm text-[var(--muted-foreground)]">Check out our repositories</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">Send a Message</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium mb-1 text-[var(--muted-foreground)]"
                                    >
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formState.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 rounded-md border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium mb-1 text-[var(--muted-foreground)]"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formState.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 rounded-md border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-sm font-medium mb-1 text-[var(--muted-foreground)]"
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formState.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        className="w-full p-3 rounded-md border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 transition-colors"
                                    ></textarea>
                                </div>

                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isSubmitting}
                                    className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] py-3 px-6 rounded-md font-medium flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-70"
                                >
                                    {isSubmitting ? (
                                        <>Sending<span className="animate-pulse">...</span></>
                                    ) : (
                                        <>
                                            Send Message <FiSend className="ml-2" />
                                        </>
                                    )}
                                </motion.button>

                                {submitStatus && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-4 rounded-md ${submitStatus.success
                                            ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                                            : 'bg-red-500/20 text-red-500 border border-red-500/30'
                                            }`}
                                    >
                                        {submitStatus.message}
                                    </motion.div>
                                )}
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}