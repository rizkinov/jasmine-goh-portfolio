'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

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
    // Detect if on mobile to disable blur (causes flickering on mobile Safari)
    // Default to false (desktop with blur) - mobile will update after hydration
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Container with stagger for word animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    // Word animation - blur only on desktop
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

    // Content fade up - blur only on desktop
    const fadeUpVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            filter: isMobile ? 'blur(0px)' : 'blur(8px)',
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

    // Profile image animation - blur only on desktop
    const imageVariants = {
        hidden: {
            opacity: 0,
            scale: 0.95,
            filter: isMobile ? 'blur(0px)' : 'blur(15px)',
        },
        visible: {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            transition: {
                duration: 1,
                delay: 0.3,
                ease: [0.33, 1, 0.68, 1] as const
            }
        }
    };

    const nameWords = name.split(' ');

    return (
        <section className="relative min-h-[100svh] md:min-h-[90vh] flex flex-col justify-start md:justify-center px-6 md:px-12 lg:px-24 pt-8 pb-0 md:py-24 overflow-hidden">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 gradient-warm pointer-events-none" />

            {/* Profile Image - Desktop: overlapping editorial style, Mobile: closer to content */}
            {profileImageUrl && (
                <motion.div
                    variants={imageVariants}
                    initial="hidden"
                    animate="visible"
                    className="absolute right-0 top-[35%] sm:top-[30%] md:top-0 w-[100vw] sm:w-[85vw] md:w-[60vw] lg:w-[55vw] max-w-[800px] h-[65vh] sm:h-[70vh] md:h-[90vh] pointer-events-none"
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'translateZ(0)',
                        WebkitTransform: 'translateZ(0)',
                    }}
                >
                    <Image
                        src={profileImageUrl}
                        alt="Jasmine Goh"
                        fill
                        className="object-contain object-bottom md:object-right-bottom"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 85vw, (max-width: 1024px) 60vw, 55vw"
                        priority
                    />
                </motion.div>
            )}

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-5xl"
                style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                }}
            >
                {/* Editorial label */}
                <motion.div
                    variants={fadeUpVariants}
                    className="flex items-center gap-4 mb-6 md:mb-10"
                >
                    <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">
                        Portfolio
                    </span>
                    <div className="h-px w-16 bg-primary/40" />
                    <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                        2026
                    </span>
                </motion.div>

                {/* Name - Large Editorial Serif with Word-by-Word Animation */}
                <div className="mb-6 md:mb-12">
                    <h1 className="font-serif tracking-[-0.04em] leading-[0.85]">
                        {nameWords.map((word, index) => (
                            <span key={index} className="block">
                                <motion.span
                                    variants={wordVariants}
                                    className="inline-flex text-6xl sm:text-7xl md:text-9xl lg:text-[10rem]"
                                    style={{
                                        backfaceVisibility: 'hidden',
                                        WebkitBackfaceVisibility: 'hidden',
                                        transform: 'translateZ(0)',
                                        WebkitTransform: 'translateZ(0)',
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

                {/* Decorative gradient line */}
                <motion.div
                    variants={lineVariants}
                    className="decorative-line w-24 md:w-32 mb-6 md:mb-10 origin-left"
                />

                {/* Headline */}
                <motion.p
                    variants={fadeUpVariants}
                    className="text-base md:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-md md:max-w-2xl text-refined"
                >
                    {headline}
                </motion.p>

                {/* Location badge */}
                <motion.div
                    variants={fadeUpVariants}
                    className="mt-6 md:mt-12 flex items-center gap-2 md:gap-3"
                >
                    <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs md:text-sm text-muted-foreground tracking-wide">
                        Based in Kuala Lumpur, Malaysia
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
