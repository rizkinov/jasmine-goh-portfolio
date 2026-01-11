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

    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="border-t border-border/50 px-6 md:px-12 lg:px-24 py-12"
        >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Copyright */}
                <p className="text-sm text-muted-foreground">
                    © {currentYear} Jasmine Goh. All rights reserved.
                </p>

                {/* Social Links */}
                <div className="flex items-center gap-6">
                    {socialLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            target={link.href.startsWith('http') ? '_blank' : undefined}
                            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        </motion.footer>
    );
}
