'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function Navbar() {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
            className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50"
        >
            <nav className="flex items-center justify-between px-6 md:px-12 lg:px-24 py-4">
                {/* Logo */}
                <Link
                    href="/"
                    className="text-xl font-bold tracking-tight hover:text-primary transition-colors"
                >
                    JG
                    <span className="text-primary">.</span>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-8">
                    <Link
                        href="/#work"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Work
                    </Link>
                    <Link
                        href="/about"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        About
                    </Link>
                    <Link
                        href="mailto:hello@jasminegoh.com"
                        className="text-sm font-medium px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                    >
                        Contact
                    </Link>
                </div>
            </nav>
        </motion.header>
    );
}
