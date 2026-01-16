'use client';

import { motion } from 'framer-motion';
import { ProjectCard } from './ProjectCard';
import { useAnimationPreferences } from '@/lib/useAnimationPreferences';
import type { Project } from '@/types/database';

interface ProjectGridProps {
    projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
    const { shouldSkipAnimations } = useAnimationPreferences();

    // Header animation - disabled when shouldSkipAnimations
    const headerBlurVariants = {
        hidden: {
            opacity: shouldSkipAnimations ? 1 : 0,
            y: shouldSkipAnimations ? 0 : 40,
            filter: 'blur(0px)',
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: shouldSkipAnimations
                ? { duration: 0 }
                : { duration: 0.8, ease: [0.33, 1, 0.68, 1] as const }
        }
    };

    // Staggered container for header elements
    const containerVariants = {
        hidden: { opacity: shouldSkipAnimations ? 1 : 0 },
        visible: {
            opacity: 1,
            transition: shouldSkipAnimations
                ? { duration: 0 }
                : { staggerChildren: 0.12, delayChildren: 0.1 }
        }
    };

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
                : { duration: 1, delay: 0.4, ease: [0.33, 1, 0.68, 1] as const }
        }
    };

    return (
        <section className="px-6 md:px-12 lg:px-24 py-24 lg:py-32">
            {/* Editorial Section Header with Blur Animations */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="mb-16 lg:mb-24"
            >
                {/* Label row with blur */}
                <motion.div
                    variants={headerBlurVariants}
                    className="flex items-center gap-4 mb-8"
                >
                    <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">
                        Selected Work
                    </span>
                    <div className="h-px flex-1 max-w-20 bg-primary/40" />
                </motion.div>

                {/* Main heading - large editorial serif with blur */}
                <motion.h2
                    variants={headerBlurVariants}
                    className="text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight mb-8 leading-[1.05]"
                >
                    Case Studies
                </motion.h2>

                {/* Description with blur */}
                <motion.p
                    variants={headerBlurVariants}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl text-refined leading-relaxed"
                >
                    A curated collection of projects showcasing my approach to
                    user-centered design, from discovery through delivery.
                </motion.p>

                {/* Decorative gradient line */}
                <motion.div
                    variants={lineVariants}
                    className="mt-10 h-px w-40 bg-gradient-to-r from-primary/60 via-primary/30 to-transparent origin-left"
                />
            </motion.div>

            {/* Projects Grid - asymmetric layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-16 lg:gap-x-14 lg:gap-y-24">
                {projects.map((project, index) => (
                    <div
                        key={project.id}
                        className={index % 2 === 1 ? 'lg:mt-16' : ''}
                    >
                        <ProjectCard
                            project={project}
                            index={index}
                        />
                    </div>
                ))}
            </div>

            {/* Empty state - disabled animation when shouldSkipAnimations */}
            {projects.length === 0 && (
                <motion.div
                    initial={{ opacity: shouldSkipAnimations ? 1 : 0, filter: 'blur(0px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={shouldSkipAnimations ? { duration: 0 } : { duration: 0.6 }}
                    className="text-center py-24"
                >
                    <div className="inline-flex flex-col items-center">
                        <span className="text-7xl font-serif text-primary/15 mb-4 select-none">
                            00
                        </span>
                        <p className="text-lg text-muted-foreground">
                            No projects found. Check back soon!
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Bottom section decoration - disabled animation when shouldSkipAnimations */}
            {projects.length > 0 && (
                <motion.div
                    initial={{
                        opacity: shouldSkipAnimations ? 1 : 0,
                        y: shouldSkipAnimations ? 0 : 30,
                        filter: 'blur(0px)'
                    }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true }}
                    transition={shouldSkipAnimations ? { duration: 0 } : { duration: 0.7, delay: 0.2 }}
                    className="mt-24 lg:mt-32 flex items-center justify-center gap-6"
                >
                    <div className="h-px w-16 bg-gradient-to-l from-border to-transparent" />
                    <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-medium">
                        {projects.length} Project{projects.length !== 1 ? 's' : ''}
                    </span>
                    <div className="h-px w-16 bg-gradient-to-r from-border to-transparent" />
                </motion.div>
            )}
        </section>
    );
}
