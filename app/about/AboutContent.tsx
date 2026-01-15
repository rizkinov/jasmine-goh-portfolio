'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import type { Profile } from '@/types/database';

interface AboutContentProps {
    profile: Profile | null;
}

// Check mobile once (runs on client only)
const getIsMobile = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
};

export function AboutContent({ profile }: AboutContentProps) {
    // Capture mobile state once on first render - never changes to avoid re-render blink
    const isMobileRef = useRef<boolean | null>(null);
    if (isMobileRef.current === null) {
        isMobileRef.current = getIsMobile();
    }
    const isMobile = isMobileRef.current;

    // Fallback data if profile is not loaded
    const name = profile?.name ?? "Jasmine Goh";
    const headline = profile?.headline ?? "A UX/Product Designer and a critical thinker who focuses on creating digital experiences.";
    const bio = profile?.bio ?? "I'm Jasmine, a UX/Product Designer based in Kuala Lumpur, Malaysia. I specialise in bridging the tenets of design thinking, research based data, and user needs to create impactful design solutions.";
    const experience = profile?.experience ?? [];

    // Container animation with stagger
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

    // Blur fade up animation - blur only on desktop
    const blurFadeUpVariants = {
        hidden: {
            opacity: 0,
            y: 40,
            filter: isMobile ? 'blur(0px)' : 'blur(15px)',
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.7,
                ease: [0.33, 1, 0.68, 1] as const
            }
        }
    };

    // Word animation for name - blur only on desktop
    const wordVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            filter: isMobile ? 'blur(0px)' : 'blur(10px)',
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

    // Line reveal animation
    const lineVariants = {
        hidden: { scaleX: 0, opacity: 0 },
        visible: {
            scaleX: 1,
            opacity: 1,
            transition: {
                duration: 1,
                delay: 0.6,
                ease: [0.33, 1, 0.68, 1] as const
            }
        }
    };

    // Card hover animation - blur only on desktop
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            filter: isMobile ? 'blur(0px)' : 'blur(10px)',
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

    const nameWords = name.split(' ');

    return (
        <article className="px-6 md:px-12 lg:px-24 py-20 lg:py-28">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-5xl"
            >
                {/* Editorial Label */}
                <motion.div
                    variants={blurFadeUpVariants}
                    className="flex items-center gap-4 mb-12"
                >
                    <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">
                        About
                    </span>
                    <div className="h-px w-16 bg-primary/40" />
                    <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                        Designer
                    </span>
                </motion.div>

                {/* Name - Large Editorial Serif with Word-by-Word Blur Animation */}
                <div className="mb-10">
                    <h1 className="font-serif tracking-[-0.04em] leading-[0.9]">
                        {nameWords.map((word, index) => (
                            <span key={index} className="block">
                                <motion.span
                                    variants={wordVariants}
                                    className="inline-flex text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
                                    style={{
                                        backfaceVisibility: 'hidden',
                                        WebkitBackfaceVisibility: 'hidden',
                                    }}
                                >
                                    {word}
                                    {index === nameWords.length - 1 && (
                                        <span className="text-primary">.</span>
                                    )}
                                </motion.span>
                            </span>
                        ))}
                    </h1>
                </div>

                {/* Decorative line */}
                <motion.div
                    variants={lineVariants}
                    className="decorative-line w-32 mb-10 origin-left"
                />

                {/* Headline with blur */}
                <motion.p
                    variants={blurFadeUpVariants}
                    className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl text-refined mb-16"
                >
                    {headline}
                </motion.p>

                {/* Profile Section */}
                <div className="grid md:grid-cols-3 gap-12 mb-20">
                    {/* Avatar/Photo placeholder with blur */}
                    <motion.div
                        variants={blurFadeUpVariants}
                        className="md:col-span-1"
                    >
                        <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center overflow-hidden border border-border/50">
                            <span className="text-8xl font-serif text-primary/20 select-none">
                                {name.split(' ').map(n => n[0]).join('')}
                            </span>
                        </div>
                    </motion.div>

                    {/* Bio with blur */}
                    <motion.div
                        variants={blurFadeUpVariants}
                        className="md:col-span-2 space-y-8"
                    >
                        <div>
                            <h2 className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-4">
                                Biography
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed text-refined">
                                {bio}
                            </p>
                        </div>

                        {/* Skills */}
                        <div>
                            <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-4">
                                Expertise
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {['UX Research', 'Product Design', 'UI Design', 'Design Systems', 'Prototyping', 'User Testing'].map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-4 py-2 text-sm font-medium bg-muted/80 text-foreground rounded-full border border-border/50"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Experience Section */}
                {experience.length > 0 && (
                    <motion.div variants={blurFadeUpVariants} className="mb-20">
                        <div className="flex items-center gap-4 mb-10">
                            <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">
                                Experience
                            </span>
                            <div className="h-px flex-1 max-w-20 bg-primary/40" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-10">
                            Career Journey
                        </h2>
                        <div className="space-y-0">
                            {experience.map((exp, index) => (
                                <motion.div
                                    key={index}
                                    variants={cardVariants}
                                    className="flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-border/50 group"
                                >
                                    <div className="flex items-baseline gap-6">
                                        <span className="font-serif text-2xl text-primary/40 group-hover:text-primary transition-colors">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <h3 className="text-xl md:text-2xl font-serif group-hover:text-primary transition-colors">
                                            {exp.company}
                                        </h3>
                                    </div>
                                    <div className="text-muted-foreground mt-2 md:mt-0 ml-14 md:ml-0">
                                        {exp.date}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Values/Approach Section */}
                <motion.div variants={blurFadeUpVariants} className="mb-20">
                    <div className="flex items-center gap-4 mb-10">
                        <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">
                            Philosophy
                        </span>
                        <div className="h-px flex-1 max-w-20 bg-primary/40" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif tracking-tight mb-12">
                        My Approach
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'User-Centered',
                                description: 'Every design decision starts and ends with the user. I believe in deep empathy and understanding user needs.'
                            },
                            {
                                title: 'Data-Driven',
                                description: 'I combine qualitative insights with quantitative data to make informed design decisions.'
                            },
                            {
                                title: 'Collaborative',
                                description: 'Great design comes from great collaboration. I work closely with stakeholders, developers, and users.'
                            }
                        ].map((value, index) => (
                            <motion.div
                                key={index}
                                variants={cardVariants}
                                whileHover={{ y: -8 }}
                                transition={{ duration: 0.3 }}
                                className="p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors group"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="font-serif text-4xl text-primary/30 group-hover:text-primary/60 transition-colors">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                </div>
                                <h3 className="text-xl font-serif mb-3 group-hover:text-primary transition-colors">
                                    {value.title}
                                </h3>
                                <p className="text-muted-foreground text-refined leading-relaxed">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Contact CTA with blur */}
                <motion.div
                    variants={blurFadeUpVariants}
                    className="relative overflow-hidden py-20 px-10 rounded-3xl bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border border-border/50"
                >
                    {/* Decorative background */}
                    <div className="absolute top-4 right-8 pointer-events-none opacity-[0.03]">
                        <span className="text-[12rem] font-serif leading-none select-none text-primary">
                            JG
                        </span>
                    </div>

                    <div className="relative z-10 text-center">
                        <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary mb-6 block">
                            Get in Touch
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight mb-6">
                            Let's work together
                            <span className="text-primary">.</span>
                        </h2>
                        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto text-refined leading-relaxed">
                            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="mailto:hello@jasminegoh.com"
                                className="group relative overflow-hidden px-8 py-3.5 bg-foreground text-background rounded-full font-medium transition-colors"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <span className="tracking-wide">Get in Touch</span>
                                    <motion.svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="opacity-50 group-hover:opacity-100 transition-opacity"
                                    >
                                        <path d="M7 17L17 7" />
                                        <path d="M7 7h10v10" />
                                    </motion.svg>
                                </span>
                            </Link>
                            <Link
                                href="/#work"
                                className="px-8 py-3.5 border border-foreground/20 text-foreground rounded-full font-medium hover:bg-foreground/5 transition-colors tracking-wide"
                            >
                                View My Work
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </article>
    );
}
