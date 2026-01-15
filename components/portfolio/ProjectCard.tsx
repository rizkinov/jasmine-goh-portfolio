'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/types/database';

interface ProjectCardProps {
    project: Project;
    index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
    // Format index as editorial number (01, 02, etc.)
    const editorialNumber = String(index + 1).padStart(2, '0');

    // Card animation - OPTIMIZED: removed blur for scroll performance
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 40,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                delay: index * 0.08, // Faster stagger
                ease: [0.33, 1, 0.68, 1] as const
            }
        }
    };

    // Image scale on hover - removed filter animations
    const imageVariants = {
        rest: {
            scale: 1,
        },
        hover: {
            scale: 1.03, // Reduced scale for smoother animation
            transition: {
                duration: 0.5,
                ease: [0.33, 1, 0.68, 1] as const
            }
        }
    };

    const overlayVariants = {
        rest: { opacity: 0 },
        hover: {
            opacity: 1,
            transition: { duration: 0.3 }
        }
    };

    const contentVariants = {
        rest: { y: 0 },
        hover: {
            y: -4,
            transition: {
                duration: 0.3,
                ease: [0.33, 1, 0.68, 1] as const
            }
        }
    };

    const arrowVariants = {
        rest: { x: 0, opacity: 0 },
        hover: {
            x: 4,
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: [0.33, 1, 0.68, 1] as const
            }
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }} // Trigger earlier
            className="will-change-transform"
        >
            <Link href={`/projects/${project.slug}`} className="block group">
                <motion.article
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                    className="relative"
                >
                    {/* Image Container */}
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted mb-6">
                        {project.cover_image_url ? (
                            <>
                                <motion.div
                                    variants={imageVariants}
                                    className="relative w-full h-full will-change-transform"
                                >
                                    <Image
                                        src={project.cover_image_url}
                                        alt={project.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </motion.div>
                                {/* Hover overlay - elegant gradient */}
                                <motion.div
                                    variants={overlayVariants}
                                    className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-foreground/20 to-transparent"
                                />
                            </>
                        ) : (
                            /* Placeholder with editorial styling */
                            <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted to-primary/5 flex items-center justify-center">
                                <span className="text-8xl font-serif text-primary/10 select-none">
                                    {project.title.charAt(0)}
                                </span>
                            </div>
                        )}

                        {/* Editorial number badge - removed backdrop-blur */}
                        <div className="absolute top-4 left-4 z-10">
                            <span className="font-serif text-sm text-primary bg-background/95 px-3.5 py-2 rounded-full border border-border/50 shadow-sm">
                                {editorialNumber}
                            </span>
                        </div>

                        {/* View project indicator */}
                        <motion.div
                            variants={overlayVariants}
                            className="absolute bottom-4 right-4 z-10"
                        >
                            <div className="flex items-center gap-2 text-sm font-medium text-background bg-foreground/95 px-5 py-2.5 rounded-full shadow-lg">
                                <span className="tracking-wide">View Project</span>
                                <motion.svg
                                    variants={arrowVariants}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M5 12h14" />
                                    <path d="m12 5 7 7-7 7" />
                                </motion.svg>
                            </div>
                        </motion.div>
                    </div>

                    {/* Content with subtle lift on hover */}
                    <motion.div variants={contentVariants} className="space-y-3">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            {project.tags.slice(0, 3).map((tag, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 text-xs tracking-wide text-muted-foreground bg-muted/80 rounded-full border border-border/40"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Title - Editorial serif */}
                        <h3 className="text-xl md:text-2xl font-serif tracking-tight group-hover:text-primary transition-colors duration-300 leading-tight">
                            {project.title}
                        </h3>

                        {/* Client & Role */}
                        <div className="flex items-center gap-3 text-sm">
                            <span className="font-medium text-foreground/80">{project.client}</span>
                            <span className="text-primary/50">/</span>
                            <span className="text-muted-foreground">{project.role}</span>
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground text-refined leading-relaxed line-clamp-2">
                            {project.short_description}
                        </p>
                    </motion.div>

                    {/* Bottom decorative line on hover */}
                    <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        whileHover={{ scaleX: 1, opacity: 1 }}
                        transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] as const }}
                        className="mt-6 h-px bg-gradient-to-r from-primary/50 to-primary/10 origin-left"
                    />
                </motion.article>
            </Link>
        </motion.div>
    );
}
