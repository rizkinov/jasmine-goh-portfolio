'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAnimationPreferences } from '@/lib/useAnimationPreferences';

export function Navbar() {
    const { shouldSkipAnimations } = useAnimationPreferences();

    // Navbar animation - disabled when shouldSkipAnimations
    const navVariants = {
        hidden: {
            opacity: shouldSkipAnimations ? 1 : 0,
            y: shouldSkipAnimations ? 0 : -20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: shouldSkipAnimations
                ? { duration: 0 }
                : { duration: 0.5, ease: [0.33, 1, 0.68, 1] as const }
        }
    };

    const linkHoverVariants = {
        rest: { width: 0 },
        hover: {
            width: '100%',
            transition: {
                duration: 0.3,
                ease: [0.33, 1, 0.68, 1] as const
            }
        }
    };

    return (
        <motion.header
            initial="hidden"
            animate="visible"
            variants={navVariants}
            className="fixed top-0 left-0 right-0 z-50"
        >
            {/* Backdrop with optimized glassmorphism - reduced blur for performance */}
            <div className="absolute inset-0 bg-background/85 backdrop-blur-md border-b border-border/30" />

            <nav className="relative flex items-center justify-between px-6 md:px-12 lg:px-24 py-5">
                {/* Logo - Editorial serif with blur hover */}
                <Link
                    href="/"
                    className="group flex items-baseline gap-0.5"
                >
                    <motion.span
                        className="text-2xl font-serif tracking-tight text-foreground group-hover:text-primary transition-colors duration-400"
                        whileHover={{ filter: 'blur(0px)' }}
                    >
                        JG
                    </motion.span>
                    <motion.span
                        className="text-2xl text-primary"
                        whileHover={{ scale: 1.3 }}
                        transition={{ duration: 0.25 }}
                    >
                        .
                    </motion.span>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-10">
                    {/* Work Link */}
                    <Link href="/#work" className="group relative">
                        <motion.span
                            initial="rest"
                            whileHover="hover"
                            animate="rest"
                            className="relative block"
                        >
                            <span className="text-sm font-medium tracking-wide text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                                Work
                            </span>
                            <motion.span
                                variants={linkHoverVariants}
                                className="absolute -bottom-1.5 left-0 h-[2px] bg-primary rounded-full"
                            />
                        </motion.span>
                    </Link>

                    {/* About Link */}
                    <Link href="/about" className="group relative">
                        <motion.span
                            initial="rest"
                            whileHover="hover"
                            animate="rest"
                            className="relative block"
                        >
                            <span className="text-sm font-medium tracking-wide text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                                About
                            </span>
                            <motion.span
                                variants={linkHoverVariants}
                                className="absolute -bottom-1.5 left-0 h-[2px] bg-primary rounded-full"
                            />
                        </motion.span>
                    </Link>

                    {/* Contact CTA - refined button with fill animation */}
                    <Link
                        href="mailto:hello@jasminegoh.com"
                        className="group relative overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2 text-sm font-medium px-6 py-2.5 border border-foreground/20 rounded-full text-foreground group-hover:text-background transition-colors duration-400">
                            <span className="tracking-wide">Contact</span>
                            <motion.svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="opacity-50 group-hover:opacity-100 transition-all duration-300"
                                whileHover={{ x: 2, y: -2 }}
                            >
                                <path d="M7 17L17 7" />
                                <path d="M7 7h10v10" />
                            </motion.svg>
                        </span>
                        <motion.span
                            initial={{ x: '-100%' }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] as const }}
                            className="absolute inset-0 bg-foreground rounded-full"
                        />
                    </Link>
                </div>
            </nav>
        </motion.header>
    );
}
