'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Project } from '@/types/database';

interface ProjectContentProps {
    project: Project;
}

export function ProjectContent({ project }: ProjectContentProps) {
    return (
        <article className="px-6 md:px-12 lg:px-24 py-20">
            {/* Back button */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-12"
            >
                <Link
                    href="/#work"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:-translate-x-1 transition-transform"
                    >
                        <path d="m12 19-7-7 7-7" />
                        <path d="M19 12H5" />
                    </motion.svg>
                    <span className="font-medium">Back to projects</span>
                </Link>
            </motion.div>

            {/* Project Header */}
            <header className="max-w-4xl mb-16">
                {/* Tags */}
                <motion.div
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex flex-wrap gap-2 mb-6"
                >
                    {project.tags.map((tag, i) => (
                        <span
                            key={i}
                            className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
                >
                    {project.title}
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-xl text-muted-foreground leading-relaxed"
                >
                    {project.short_description}
                </motion.p>

                {/* Meta info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="grid grid-cols-2 gap-8 mt-10 pt-10 border-t border-border"
                >
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Client</p>
                        <p className="font-medium">{project.client}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Role</p>
                        <p className="font-medium">{project.role}</p>
                    </div>
                </motion.div>
            </header>

            {/* Cover Image */}
            {project.cover_image_url && (
                <motion.div
                    initial={{ opacity: 0, y: 40, filter: 'blur(20px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="mb-16 rounded-2xl overflow-hidden bg-muted aspect-[16/9]"
                >
                    <img
                        src={project.cover_image_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            )}

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="max-w-4xl"
            >
                <div
                    className="prose prose-lg prose-neutral dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6
            prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4
            prose-p:leading-relaxed prose-p:text-muted-foreground
            prose-li:text-muted-foreground
            prose-strong:text-foreground
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                    dangerouslySetInnerHTML={{ __html: project.content_html }}
                />
            </motion.div>

            {/* Navigation to next/prev project would go here */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-20 pt-10 border-t border-border text-center"
            >
                <Link
                    href="/#work"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors font-medium"
                >
                    View More Projects
                </Link>
            </motion.div>
        </article>
    );
}
