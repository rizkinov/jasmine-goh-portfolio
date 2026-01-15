'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export function Footer() {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { name: 'LinkedIn', href: 'https://linkedin.com/in/jasminegoh' },
        { name: 'Dribbble', href: 'https://dribbble.com/jasminegoh' },
        { name: 'Email', href: 'mailto:hello@jasminegoh.com' }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    // Item animation with blur effect
    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            filter: 'blur(12px)',
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.6,
                ease: [0.33, 1, 0.68, 1] as const
            }
        }
    };

    // Background element blur animation
    const bgElementVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            filter: 'blur(20px)',
        },
        visible: {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            transition: {
                duration: 1.2,
                delay: 0.5,
                ease: [0.33, 1, 0.68, 1] as const
            }
        }
    };

    return (
        <motion.footer
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="relative border-t border-border/50 px-6 md:px-12 lg:px-24 py-16 lg:py-20"
        >
            {/* Main footer content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 mb-16">
                {/* Left - Brand */}
                <motion.div variants={itemVariants} className="space-y-4">
                    <Link href="/" className="inline-block">
                        <span className="text-4xl font-serif tracking-tight">
                            JG
                            <span className="text-primary">.</span>
                        </span>
                    </Link>
                    <p className="text-muted-foreground text-refined max-w-xs leading-relaxed">
                        Creating thoughtful digital experiences through user-centered design.
                    </p>
                </motion.div>

                {/* Center - Navigation */}
                <motion.div variants={itemVariants} className="space-y-4">
                    <span className="text-xs font-medium tracking-[0.2em] uppercase text-primary">
                        Navigation
                    </span>
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/#work"
                            className="text-muted-foreground hover:text-foreground transition-colors w-fit"
                        >
                            Work
                        </Link>
                        <Link
                            href="/about"
                            className="text-muted-foreground hover:text-foreground transition-colors w-fit"
                        >
                            About
                        </Link>
                        <Link
                            href="mailto:hello@jasminegoh.com"
                            className="text-muted-foreground hover:text-foreground transition-colors w-fit"
                        >
                            Contact
                        </Link>
                    </div>
                </motion.div>

                {/* Right - Connect */}
                <motion.div variants={itemVariants} className="space-y-4">
                    <span className="text-xs font-medium tracking-[0.2em] uppercase text-primary">
                        Connect
                    </span>
                    <div className="flex flex-col gap-3">
                        {socialLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                target={link.href.startsWith('http') ? '_blank' : undefined}
                                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit"
                            >
                                <span>{link.name}</span>
                                {link.href.startsWith('http') && (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="10"
                                        height="10"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="opacity-0 group-hover:opacity-60 transition-opacity"
                                    >
                                        <path d="M7 17L17 7" />
                                        <path d="M7 7h10v10" />
                                    </svg>
                                )}
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Bottom bar */}
            <motion.div
                variants={itemVariants}
                className="pt-8 border-t border-border/30"
            >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Copyright */}
                    <p className="text-sm text-muted-foreground">
                        <span className="tracking-wide">&copy; {currentYear}</span>
                        <span className="mx-2 text-primary/40">|</span>
                        <span>Jasmine Goh</span>
                    </p>

                    {/* Location & Availability */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                            Kuala Lumpur, Malaysia
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs tracking-wide text-muted-foreground">
                                Available for work
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Background decorative element - very subtle */}
            <motion.div
                variants={bgElementVariants}
                className="absolute bottom-8 right-8 lg:right-24 pointer-events-none hidden lg:block"
            >
                <span className="text-[10rem] font-serif leading-none select-none text-foreground/[0.02]">
                    JG
                </span>
            </motion.div>
        </motion.footer>
    );
}
