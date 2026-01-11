'use client';

import { motion } from 'framer-motion';

interface HeroSectionProps {
    name?: string;
    headline?: string;
}

export function HeroSection({
    name = "Jasmine Goh",
    headline = "A UX/Product Designer and a critical thinker who focuses on creating digital experiences."
}: HeroSectionProps) {
    // Animation variants for the hero text
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

    const wordVariants = {
        hidden: {
            opacity: 0,
            y: 40,
            filter: 'blur(10px)'
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] // Custom easing for smooth slide
            }
        }
    };

    const lineVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            filter: 'blur(8px)'
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    // Split name into words for staggered animation
    const nameWords = name.split(' ');

    return (
        <section className="relative min-h-[70vh] flex flex-col justify-center px-6 md:px-12 lg:px-24 py-20">
            {/* Background gradient accent */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent dark:from-orange-950/20 pointer-events-none" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-4xl"
            >
                {/* Greeting line */}
                <motion.p
                    variants={lineVariants}
                    className="text-lg md:text-xl text-muted-foreground mb-4 tracking-wide"
                >
                    Hi, I'm
                </motion.p>

                {/* Name with word-by-word animation */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8">
                    {nameWords.map((word, index) => (
                        <motion.span
                            key={index}
                            variants={wordVariants}
                            className="inline-block mr-4 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text"
                            style={{
                                // Subtle gradient text effect
                                backgroundSize: '200% 100%'
                            }}
                        >
                            {word}
                        </motion.span>
                    ))}
                    <motion.span
                        variants={wordVariants}
                        className="inline-block text-primary"
                    >
                        .
                    </motion.span>
                </h1>

                {/* Headline */}
                <motion.p
                    variants={lineVariants}
                    className="text-xl md:text-2xl lg:text-3xl text-muted-foreground leading-relaxed max-w-3xl font-light"
                >
                    {headline}
                </motion.p>

                {/* Decorative elements */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-12 h-px bg-gradient-to-r from-primary/50 via-primary to-transparent w-32 origin-left"
                />
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                    className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
                >
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </motion.div>
            </motion.div>
        </section>
    );
}
