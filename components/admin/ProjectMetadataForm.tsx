'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Project, CreateProjectInput } from '@/types/database';
import type { MediaItem } from '@/lib/media';
import { MediaLibrary } from './MediaLibrary';

interface ProjectMetadataFormProps {
    project?: Project | null;
    onSave: (data: CreateProjectInput) => Promise<void>;
    onDelete?: () => void;
    onCancel?: () => void;
    isSaving?: boolean;
}

export function ProjectMetadataForm({
    project,
    onSave,
    onDelete,
    onCancel,
    isSaving = false,
}: ProjectMetadataFormProps) {
    const isNewProject = !project;

    // Form state
    const [title, setTitle] = useState(project?.title || '');
    const [slug, setSlug] = useState(project?.slug || '');
    const [shortDescription, setShortDescription] = useState(project?.short_description || '');
    const [client, setClient] = useState(project?.client || '');
    const [role, setRole] = useState(project?.role || '');
    const [coverImageUrl, setCoverImageUrl] = useState(project?.cover_image_url || '');
    const [heroImageUrl, setHeroImageUrl] = useState(project?.hero_image_url || '');
    const [tags, setTags] = useState<string[]>(project?.tags || []);
    const [tagInput, setTagInput] = useState('');
    const [category, setCategory] = useState(project?.category || '');
    const [status, setStatus] = useState(project?.status || 'Completed');
    const [methodsTools, setMethodsTools] = useState(project?.methods_tools || '');
    const [dateFrom, setDateFrom] = useState(project?.date_from || '');
    const [dateTo, setDateTo] = useState(project?.date_to || '');

    // Media library state
    const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);
    const [imageSelectTarget, setImageSelectTarget] = useState<'cover' | 'hero' | null>(null);

    // Delete confirmation state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Reset form when project changes
    useEffect(() => {
        setTitle(project?.title || '');
        setSlug(project?.slug || '');
        setShortDescription(project?.short_description || '');
        setClient(project?.client || '');
        setRole(project?.role || '');
        setCoverImageUrl(project?.cover_image_url || '');
        setHeroImageUrl(project?.hero_image_url || '');
        setTags(project?.tags || []);
        setTagInput('');
        setCategory(project?.category || '');
        setStatus(project?.status || 'Completed');
        setMethodsTools(project?.methods_tools || '');
        setDateFrom(project?.date_from || '');
        setDateTo(project?.date_to || '');
        setShowDeleteConfirm(false);
    }, [project]);

    // Auto-generate slug from title (only for new projects)
    useEffect(() => {
        if (isNewProject && title) {
            const generatedSlug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            setSlug(generatedSlug);
        }
    }, [title, isNewProject]);

    // Handle tag add
    const handleAddTag = () => {
        const trimmedTag = tagInput.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setTags([...tags, trimmedTag]);
            setTagInput('');
        }
    };

    // Handle tag remove
    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    // Handle media selection
    const handleMediaSelect = (media: MediaItem) => {
        if (imageSelectTarget === 'cover') {
            setCoverImageUrl(media.public_url);
        } else if (imageSelectTarget === 'hero') {
            setHeroImageUrl(media.public_url);
        }
        setMediaLibraryOpen(false);
        setImageSelectTarget(null);
    };

    // Open media library for specific target
    const openMediaLibrary = (target: 'cover' | 'hero') => {
        setImageSelectTarget(target);
        setMediaLibraryOpen(true);
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await onSave({
            title,
            slug,
            short_description: shortDescription,
            client,
            role,
            cover_image_url: coverImageUrl || null,
            hero_image_url: heroImageUrl || null,
            tags,
            category,
            status,
            methods_tools: methodsTools,
            date_from: dateFrom,
            date_to: dateTo,
        });
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tags */}
                <div>
                    <label className="block text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">
                        Tags
                    </label>
                    {tags.length > 0 && (
                        <div className="flex gap-2 mb-3 flex-wrap">
                            {tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="hover:text-destructive transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTag();
                                }
                            }}
                            placeholder="Add a tag"
                            className="flex-1 px-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="px-4 py-2.5 bg-muted border border-border rounded-lg text-sm hover:bg-muted/80 transition-colors"
                        >
                            Add
                        </button>
                    </div>
                </div>

                {/* Title */}
                <div>
                    <label className="block text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">
                        Title *
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Project title"
                        className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>

                {/* Slug */}
                <div>
                    <label className="block text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">
                        Slug (URL) *
                    </label>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        required
                        placeholder="project-url-slug"
                        className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1.5">
                        URL: /projects/{slug || 'project-slug'}
                    </p>
                </div>

                {/* Short Description */}
                <div>
                    <label className="block text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">
                        Short Description *
                    </label>
                    <textarea
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                        required
                        rows={3}
                        placeholder="Brief description for cards and previews"
                        className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                </div>

                {/* Client & Role */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">
                            Client
                        </label>
                        <input
                            type="text"
                            value={client}
                            onChange={(e) => setClient(e.target.value)}
                            placeholder="Client name"
                            className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">
                            Role
                        </label>
                        <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="Your role"
                            className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">
                            Category
                        </label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="e.g. UX Research"
                            className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">
                            Status
                        </label>
                        <input
                            type="text"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            placeholder="e.g. Completed"
                            className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                </div>

                {/* Methods & Tools */}
                <div>
                    <label className="block text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">
                        Methods & Tools
                    </label>
                    <input
                        type="text"
                        value={methodsTools}
                        onChange={(e) => setMethodsTools(e.target.value)}
                        placeholder="e.g. Competitive Analysis, User Research, Adobe XD"
                        className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>

                {/* Date */}
                <div>
                    <label className="block text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">
                        Date
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-muted-foreground mb-1.5">From</p>
                            <MonthYearPicker value={dateFrom} onChange={setDateFrom} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1.5">To (optional)</p>
                            <MonthYearPicker value={dateTo} onChange={setDateTo} />
                        </div>
                    </div>
                </div>

                {/* Cover Image (Thumbnail) */}
                <div>
                    <label className="block text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">
                        Thumbnail Image
                    </label>
                    <p className="text-xs text-muted-foreground mb-3">
                        Used for project cards on the homepage
                    </p>
                    <ImageSelector
                        imageUrl={coverImageUrl}
                        onSelect={() => openMediaLibrary('cover')}
                        onClear={() => setCoverImageUrl('')}
                        placeholder="Select thumbnail image"
                    />
                </div>

                {/* Hero Image */}
                <div>
                    <label className="block text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">
                        Hero Image
                    </label>
                    <p className="text-xs text-muted-foreground mb-3">
                        Displayed at the top of the project detail page
                    </p>
                    <ImageSelector
                        imageUrl={heroImageUrl}
                        onSelect={() => openMediaLibrary('hero')}
                        onClear={() => setHeroImageUrl('')}
                        placeholder="Select hero image"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                        {isSaving ? 'Saving...' : isNewProject ? 'Create Project' : 'Save Changes'}
                    </button>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    {!isNewProject && onDelete && (
                        <div className="ml-auto">
                            {showDeleteConfirm ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Delete this project?</span>
                                    <button
                                        type="button"
                                        onClick={onDelete}
                                        className="px-4 py-2 text-sm text-destructive-foreground bg-destructive rounded-lg hover:bg-destructive/90 transition-colors"
                                    >
                                        Yes, Delete
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                >
                                    Delete Project
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </form>

            {/* Media Library Modal */}
            <MediaLibrary
                isOpen={mediaLibraryOpen}
                onClose={() => {
                    setMediaLibraryOpen(false);
                    setImageSelectTarget(null);
                }}
                onSelect={handleMediaSelect}
                mode="select"
            />
        </>
    );
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

// Month/Year picker sub-component
// value is stored as "YYYY-MM" string
function MonthYearPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const [month, year] = value ? value.split('-') : ['', ''];

    const handleChange = (newMonth: string, newYear: string) => {
        if (newMonth && newYear) {
            onChange(`${newYear}-${newMonth}`);
        } else {
            onChange('');
        }
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2017 }, (_, i) => String(2018 + i));

    return (
        <div className="flex gap-2">
            <select
                value={month}
                onChange={(e) => handleChange(e.target.value, year)}
                className="flex-1 px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
            >
                <option value="">Month</option>
                {MONTHS.map((m, i) => (
                    <option key={m} value={String(i + 1).padStart(2, '0')}>{m}</option>
                ))}
            </select>
            <select
                value={year}
                onChange={(e) => handleChange(month, e.target.value)}
                className="w-24 px-3 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
            >
                <option value="">Year</option>
                {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                ))}
            </select>
            {value && (
                <button
                    type="button"
                    onClick={() => onChange('')}
                    className="px-2 text-muted-foreground hover:text-destructive transition-colors"
                    title="Clear"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}

// Image selector sub-component
function ImageSelector({
    imageUrl,
    onSelect,
    onClear,
    placeholder,
}: {
    imageUrl: string;
    onSelect: () => void;
    onClear: () => void;
    placeholder: string;
}) {
    return (
        <div className="border border-dashed border-border rounded-xl p-4 bg-muted/20">
            {imageUrl ? (
                <div>
                    <div className="aspect-[16/10] relative rounded-lg overflow-hidden bg-muted">
                        <Image
                            src={imageUrl}
                            alt="Selected image"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex gap-2 mt-3">
                        <button
                            type="button"
                            onClick={onSelect}
                            className="px-4 py-2 text-sm bg-muted border border-border rounded-lg hover:bg-muted/80 transition-colors"
                        >
                            Change
                        </button>
                        <button
                            type="button"
                            onClick={onClear}
                            className="px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={onSelect}
                    className="w-full py-10 text-center text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                >
                    <svg className="w-10 h-10 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">{placeholder}</span>
                </button>
            )}
        </div>
    );
}
