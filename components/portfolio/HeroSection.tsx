'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface HeroSectionProps {
    name?: string;
    headline?: string;
    profileImageUrl?: string;
}

export function HeroSection({
    name = "Jasmine Goh",
    headline = "A UX/Product Designer and a critical thinker who focuses on creating digital experiences.",
    profileImageUrl
}: HeroSectionProps) {
    // Container with stagger for word animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15, // Word stagger timing
                delayChildren: 0.2
            }
        }
    };

    // Word animation with blur - OPTIMIZED: fewer elements than letter-by-letter
    const wordVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            filter: 'blur(10px)',
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

    // Content fade up with subtle blur
    const fadeUpVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            filter: 'blur(8px)',
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

    // Line reveal
    const lineVariants = {
        hidden: { scaleX: 0, opacity: 0 },
        visible: {
            scaleX: 1,
            opacity: 1,
            transition: {
                duration: 0.8,
                delay: 0.6,
                ease: [0.33, 1, 0.68, 1] as const
            }
        }
    };

    // Profile image animation
    const imageVariants = {
        hidden: {
            opacity: 0,
            scale: 0.9,
            filter: 'blur(20px)',
        },
        visible: {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            transition: {
                duration: 1.2,
                delay: 0.4,
                ease: [0.33, 1, 0.68, 1] as const
            }
        }
    };

    const nameWords = name.split(' ');

    return (
        <section className="relative min-h-[90vh] flex flex-col justify-center px-6 md:px-12 lg:px-24 py-24 overflow-hidden">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 gradient-warm pointer-events-none" />

            {/* Profile Image - large, overlapping with name (transparent PNG) */}
            {profileImageUrl && (
                <motion.div
                    variants={imageVariants}
                    initial="hidden"
                    animate="visible"
                    className="absolute right-0 top-0 w-[90vw] sm:w-[75vw] md:w-[65vw] lg:w-[60vw] max-w-[900px] h-[95vh] pointer-events-none"
                >
                    <Image
                        src={profileImageUrl}
                        alt="Jasmine Goh"
                        fill
                        className="object-contain object-right-bottom"
                        sizes="(max-width: 640px) 90vw, (max-width: 768px) 75vw, (max-width: 1024px) 65vw, 60vw"
                        priority
                    />
                </motion.div>
            )}

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-5xl"
            >
                {/* Editorial label */}
                <motion.div
                    variants={fadeUpVariants}
                    className="flex items-center gap-4 mb-10"
                >
                    <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">
                        Portfolio
                    </span>
                    <div className="h-px w-16 bg-primary/40" />
                    <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                        2024
                    </span>
                </motion.div>

                {/* Name - Large Editorial Serif with Word-by-Word Blur Animation */}
                <div className="mb-12">
                    <h1 className="font-serif tracking-[-0.04em] leading-[0.85]">
                        {nameWords.map((word, index) => (
                            <span key={index} className="block overflow-hidden">
                                <motion.span
                                    variants={wordVariants}
                                    className="inline-flex text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] will-change-transform"
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

                {/* Decorative gradient line */}
                <motion.div
                    variants={lineVariants}
                    className="decorative-line w-32 mb-10 origin-left"
                />

                {/* Headline */}
                <motion.p
                    variants={fadeUpVariants}
                    className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl text-refined"
                >
                    {headline}
                </motion.p>

                {/* Role badge */}
                <motion.div
                    variants={fadeUpVariants}
                    className="mt-12 flex items-center gap-4"
                >
                    <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-medium tracking-wide text-foreground/80">
                        UX/Product Designer
                    </span>
                    <span className="text-muted-foreground/30">—</span>
                    <span className="text-sm text-muted-foreground tracking-wide">
                        Kuala Lumpur, Malaysia
                    </span>
                </motion.div>
            </motion.div>

            {/* Corner decorative circle - only show if no profile image */}
            {!profileImageUrl && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="absolute bottom-8 right-8 lg:right-24 pointer-events-none"
                >
                    <div className="w-20 h-20 border border-primary/20 rounded-full" />
                </motion.div>
            )}
        </section>
    );
}
