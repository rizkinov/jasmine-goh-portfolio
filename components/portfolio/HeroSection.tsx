'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAnimationPreferences } from '@/lib/useAnimationPreferences';

// Sticky note data - positioned on right side, lower down
// Mobile positions (top) are different to avoid covering text
const stickyNotes = [
    { id: 1, text: 'hello 👋', color: 'bg-amber-100', rotation: -6, top: '35%', topMobile: '68%', right: '65%' },
    { id: 2, text: 'scroll down', color: 'bg-pink-100', rotation: 4, top: '55%', topMobile: '76%', right: '50%' },
    { id: 3, text: 'to explore more', color: 'bg-sky-100', rotation: -3, top: '70%', topMobile: '84%', right: '12%' },
];

interface HeroSectionProps {
    name?: string;
    headline?: string;
    profileImageUrl?: string;
}

export function HeroSection({
    name = "Jasmine Goh",
    headline = "Creating thoughtful digital experiences through user-centered design.",
    profileImageUrl
}: HeroSectionProps) {
    const { shouldSkipAnimations, prefersReducedMotion, isMobile } = useAnimationPreferences();
    const constraintsRef = useRef<HTMLDivElement>(null);
    const [dragOffsets, setDragOffsets] = useState<Record<number, { x: number; y: number }>>({});

    // Container with stagger for word animation
    const containerVariants = {
        hidden: { opacity: shouldSkipAnimations ? 1 : 0 },
        visible: {
            opacity: 1,
            transition: shouldSkipAnimations
                ? { duration: 0 }
                : { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    // Word animation - disabled when shouldSkipAnimations
    const wordVariants = {
        hidden: {
            opacity: shouldSkipAnimations ? 1 : 0,
            y: shouldSkipAnimations ? 0 : 50,
            filter: 'blur(0px)',
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: shouldSkipAnimations
                ? { duration: 0 }
                : { duration: 0.6, ease: [0.33, 1, 0.68, 1] as const }
        }
    };

    // Content fade up - disabled when shouldSkipAnimations
    const fadeUpVariants = {
        hidden: {
            opacity: shouldSkipAnimations ? 1 : 0,
            y: shouldSkipAnimations ? 0 : 30,
            filter: 'blur(0px)',
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: shouldSkipAnimations
                ? { duration: 0 }
                : { duration: 0.6, ease: [0.33, 1, 0.68, 1] as const }
        }
    };

    // Line reveal - disabled when shouldSkipAnimations
    const lineVariants = {
        hidden: {
            scaleX: shouldSkipAnimations ? 1 : 0,
            opacity: shouldSkipAnimations ? 1 : 0
        },
        visible: {
            scaleX: 1,
            opacity: 1,
            transition: shouldSkipAnimations
                ? { duration: 0 }
                : { duration: 0.8, delay: 0.6, ease: [0.33, 1, 0.68, 1] as const }
        }
    };

    // Profile image animation - disabled when shouldSkipAnimations
    const imageVariants = {
        hidden: {
            opacity: shouldSkipAnimations ? 1 : 0,
            scale: shouldSkipAnimations ? 1 : 0.95,
            filter: 'blur(0px)',
        },
        visible: {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            transition: shouldSkipAnimations
                ? { duration: 0 }
                : { duration: 1, delay: 0.3, ease: [0.33, 1, 0.68, 1] as const }
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
                    className="absolute right-4 sm:right-6 md:right-8 lg:right-12 top-[40%] sm:top-[35%] md:top-[5%] w-[75vw] sm:w-[60vw] md:w-[42vw] lg:w-[38vw] max-w-[550px] h-[45vh] sm:h-[50vh] md:h-[70vh] pointer-events-none"
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

            {/* Draggable Sticky Notes */}
            <div
                ref={constraintsRef}
                className="absolute right-0 top-0 w-full md:w-[60%] h-full pointer-events-none z-20"
            >
                {stickyNotes.map((note, index) => (
                    <motion.div
                        key={note.id}
                        drag={!prefersReducedMotion}
                        dragConstraints={constraintsRef}
                        dragElastic={0}
                        dragMomentum={false}
                        initial={{
                            opacity: 0,
                            scale: 0.8,
                            rotate: note.rotation
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            rotate: note.rotation
                        }}
                        transition={{
                            delay: shouldSkipAnimations ? 0 : 0.8 + index * 0.15,
                            duration: shouldSkipAnimations ? 0 : 0.5,
                            ease: [0.33, 1, 0.68, 1] as const
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileDrag={{
                            scale: 1.1,
                            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                            cursor: 'grabbing'
                        }}
                        onDragEnd={(_, info) => {
                            setDragOffsets(prev => ({
                                ...prev,
                                [note.id]: {
                                    x: (prev[note.id]?.x || 0) + info.offset.x,
                                    y: (prev[note.id]?.y || 0) + info.offset.y
                                }
                            }));
                        }}
                        className={`absolute ${note.color} rounded shadow-md cursor-grab pointer-events-auto select-none flex items-center justify-center text-center w-[60px] h-[60px] md:w-[120px] md:h-[120px]`}
                        style={{
                            top: isMobile ? note.topMobile : note.top,
                            right: note.right,
                            transform: dragOffsets[note.id]
                                ? `translate(${dragOffsets[note.id].x}px, ${dragOffsets[note.id].y}px) rotate(${note.rotation}deg)`
                                : undefined,
                        }}
                        aria-label={`Sticky note: ${note.text}`}
                    >
                        <span className="text-[10px] md:text-sm font-medium text-gray-700 px-1 md:px-2">
                            {note.text}
                        </span>
                    </motion.div>
                ))}
            </div>

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
