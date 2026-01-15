'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import type { Project } from '@/types/database';

interface ProjectContentProps {
    project: Project;
}

// Check mobile once at module level (runs on client only)
const getIsMobile = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
};

export function ProjectContent({ project }: ProjectContentProps) {
    // Capture mobile state once on first render - never changes to avoid re-render blink
    const isMobileRef = useRef<boolean | null>(null);
    if (isMobileRef.current === null) {
        isMobileRef.current = getIsMobile();
    }
    const isMobile = isMobileRef.current;

    // Container animation with stagger
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    // Blur fade up animation - signature effect (blur only on desktop)
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

    // Word animation for title - blur only on desktop
    const wordVariants = {
        hidden: {
            opacity: 0,
            y: 40,
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
                duration: 0.8,
                delay: 0.4,
                ease: [0.33, 1, 0.68, 1] as const
            }
        }
    };

    // Image reveal with blur - blur only on desktop
    const imageVariants = {
        hidden: {
            opacity: 0,
            scale: 1.05,
            filter: isMobile ? 'blur(0px)' : 'blur(20px)',
        },
        visible: {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            transition: {
                duration: 0.9,
                delay: 0.3,
                ease: [0.33, 1, 0.68, 1] as const
            }
        }
    };

    // Back button animation - blur only on desktop
    const backButtonVariants = {
        hidden: {
            opacity: 0,
            x: -20,
            filter: isMobile ? 'blur(0px)' : 'blur(8px)',
        },
        visible: {
            opacity: 1,
            x: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.5,
                ease: [0.33, 1, 0.68, 1] as const
            }
        }
    };

    return (
        <article className="px-6 md:px-12 lg:px-24 py-20 lg:py-28">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Back button with blur */}
                <motion.div
                    variants={backButtonVariants}
                    className="mb-16"
                >
                    <Link
                        href="/#work"
                        className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <motion.div
                            whileHover={{ x: -4 }}
                            transition={{ duration: 0.2 }}
                            className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center group-hover:border-foreground/30 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="m12 19-7-7 7-7" />
                                <path d="M19 12H5" />
                            </svg>
                        </motion.div>
                        <span className="font-medium tracking-wide">Back to projects</span>
                    </Link>
                </motion.div>

                {/* Project Header */}
                <header className="max-w-5xl mb-20">
                    {/* Editorial label */}
                    <motion.div
                        variants={blurFadeUpVariants}
                        className="flex items-center gap-4 mb-10"
                    >
                        <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">
                            Case Study
                        </span>
                        <div className="h-px w-16 bg-primary/40" />
                    </motion.div>

                    {/* Tags with blur */}
                    <motion.div
                        variants={blurFadeUpVariants}
                        className="flex flex-wrap gap-2 mb-8"
                    >
                        {project.tags.map((tag, i) => (
                            <span
                                key={i}
                                className="px-4 py-1.5 text-xs font-medium tracking-wide bg-muted/80 text-foreground rounded-full border border-border/50"
                            >
                                {tag}
                            </span>
                        ))}
                    </motion.div>

                    {/* Title with word-by-word blur animation */}
                    <div className="mb-8">
                        <motion.h1
                            variants={containerVariants}
                            className="text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight leading-[1.05]"
                        >
                            {project.title.split(' ').map((word, wordIndex) => (
                                <motion.span
                                    key={wordIndex}
                                    variants={wordVariants}
                                    className="inline-block mr-[0.25em] will-change-transform"
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
                        </motion.h1>
                    </div>

                    {/* Decorative line */}
                    <motion.div
                        variants={lineVariants}
                        className="decorative-line w-24 mb-8 origin-left"
                    />

                    {/* Description with blur */}
                    <motion.p
                        variants={blurFadeUpVariants}
                        className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl text-refined"
                    >
                        {project.short_description}
                    </motion.p>

                    {/* Meta info with blur */}
                    <motion.div
                        variants={blurFadeUpVariants}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-10 border-t border-border/50"
                    >
                        <div>
                            <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">Client</p>
                            <p className="font-serif text-lg">{project.client}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">Role</p>
                            <p className="font-serif text-lg">{project.role}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">Category</p>
                            <p className="font-serif text-lg">{project.tags[0] || 'Design'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">Status</p>
                            <p className="font-serif text-lg">Completed</p>
                        </div>
                    </motion.div>
                </header>

                {/* Cover Image with blur reveal */}
                {project.cover_image_url && (
                    <motion.div
                        variants={imageVariants}
                        className="mb-20 rounded-2xl overflow-hidden bg-muted aspect-[16/9] relative"
                    >
                        <Image
                            src={project.cover_image_url}
                            alt={project.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                            priority
                        />
                    </motion.div>
                )}

                {/* Content with blur */}
                <motion.div
                    variants={blurFadeUpVariants}
                    className="max-w-4xl"
                >
                    <div
                        className="project-content"
                        dangerouslySetInnerHTML={{ __html: project.content_html }}
                    />
                </motion.div>

                {/* Bottom CTA with blur */}
                <motion.div
                    variants={blurFadeUpVariants}
                    className="mt-24 pt-12 border-t border-border/50"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary mb-3 block">
                                Next Steps
                            </span>
                            <p className="text-2xl font-serif">
                                Interested in working together?
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/#work"
                                className="px-6 py-3 border border-foreground/20 text-foreground rounded-full font-medium hover:bg-foreground/5 transition-colors tracking-wide"
                            >
                                View More Projects
                            </Link>
                            <Link
                                href="mailto:hello@jasminegoh.com"
                                className="group px-6 py-3 bg-foreground text-background rounded-full font-medium transition-colors"
                            >
                                <span className="flex items-center gap-2">
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
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </article>
    );
}
