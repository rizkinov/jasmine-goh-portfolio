'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Profile } from '@/types/database';

interface AboutContentProps {
    profile: Profile | null;
}

export function AboutContent({ profile }: AboutContentProps) {
    // Fallback data if profile is not loaded
    const name = profile?.name ?? "Jasmine Goh";
    const headline = profile?.headline ?? "A UX/Product Designer and a critical thinker who focuses on creating digital experiences.";
    const bio = profile?.bio ?? "I'm Jasmine, a UX/Product Designer based in Kuala Lumpur, Malaysia. I specialise in bridging the tenets of design thinking, research based data, and user needs to create impactful design solutions.";
    const experience = profile?.experience ?? [];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
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
                ease: 'easeOut' as const
            }
        }
    };

    return (
        <article className="px-6 md:px-12 lg:px-24 py-20">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl"
            >
                {/* Page Title */}
                <motion.div variants={itemVariants} className="mb-16">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                        About Me
                        <span className="text-primary">.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                        {headline}
                    </p>
                </motion.div>

                {/* Profile Section */}
                <div className="grid md:grid-cols-3 gap-12 mb-20">
                    {/* Avatar/Photo placeholder */}
                    <motion.div
                        variants={itemVariants}
                        className="md:col-span-1"
                    >
                        <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center overflow-hidden">
                            <div className="text-8xl font-bold text-primary/30">
                                {name.split(' ').map(n => n[0]).join('')}
                            </div>
                        </div>
                    </motion.div>

                    {/* Bio */}
                    <motion.div
                        variants={itemVariants}
                        className="md:col-span-2 space-y-6"
                    >
                        <div>
                            <h2 className="text-2xl font-bold mb-4">{name}</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {bio}
                            </p>
                        </div>

                        {/* Skills */}
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                What I Do
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {['UX Research', 'Product Design', 'UI Design', 'Design Systems', 'Prototyping', 'User Testing'].map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-4 py-2 text-sm font-medium bg-primary/10 text-foreground rounded-full"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Experience Section */}
                {experience.length > 0 && (
                    <motion.div variants={itemVariants} className="mb-20">
                        <h2 className="text-3xl font-bold mb-8">
                            Experience
                        </h2>
                        <div className="space-y-6">
                            {experience.map((exp, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-border last:border-0"
                                >
                                    <div>
                                        <h3 className="text-xl font-semibold">{exp.company}</h3>
                                    </div>
                                    <div className="text-muted-foreground mt-2 md:mt-0">
                                        {exp.date}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Values/Approach Section */}
                <motion.div variants={itemVariants} className="mb-20">
                    <h2 className="text-3xl font-bold mb-8">
                        My Approach
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'User-Centered',
                                description: 'Every design decision starts and ends with the user. I believe in deep empathy and understanding user needs.'
                            },
                            {
                                title: 'Data-Driven',
                                description: 'I combine qualitative insights with quantitative data to make informed design decisions.'
                            },
                            {
                                title: 'Collaborative',
                                description: 'Great design comes from great collaboration. I work closely with stakeholders, developers, and users.'
                            }
                        ].map((value, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.2 }}
                                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                    <span className="text-xl font-bold text-primary">{index + 1}</span>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Contact CTA */}
                <motion.div
                    variants={itemVariants}
                    className="text-center py-16 px-8 rounded-3xl bg-gradient-to-br from-primary/5 via-primary/10 to-transparent"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Let's work together
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                        I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="mailto:hello@jasminegoh.com"
                            className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
                        >
                            Get in Touch
                        </Link>
                        <Link
                            href="/#work"
                            className="px-8 py-3 bg-secondary text-secondary-foreground rounded-full font-medium hover:bg-secondary/80 transition-colors"
                        >
                            View My Work
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </article>
    );
}
