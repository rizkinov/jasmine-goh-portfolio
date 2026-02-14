'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AdminLogin, PageBuilder, ProjectMetadataForm } from '@/components/admin';
import { supabase } from '@/lib/supabase';
import type { Project, CreateProjectInput } from '@/types/database';
import type { PageContent } from '@/types/page-builder';
import { migrateHtmlToBlocks } from '@/lib/content-migration';

type ActiveTab = 'metadata' | 'content';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [isCreating, setIsCreating] = useState(false);
    const [activeTab, setActiveTab] = useState<ActiveTab>('content');

    // Blur animation variants
    const blurFadeVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            filter: 'blur(10px)',
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.5,
                ease: [0.33, 1, 0.68, 1] as const
            }
        }
    };

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/admin/verify');
                setIsAuthenticated(response.ok);
            } catch {
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    // Handle logout
    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        setIsAuthenticated(false);
    };

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

    // Handle creating a new project
    const handleCreateProject = async (data: CreateProjectInput) => {
        setSaveStatus('saving');

        try {
            const response = await fetch('/api/admin/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Error creating project:', error);
                setSaveStatus('error');
                setTimeout(() => setSaveStatus('idle'), 3000);
                return;
            }

            const newProject = await response.json();

            // Add to projects list and select it
            setProjects(prev => [newProject, ...prev]);
            setSelectedProject(newProject);
            setIsCreating(false);
            setActiveTab('content'); // Switch to content tab after creating

            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (error) {
            console.error('Error creating project:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    // Handle updating project metadata
    const handleUpdateMetadata = async (data: CreateProjectInput) => {
        if (!selectedProject) return;

        setSaveStatus('saving');

        try {
            const response = await fetch('/api/admin/projects', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedProject.id, ...data }),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Error updating project:', error);
                setSaveStatus('error');
                setTimeout(() => setSaveStatus('idle'), 3000);
                return;
            }

            const updatedProject = await response.json();

            // Update local state
            setProjects(prev =>
                prev.map(p => p.id === selectedProject.id ? updatedProject : p)
            );
            setSelectedProject(updatedProject);

            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (error) {
            console.error('Error updating project:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    // Handle deleting a project
    const handleDeleteProject = async () => {
        if (!selectedProject) return;

        setSaveStatus('saving');

        try {
            const response = await fetch(`/api/admin/projects?id=${selectedProject.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Error deleting project:', error);
                setSaveStatus('error');
                setTimeout(() => setSaveStatus('idle'), 3000);
                return;
            }

            // Remove from projects list
            setProjects(prev => prev.filter(p => p.id !== selectedProject.id));
            setSelectedProject(null);

            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (error) {
            console.error('Error deleting project:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    // Handle saving content blocks
    const handleSaveBlocks = async (content: PageContent) => {
        if (!selectedProject || !supabase) return;

        setSaveStatus('saving');

        try {
            const response = await fetch('/api/admin/projects', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedProject.id, content_blocks: content }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error(`Error saving content (${response.status}):`, errorData.error || response.statusText);
                setSaveStatus('error');
                setTimeout(() => setSaveStatus('idle'), 3000);
                return;
            }

            const updatedProject = await response.json();

            // Update local state
            setProjects(prev =>
                prev.map(p =>
                    p.id === selectedProject.id
                        ? { ...p, content_blocks: content }
                        : p
                )
            );
            setSelectedProject(updatedProject);

            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (error) {
            console.error('Error saving:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    // Get page builder initial content (auto-migrate from HTML if needed)
    const getPageBuilderContent = useCallback((project: Project): PageContent | null => {
        if (project.content_blocks) return project.content_blocks;
        if (project.content_html) {
            return migrateHtmlToBlocks(project.content_html);
        }
        return null;
    }, []);

    // Handle starting new project creation
    const handleNewProject = () => {
        setSelectedProject(null);
        setIsCreating(true);
        setActiveTab('metadata');
    };

    // Handle canceling new project creation
    const handleCancelCreate = () => {
        setIsCreating(false);
    };

    // Handle selecting a project
    const handleSelectProject = (project: Project) => {
        setIsCreating(false);
        setSelectedProject(project);
        setActiveTab('content');
    };

    // Show loading state while checking auth
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <motion.div
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                    <span className="text-sm text-muted-foreground tracking-wide">Loading...</span>
                </motion.div>
            </div>
        );
    }

    // Show login if not authenticated
    if (!isAuthenticated) {
        return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-6">
                        <Link
                            href="/"
                            className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
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
                                className="group-hover:-translate-x-1 transition-transform"
                            >
                                <path d="m12 19-7-7 7-7" />
                                <path d="M19 12H5" />
                            </svg>
                            <span className="text-sm tracking-wide">Back to site</span>
                        </Link>
                        <div className="h-6 w-px bg-border/50" />
                        <h1 className="text-lg font-serif">Admin Dashboard</h1>
                        <nav className="flex items-center gap-2 ml-4">
                            <Link
                                href="/admin"
                                className="px-4 py-2 text-sm rounded-full bg-primary/10 text-primary font-medium tracking-wide"
                            >
                                Projects
                            </Link>
                            <Link
                                href="/admin/media"
                                className="px-4 py-2 text-sm rounded-full text-muted-foreground hover:bg-muted transition-colors tracking-wide"
                            >
                                Media
                            </Link>
                            <Link
                                href="/admin/profile"
                                className="px-4 py-2 text-sm rounded-full text-muted-foreground hover:bg-muted transition-colors tracking-wide"
                            >
                                Profile
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Save Status */}
                        {saveStatus !== 'idle' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20, filter: 'blur(8px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium tracking-wide ${saveStatus === 'saving' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200' :
                                    saveStatus === 'saved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200' :
                                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                                    }`}
                            >
                                {saveStatus === 'saving' ? 'Saving...' :
                                    saveStatus === 'saved' ? 'Saved' :
                                        'Error'}
                            </motion.div>
                        )}

                        <button
                            onClick={handleLogout}
                            className="text-sm text-muted-foreground hover:text-destructive transition-colors font-medium tracking-wide"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar - Project List */}
                <aside className="w-80 border-r border-border/50 min-h-[calc(100vh-65px)] bg-muted/20 p-5">
                    {/* New Project Button */}
                    <button
                        onClick={handleNewProject}
                        className={`w-full mb-4 px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                            isCreating
                                ? 'bg-primary text-primary-foreground shadow-lg'
                                : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20'
                        }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Project
                    </button>

                    <div className="flex items-center gap-3 mb-6 px-2">
                        <span className="text-xs font-medium tracking-[0.2em] uppercase text-primary">
                            Projects
                        </span>
                        <div className="h-px flex-1 bg-primary/30" />
                        <span className="text-xs text-muted-foreground">
                            {projects.length}
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-20 bg-muted/50 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : projects.length === 0 ? (
                        <motion.div
                            variants={blurFadeVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-center py-12 text-muted-foreground text-sm"
                        >
                            <p className="font-serif text-lg mb-2">No projects yet</p>
                            <p>Click &quot;New Project&quot; to create one.</p>
                        </motion.div>
                    ) : (
                        <nav className="space-y-2">
                            {projects.map((project, index) => (
                                <motion.button
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    transition={{ delay: index * 0.05, duration: 0.4 }}
                                    onClick={() => handleSelectProject(project)}
                                    className={`w-full text-left p-4 rounded-xl transition-all ${!isCreating && selectedProject?.id === project.id
                                        ? 'bg-primary text-primary-foreground shadow-lg'
                                        : 'hover:bg-muted/80 border border-transparent hover:border-border/50'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className={`font-serif text-lg ${!isCreating && selectedProject?.id === project.id
                                            ? 'text-primary-foreground/60'
                                            : 'text-primary/40'
                                            }`}>
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-serif text-base line-clamp-1">
                                                {project.title}
                                            </p>
                                            <p className={`text-xs mt-1 line-clamp-1 ${!isCreating && selectedProject?.id === project.id
                                                ? 'text-primary-foreground/70'
                                                : 'text-muted-foreground'
                                                }`}>
                                                {project.client}
                                            </p>
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </nav>
                    )}
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {isCreating ? (
                        // New Project Form
                        <motion.div
                            key="new-project"
                            initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                        >
                            <div className="mb-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">
                                        New Project
                                    </span>
                                    <div className="h-px w-12 bg-primary/40" />
                                </div>
                                <h2 className="text-3xl font-serif tracking-tight">
                                    Create a new project
                                </h2>
                            </div>

                            <div className="max-w-2xl">
                                <ProjectMetadataForm
                                    onSave={handleCreateProject}
                                    onCancel={handleCancelCreate}
                                    isSaving={saveStatus === 'saving'}
                                />
                            </div>
                        </motion.div>
                    ) : selectedProject ? (
                        // Edit Project
                        <motion.div
                            key={selectedProject.id}
                            initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                        >
                            {/* Project Header */}
                            <div className="mb-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">
                                        Editing
                                    </span>
                                    <div className="h-px w-12 bg-primary/40" />
                                </div>
                                <h2 className="text-3xl font-serif tracking-tight mb-3">
                                    {selectedProject.title}
                                </h2>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="font-medium">{selectedProject.client}</span>
                                    <span className="text-primary/40">/</span>
                                    <span>{selectedProject.role}</span>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex items-center gap-1 mb-8 border-b border-border">
                                <button
                                    onClick={() => setActiveTab('content')}
                                    className={`px-5 py-3 text-sm font-medium transition-colors relative ${
                                        activeTab === 'content'
                                            ? 'text-primary'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    Content
                                    {activeTab === 'content' && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                        />
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('metadata')}
                                    className={`px-5 py-3 text-sm font-medium transition-colors relative ${
                                        activeTab === 'metadata'
                                            ? 'text-primary'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    Metadata
                                    {activeTab === 'metadata' && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                        />
                                    )}
                                </button>
                            </div>

                            {/* Tab Content */}
                            {activeTab === 'metadata' ? (
                                <div className="max-w-2xl">
                                    <ProjectMetadataForm
                                        project={selectedProject}
                                        onSave={handleUpdateMetadata}
                                        onDelete={handleDeleteProject}
                                        isSaving={saveStatus === 'saving'}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <PageBuilder
                                        key={selectedProject.id}
                                        initialContent={getPageBuilderContent(selectedProject)}
                                        onSave={handleSaveBlocks}
                                    />

                                    {/* Preview Link */}
                                    <div className="mt-8 pt-8 border-t border-border/50">
                                        <Link
                                            href={`/projects/${selectedProject.slug}`}
                                            target="_blank"
                                            className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium tracking-wide"
                                        >
                                            Preview project
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M7 17L17 7" />
                                                <path d="M7 7h10v10" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        // No selection
                        <motion.div
                            initial={{ opacity: 0, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            className="h-full flex items-center justify-center text-center py-20"
                        >
                            <div>
                                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-border/50">
                                    <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-serif mb-3">Select a project</h3>
                                <p className="text-muted-foreground text-sm max-w-xs">
                                    Choose a project from the sidebar to edit, or create a new one.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
}
