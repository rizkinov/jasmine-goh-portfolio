'use client';

import { motion } from 'framer-motion';
import { ProjectCard } from './ProjectCard';
import type { Project } from '@/types/database';

interface ProjectGridProps {
    projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
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

    return (
        <section className="px-6 md:px-12 lg:px-24 py-20">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mb-12"
            >
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    Selected Work
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl">
                    A collection of projects that showcase my approach to user-centered design,
                    from discovery to delivery.
                </p>
            </motion.div>

            {/* Projects Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                {projects.map((project, index) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                    />
                ))}
            </motion.div>

            {/* Empty state */}
            {projects.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 text-muted-foreground"
                >
                    <p className="text-lg">No projects found. Check back soon!</p>
                </motion.div>
            )}
        </section>
    );
}
