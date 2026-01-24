'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAnimationPreferences } from '@/lib/useAnimationPreferences';

// Sticky note data - using CSS classes for responsive positioning (avoids hydration mismatch)
type StickyNote = {
    id: number;
    text?: string;
    type?: 'image';
    imageUrl?: string;
    color: string;
    rotateClass: string;
    topClass: string;
    rightClass: string;
    size?: 'small' | 'large';
    imageScale?: string;
};

const stickyNotes: StickyNote[] = [
    { id: 1, text: 'hello 👋', color: 'bg-amber-100', rotateClass: '-rotate-6', topClass: 'top-[60%] md:top-[35%]', rightClass: 'right-[80%] md:right-[65%]' },
    { id: 2, text: 'scroll down', color: 'bg-pink-100', rotateClass: 'rotate-3', topClass: 'top-[74%] md:top-[55%]', rightClass: 'right-[55%] md:right-[50%]' },
    { id: 3, text: 'to explore more', color: 'bg-sky-100', rotateClass: '-rotate-3', topClass: 'top-[85%] md:top-[70%]', rightClass: 'right-[15%] md:right-[12%]' },
    { id: 4, type: 'image', imageUrl: 'https://fpsputfmlbzfifeillss.supabase.co/storage/v1/object/public/media/uploads/1769251202386-3yil2i.png', color: 'bg-purple-100', rotateClass: 'rotate-2', topClass: 'top-[52%] md:top-[25%]', rightClass: 'right-[35%] md:right-[30%]', imageScale: 'scale-50' },
    { id: 5, text: '🥁', color: 'bg-green-100', rotateClass: '-rotate-4', topClass: 'top-[66%] md:top-[45%]', rightClass: 'right-[3%] md:right-[5%]' },
    { id: 6, text: '✏️', color: 'bg-yellow-100', rotateClass: 'rotate-4', topClass: 'top-[56%] md:top-[30%]', rightClass: 'right-[65%] md:right-[45%]' },
    { id: 7, text: '💻', color: 'bg-slate-100', rotateClass: '-rotate-2', topClass: 'top-[80%] md:top-[65%]', rightClass: 'right-[42%] md:right-[35%]' },
    { id: 8, type: 'image', color: 'bg-orange-100', rotateClass: '-rotate-6', topClass: 'top-[64%] md:top-[40%]', rightClass: 'right-[35%] md:right-[25%]', size: 'large', imageScale: 'scale-75' },
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
    const { shouldSkipAnimations, prefersReducedMotion } = useAnimationPreferences();
    const constraintsRef = useRef<HTMLDivElement>(null);
    const [scrollKey, setScrollKey] = useState(0);

    // Reset sticky notes when scrolling up (mobile only - syncs visual and drag state)
    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        if (!isMobile) return; // Skip on desktop - drag position persists fine

        let lastScrollY = window.scrollY;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            // Reset when scrolling up (any amount)
            if (currentScrollY < lastScrollY) {
                setScrollKey(k => k + 1);
            }
            lastScrollY = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const nameWords = name.split(' ');

    return (
        <section className="relative min-h-[100svh] md:min-h-[90vh] flex flex-col justify-start md:justify-center px-6 md:px-12 lg:px-24 pt-8 pb-0 md:py-24 overflow-hidden">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 gradient-warm pointer-events-none" />

            {/* FigJam-style dashed grid - mobile version (bottom fade) */}
            <div
                className="absolute inset-0 z-0 pointer-events-none md:hidden"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
                        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 0',
                    maskImage: `
                        repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
                        repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px),
                        radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
                    `,
                    WebkitMaskImage: `
                        repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
                        repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px),
                        radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
                    `,
                    maskComposite: 'intersect',
                    WebkitMaskComposite: 'source-in',
                }}
            />

            {/* FigJam-style dashed grid - desktop version (top fade) */}
            <div
                className="absolute inset-0 z-0 pointer-events-none hidden md:block"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
                        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 0',
                    maskImage: `
                        repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
                        repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px),
                        radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
                    `,
                    WebkitMaskImage: `
                        repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
                        repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px),
                        radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
                    `,
                    maskComposite: 'intersect',
                    WebkitMaskComposite: 'source-in',
                }}
            />

            {/* Draggable Sticky Notes */}
            <div
                ref={constraintsRef}
                className="absolute right-0 top-0 w-full md:w-[60%] h-full pointer-events-none z-20"
            >
                {stickyNotes.map((note, index) => {
                    const isLarge = note.size === 'large';
                    const isSmall = note.size === 'small';
                    const sizeClass = isLarge
                        ? 'w-[100px] h-[100px] md:w-[200px] md:h-[200px]'
                        : isSmall
                        ? 'w-[45px] h-[45px] md:w-[90px] md:h-[90px]'
                        : 'w-[60px] h-[60px] md:w-[120px] md:h-[120px]';

                    return (
                        <motion.div
                            key={`${note.id}-${scrollKey}`}
                            drag={!prefersReducedMotion}
                            dragConstraints={constraintsRef}
                            dragElastic={0}
                            dragMomentum={false}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
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
                            className={`absolute ${note.color} ${note.topClass} ${note.rightClass} ${note.rotateClass} rounded shadow-md cursor-grab pointer-events-auto select-none flex items-center justify-center text-center overflow-hidden ${sizeClass}`}
                            aria-label={note.type === 'image' ? 'Jasmine Goh photo' : `Sticky note: ${note.text}`}
                        >
                            {note.type === 'image' ? (
                                <Image
                                    src={note.imageUrl || profileImageUrl || ''}
                                    alt={note.imageUrl ? 'Decoration' : 'Jasmine Goh'}
                                    fill
                                    className={`object-contain object-bottom pointer-events-none select-none ${note.imageScale || ''}`}
                                    sizes={isLarge ? '(max-width: 768px) 100px, 200px' : isSmall ? '(max-width: 768px) 45px, 90px' : '(max-width: 768px) 60px, 120px'}
                                    priority={isLarge}
                                    draggable={false}
                                />
                            ) : (
                                <span className={`font-medium text-gray-700 px-1 md:px-2 ${note.text && note.text.length <= 2 ? 'text-2xl md:text-4xl' : 'text-[10px] md:text-sm'}`}>
                                    {note.text}
                                </span>
                            )}
                        </motion.div>
                    );
                })}
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
