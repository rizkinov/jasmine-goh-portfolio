'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useAnimationPreferences } from '@/lib/useAnimationPreferences';
import { BlockRenderer } from '@/components/portfolio/BlockRenderer';
import type { Project } from '@/types/database';

interface ProjectContentProps {
    project: Project;
    otherProjects?: Project[];
}

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

function formatProjectDate(dateFrom: string, dateTo: string): string {
    const format = (yyyyMm: string) => {
        const [year, month] = yyyyMm.split('-');
        return `${MONTH_NAMES[parseInt(month, 10) - 1]} ${year}`;
    };
    if (dateTo) {
        return `${format(dateFrom)} - ${format(dateTo)}`;
    }
    return format(dateFrom);
}

// Process HTML to wrap tables in scrollable containers for mobile responsiveness
const processContent = (html: string) => {
    return html
        .replace(/<table/g, '<div class="table-scroll-wrapper"><table')
        .replace(/<\/table>/g, '</table></div>');
};

export function ProjectContent({ project, otherProjects = [] }: ProjectContentProps) {
    const { shouldSkipAnimations } = useAnimationPreferences();

    // Container animation with stagger - disabled when shouldSkipAnimations
    const containerVariants = {
        hidden: { opacity: shouldSkipAnimations ? 1 : 0 },
        visible: {
            opacity: 1,
            transition: shouldSkipAnimations
                ? { duration: 0 }
                : { staggerChildren: 0.1, delayChildren: 0.1 }
        }
    };

    // Blur fade up animation - disabled when shouldSkipAnimations
    const blurFadeUpVariants = {
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
                : { duration: 0.7, ease: [0.33, 1, 0.68, 1] as const }
        }
    };

    // Word animation for title - disabled when shouldSkipAnimations
    const wordVariants = {
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
                : { duration: 0.6, ease: [0.33, 1, 0.68, 1] as const }
        }
    };

    // Line reveal animation - disabled when shouldSkipAnimations
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
                : { duration: 0.8, delay: 0.4, ease: [0.33, 1, 0.68, 1] as const }
        }
    };

    // Image reveal - disabled when shouldSkipAnimations
    const imageVariants = {
        hidden: {
            opacity: shouldSkipAnimations ? 1 : 0,
            scale: shouldSkipAnimations ? 1 : 1.05,
            filter: 'blur(0px)',
        },
        visible: {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            transition: shouldSkipAnimations
                ? { duration: 0 }
                : { duration: 0.9, delay: 0.3, ease: [0.33, 1, 0.68, 1] as const }
        }
    };

    // Back button animation - disabled when shouldSkipAnimations
    const backButtonVariants = {
        hidden: {
            opacity: shouldSkipAnimations ? 1 : 0,
            x: shouldSkipAnimations ? 0 : -20,
            filter: 'blur(0px)',
        },
        visible: {
            opacity: 1,
            x: 0,
            filter: 'blur(0px)',
            transition: shouldSkipAnimations
                ? { duration: 0 }
                : { duration: 0.5, ease: [0.33, 1, 0.68, 1] as const }
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
                    className="max-w-5xl mx-auto mb-16"
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
                <header className="max-w-5xl mx-auto mb-20">
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

                    {/* Meta info with blur — only render if at least one field is populated */}
                    {(project.client || project.role || project.category || project.tags[0] || project.methods_tools || project.date_from || project.status) && (
                    <motion.div
                        variants={blurFadeUpVariants}
                        className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-12 pt-10 border-t border-border/50"
                    >
                        {project.client && (
                            <div>
                                <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">Client</p>
                                <p className="font-serif text-lg">{project.client}</p>
                            </div>
                        )}
                        {project.role && (
                            <div>
                                <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">Role</p>
                                <p className="font-serif text-lg">{project.role}</p>
                            </div>
                        )}
                        {(project.category || project.tags[0]) && (
                            <div>
                                <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">Category</p>
                                <p className="font-serif text-lg">{project.category || project.tags[0]}</p>
                            </div>
                        )}
                        {project.methods_tools && (
                            <div>
                                <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">Methods & Tools</p>
                                <p className="font-serif text-lg">{project.methods_tools}</p>
                            </div>
                        )}
                        {project.date_from && (
                            <div>
                                <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">Date</p>
                                <p className="font-serif text-lg">{formatProjectDate(project.date_from, project.date_to)}</p>
                            </div>
                        )}
                        {project.status && (
                            <div>
                                <p className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">Status</p>
                                <p className="font-serif text-lg">{project.status}</p>
                            </div>
                        )}
                    </motion.div>
                    )}
                </header>

                {/* Hero Image with blur reveal - uses hero_image_url if set, otherwise falls back to cover_image_url */}
                {(project.hero_image_url || project.cover_image_url) && (
                    <motion.div
                        variants={imageVariants}
                        className="mb-20 rounded-2xl overflow-hidden bg-muted aspect-[16/9] relative"
                    >
                        <Image
                            src={project.hero_image_url || project.cover_image_url || ''}
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
                    className="max-w-5xl mx-auto"
                >
                    {project.content_blocks ? (
                        <BlockRenderer content={project.content_blocks} />
                    ) : (
                        <div
                            className="project-content"
                            dangerouslySetInnerHTML={{ __html: processContent(project.content_html) }}
                        />
                    )}
                </motion.div>

                {/* More Projects Section */}
                {otherProjects.length > 0 && (
                    <motion.div
                        variants={blurFadeUpVariants}
                        className="mt-24 pt-12 border-t border-border/50"
                    >
                        <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary mb-10 block">
                            More Projects
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {otherProjects.map((otherProject) => (
                                <Link
                                    key={otherProject.id}
                                    href={`/projects/${otherProject.slug}`}
                                    className="group block"
                                >
                                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-muted mb-4 relative">
                                        {otherProject.cover_image_url ? (
                                            <Image
                                                src={otherProject.cover_image_url}
                                                alt={otherProject.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                                <span className="text-4xl font-serif">{otherProject.title.charAt(0)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-serif text-lg group-hover:text-primary transition-colors">
                                        {otherProject.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {otherProject.tags[0] || 'Design'}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}

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
