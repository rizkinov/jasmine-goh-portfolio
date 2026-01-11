'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AdminEditor } from '@/components/admin';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/types/database';

export default function AdminPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    // Fetch projects from Supabase
    const fetchProjects = useCallback(async () => {
        if (!supabase) {
            console.error('Supabase is not configured');
            setIsLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching projects:', error);
                return;
            }

            setProjects(data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch projects on mount
    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Handle save
    const handleSave = async (content: string) => {
        if (!selectedProject || !supabase) return;

        setSaveStatus('saving');

        try {
            const { data, error } = await supabase
                .from('projects')
                .update({ content_html: content })
                .eq('id', selectedProject.id)
                .select()
                .single();

            if (error) {
                console.error('Error saving:', error);
                setSaveStatus('error');
                setTimeout(() => setSaveStatus('idle'), 3000);
                return;
            }

            // Update local state
            setProjects(prev =>
                prev.map(p =>
                    p.id === selectedProject.id
                        ? { ...p, content_html: content }
                        : p
                )
            );
            setSelectedProject(data);

            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (error) {
            console.error('Error saving:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card sticky top-0 z-50">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            ← Back to site
                        </Link>
                        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
                        <nav className="flex items-center gap-2 ml-4">
                            <Link
                                href="/admin"
                                className="px-3 py-1.5 text-sm rounded-lg bg-primary/10 text-primary"
                            >
                                Projects
                            </Link>
                            <Link
                                href="/admin/media"
                                className="px-3 py-1.5 text-sm rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                            >
                                Media
                            </Link>
                        </nav>
                    </div>

                    {/* Save Status */}
                    {saveStatus !== 'idle' && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`px-3 py-1 rounded-full text-sm ${saveStatus === 'saving' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' :
                                saveStatus === 'saved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' :
                                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                                }`}
                        >
                            {saveStatus === 'saving' ? 'Saving...' :
                                saveStatus === 'saved' ? '✓ Saved' :
                                    '✕ Error saving'}
                        </motion.div>
                    )}
                </div>
            </header>

            <div className="flex">
                {/* Sidebar - Project List */}
                <aside className="w-80 border-r border-border min-h-[calc(100vh-65px)] bg-muted/30 p-4">
                    <h2 className="text-sm font-semibold text-muted-foreground mb-4 px-2">
                        Projects ({projects.length})
                    </h2>

                    {isLoading ? (
                        <div className="space-y-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                            ))}
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            <p>No projects found.</p>
                            <p className="mt-2">Make sure Supabase is configured and seeded.</p>
                        </div>
                    ) : (
                        <nav className="space-y-2">
                            {projects.map((project) => (
                                <button
                                    key={project.id}
                                    onClick={() => setSelectedProject(project)}
                                    className={`w-full text-left p-3 rounded-lg transition-colors ${selectedProject?.id === project.id
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-muted'
                                        }`}
                                >
                                    <p className="font-medium text-sm line-clamp-1">
                                        {project.title}
                                    </p>
                                    <p className={`text-xs mt-1 line-clamp-1 ${selectedProject?.id === project.id
                                        ? 'text-primary-foreground/70'
                                        : 'text-muted-foreground'
                                        }`}>
                                        {project.client}
                                    </p>
                                </button>
                            ))}
                        </nav>
                    )}
                </aside>

                {/* Main Content - Editor */}
                <main className="flex-1 p-8">
                    {selectedProject ? (
                        <motion.div
                            key={selectedProject.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Project Header */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold mb-2">
                                    {selectedProject.title}
                                </h2>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>{selectedProject.client}</span>
                                    <span>•</span>
                                    <span>{selectedProject.role}</span>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    {selectedProject.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 text-xs bg-primary/10 text-primary rounded"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Editor */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">
                                    Content (HTML)
                                </label>
                                <AdminEditor
                                    initialContent={selectedProject.content_html}
                                    onSave={handleSave}
                                    placeholder="Start writing your case study content..."
                                />
                            </div>

                            {/* Preview Link */}
                            <div className="mt-6 pt-6 border-t border-border">
                                <Link
                                    href={`/projects/${selectedProject.slug}`}
                                    target="_blank"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Preview project →
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-center py-20">
                            <div>
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium mb-2">Select a project</h3>
                                <p className="text-muted-foreground text-sm">
                                    Choose a project from the sidebar to edit its content.
                                </p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
