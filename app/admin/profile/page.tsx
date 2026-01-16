'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AdminLogin } from '@/components/admin';
import type { Profile, Experience } from '@/types/database';

// Check mobile once at module level
const getIsMobile = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
};

export default function ProfilePage() {
    const isMobileRef = useRef<boolean | null>(null);
    if (isMobileRef.current === null) {
        isMobileRef.current = getIsMobile();
    }
    const isMobile = isMobileRef.current;

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    // Form state
    const [name, setName] = useState('');
    const [headline, setHeadline] = useState('');
    const [bio, setBio] = useState('');
    const [experience, setExperience] = useState<Experience[]>([]);

    // Blur animation variants
    const blurFadeVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            filter: isMobile ? 'blur(0px)' : 'blur(10px)',
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

    // Fetch profile via API route
    const fetchProfile = useCallback(async () => {
        try {
            const response = await fetch('/api/admin/profile');
            if (!response.ok) {
                console.error('Error fetching profile');
                return;
            }

            const profileData: Profile = await response.json();
            setProfile(profileData);
            setName(profileData.name || '');
            setHeadline(profileData.headline || '');
            setBio(profileData.bio || '');
            // Ensure each experience entry has a unique ID
            const experienceWithIds = (profileData.experience || []).map((exp, idx) => ({
                ...exp,
                id: exp.id || `exp-${Date.now()}-${idx}`
            }));
            setExperience(experienceWithIds);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch profile only after authentication is confirmed
    useEffect(() => {
        if (isAuthenticated) {
            fetchProfile();
        }
    }, [isAuthenticated, fetchProfile]);

    // Handle save via API route
    const handleSave = async () => {
        if (!profile) return;

        setSaveStatus('saving');

        try {
            const response = await fetch('/api/admin/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: profile.id,
                    name,
                    headline,
                    bio,
                    experience,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                setProfile(result);
                setSaveStatus('saved');
                setTimeout(() => setSaveStatus('idle'), 2000);
            } else {
                console.error('Error saving profile');
                setSaveStatus('error');
                setTimeout(() => setSaveStatus('idle'), 3000);
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    // Add experience entry
    const addExperience = () => {
        setExperience([...experience, { id: `exp-${Date.now()}`, company: '', date: '' }]);
    };

    // Remove experience entry
    const removeExperience = (index: number) => {
        setExperience(experience.filter((_, i) => i !== index));
    };

    // Update experience entry
    const updateExperience = (index: number, field: keyof Experience, value: string) => {
        const updated = [...experience];
        updated[index] = { ...updated[index], [field]: value };
        setExperience(updated);
    };

    // Show loading state while checking auth
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <motion.div
                    initial={{ opacity: 0, filter: isMobile ? 'blur(0px)' : 'blur(10px)' }}
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
                                className="px-4 py-2 text-sm rounded-full text-muted-foreground hover:bg-muted transition-colors tracking-wide"
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
                                className="px-4 py-2 text-sm rounded-full bg-primary/10 text-primary font-medium tracking-wide"
                            >
                                Profile
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Save Status */}
                        {saveStatus !== 'idle' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20, filter: isMobile ? 'blur(0px)' : 'blur(8px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium tracking-wide ${
                                    saveStatus === 'saving' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200' :
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

            {/* Main Content */}
            <main className="max-w-4xl mx-auto p-8">
                {isLoading ? (
                    <div className="space-y-6">
                        <div className="h-12 bg-muted/50 rounded-xl animate-pulse w-1/3" />
                        <div className="h-40 bg-muted/50 rounded-xl animate-pulse" />
                        <div className="h-40 bg-muted/50 rounded-xl animate-pulse" />
                    </div>
                ) : (
                    <motion.div
                        variants={blurFadeVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Page Header */}
                        <div className="mb-10">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">
                                    Settings
                                </span>
                                <div className="h-px w-12 bg-primary/40" />
                            </div>
                            <h2 className="text-3xl font-serif tracking-tight mb-3">
                                Profile Settings
                            </h2>
                            <p className="text-muted-foreground text-refined">
                                Manage your portfolio profile information displayed on the homepage and about page.
                            </p>
                        </div>

                        {/* Form */}
                        <div className="space-y-8">
                            {/* Basic Info Section */}
                            <section className="bg-card/50 border border-border/50 rounded-2xl p-6 lg:p-8">
                                <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-primary mb-6">
                                    Basic Information
                                </h3>

                                <div className="space-y-6">
                                    {/* Name */}
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium mb-2"
                                        >
                                            Name
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-3 bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-foreground"
                                            placeholder="Your name"
                                        />
                                    </div>

                                    {/* Headline */}
                                    <div>
                                        <label
                                            htmlFor="headline"
                                            className="block text-sm font-medium mb-2"
                                        >
                                            Headline
                                        </label>
                                        <input
                                            id="headline"
                                            type="text"
                                            value={headline}
                                            onChange={(e) => setHeadline(e.target.value)}
                                            className="w-full px-4 py-3 bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-foreground"
                                            placeholder="A short tagline describing you"
                                        />
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Displayed below your name on the homepage hero section.
                                        </p>
                                    </div>

                                    {/* Bio */}
                                    <div>
                                        <label
                                            htmlFor="bio"
                                            className="block text-sm font-medium mb-2"
                                        >
                                            Biography
                                        </label>
                                        <textarea
                                            id="bio"
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            rows={5}
                                            className="w-full px-4 py-3 bg-muted/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-foreground resize-none"
                                            placeholder="Tell your story..."
                                        />
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Displayed on the About page.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Experience Section */}
                            <section className="bg-card/50 border border-border/50 rounded-2xl p-6 lg:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xs font-medium tracking-[0.2em] uppercase text-primary">
                                        Experience
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={addExperience}
                                        className="px-4 py-2 text-sm bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors font-medium tracking-wide"
                                    >
                                        + Add Experience
                                    </button>
                                </div>

                                {experience.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        No experience entries yet. Click "Add Experience" to add your work history.
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {experience.map((exp, index) => (
                                            <motion.div
                                                key={exp.id || index}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl border border-border/30"
                                            >
                                                <span className="font-serif text-lg text-primary/40 mt-2">
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                                                            Company / Role
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={exp.company ?? ''}
                                                            onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                                            className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                                                            placeholder="Company Name - Role"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                                                            Date Range
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={exp.date ?? ''}
                                                            onChange={(e) => updateExperience(index, 'date', e.target.value)}
                                                            className="w-full px-3 py-2 bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                                                            placeholder="2020 - Present"
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeExperience(index)}
                                                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                                                    title="Remove"
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
                                                        <path d="M3 6h18" />
                                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                    </svg>
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* Save Button */}
                            <div className="flex items-center justify-between pt-6 border-t border-border/50">
                                <p className="text-sm text-muted-foreground">
                                    Changes will be reflected on your live portfolio.
                                </p>
                                <button
                                    onClick={handleSave}
                                    disabled={saveStatus === 'saving'}
                                    className="px-8 py-3 bg-foreground text-background rounded-full font-medium tracking-wide hover:bg-foreground/90 transition-colors disabled:opacity-50"
                                >
                                    {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
