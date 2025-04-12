import Link from 'next/link';
import { FiMail, FiShield, FiCode } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const Footer = () => {
    return (
        <footer className="border-t py-8 mt-16 bg-[var(--card)]/50">
            <div className="container mx-auto px-4 text-center pb-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <motion.div
                                initial={{ rotate: -10 }}
                                animate={{ rotate: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-[var(--primary)]"
                            >
                                <FiCode className="h-7 w-7" />
                            </motion.div>
                            <span className="font-bold text-xl sm:inline-block">Stacklyzer</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6">
                        <Link
                            href="/privacy-policy"
                            className="flex items-center text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                        >
                            <FiShield className="mr-1.5 h-4 w-4" />
                            <span>Privacy Policy</span>
                        </Link>
                        <Link
                            href="/contact"
                            className="flex items-center text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                        >
                            <FiMail className="mr-1.5 h-4 w-4" />
                            <span>Contact</span>
                        </Link>
                    </div>
                </div>

                <div className="h-px w-full bg-[var(--border)] my-6"></div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                    <p className="text-sm text-[var(--muted-foreground)]">
                        &copy; {new Date().getFullYear()} Stacklyzer. All rights reserved.
                    </p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                        Made with ❤️ by <a href="https://github.com/zahidlatifdev" className="text-[var(--primary)] hover:underline">Zahid Latif</a>
                    </p>
                </div>
            </div>
        </footer>
    )
}