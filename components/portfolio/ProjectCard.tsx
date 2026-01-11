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
    // Staggered animation for list items
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            filter: 'blur(10px)'
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
        >
            <Link href={`/projects/${project.slug}`} className="block group">
                <motion.article
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors duration-300"
                >
                    {/* Image Container */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                        {project.cover_image_url ? (
                            <motion.div
                                className="relative w-full h-full"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <Image
                                    src={project.cover_image_url}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-all duration-500 group-hover:blur-[2px]"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </motion.div>
                        ) : (
                            /* Placeholder gradient when no image */
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent flex items-center justify-center">
                                <div className="text-6xl text-primary/20 font-bold">
                                    {project.title.charAt(0)}
                                </div>
                            </div>
                        )}

                        {/* Tags overlay */}
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                            {project.tags.slice(0, 2).map((tag, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 text-xs font-medium bg-background/90 backdrop-blur-sm rounded-full text-foreground/80 border border-border/50"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        {/* Client & Role */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-medium text-primary">{project.client}</span>
                            <span className="text-muted-foreground/50">•</span>
                            <span>{project.role}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl md:text-2xl font-semibold tracking-tight group-hover:text-primary transition-colors duration-300 line-clamp-2">
                            {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-muted-foreground leading-relaxed line-clamp-2">
                            {project.short_description}
                        </p>

                        {/* Read more indicator */}
                        <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span>View Case Study</span>
                            <motion.svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                animate={{ x: [0, 4, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            >
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </motion.svg>
                        </div>
                    </div>
                </motion.article>
            </Link>
        </motion.div>
    );
}
