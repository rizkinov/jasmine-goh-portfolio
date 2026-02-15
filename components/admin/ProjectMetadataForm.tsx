'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Project, CreateProjectInput, CustomField } from '@/types/database';
import type { MediaItem } from '@/lib/media';
import { MediaLibrary } from './MediaLibrary';
import { TextBlockEditor } from './page-builder/TextBlockEditor';


interface ProjectMetadataFormProps {
    project?: Project | null;
    onSave: (data: CreateProjectInput) => Promise<void>;
    formRef?: React.RefObject<HTMLFormElement | null>;
}

export function ProjectMetadataForm({
    project,
    onSave,
    formRef,
}: ProjectMetadataFormProps) {
    const isNewProject = !project;

    // Form state
    const [title, setTitle] = useState(project?.title || '');
    const [slug, setSlug] = useState(project?.slug || '');
    const [shortDescription, setShortDescription] = useState(project?.short_description || '');
    const [coverImageUrl, setCoverImageUrl] = useState(project?.cover_image_url || '');
    const [heroImageUrl, setHeroImageUrl] = useState(project?.hero_image_url || '');
    const [tags, setTags] = useState<string[]>(project?.tags || []);
    const [tagInput, setTagInput] = useState('');
    const [customFields, setCustomFields] = useState<CustomField[]>(project?.custom_fields || []);

    // Media library state
    const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);
    const [imageSelectTarget, setImageSelectTarget] = useState<'cover' | 'hero' | null>(null);

    // Reset form when project changes
    useEffect(() => {
        setTitle(project?.title || '');
        setSlug(project?.slug || '');
        setShortDescription(project?.short_description || '');
        setCoverImageUrl(project?.cover_image_url || '');
        setHeroImageUrl(project?.hero_image_url || '');
        setTags(project?.tags || []);
        setTagInput('');
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
            cover_image_url: coverImageUrl || null,
            hero_image_url: heroImageUrl || null,
            tags,
            custom_fields: customFields.filter(f => f.title || f.description).length > 0
                ? customFields.filter(f => f.title || f.description)
                : null,
        });
    };

    return (
        <>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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

                {/* Overview */}
                <div>
                    <label className="block text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">
                        Overview *
                    </label>
                    <TextBlockEditor
                        content={shortDescription}
                        onChange={setShortDescription}
                        placeholder="Project overview"
                        className="bg-muted border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary/50"
                    />
                </div>

                {/* Custom Fields */}
                <div>
                    <label className="block text-xs font-medium tracking-[0.2em] uppercase text-primary mb-2">
                        Custom Fields <span className="text-muted-foreground font-normal normal-case tracking-normal">(max 5)</span>
                    </label>
                    <div className="space-y-3">
                        {customFields.map((field, index) => (
                            <div key={index} className="flex gap-2 items-start">
                                <div className="grid grid-cols-2 gap-2 flex-1">
                                    <input
                                        type="text"
                                        value={field.title}
                                        onChange={(e) => {
                                            const updated = [...customFields];
                                            updated[index] = { ...updated[index], title: e.target.value };
                                            setCustomFields(updated);
                                        }}
                                        placeholder="Title"
                                        className="px-4 py-3 bg-muted border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    <input
                                        type="text"
                                        value={field.description}
                                        onChange={(e) => {
                                            const updated = [...customFields];
                                            updated[index] = { ...updated[index], description: e.target.value };
                                            setCustomFields(updated);
                                        }}
                                        placeholder="Description"
                                        className="px-4 py-3 bg-muted border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setCustomFields(customFields.filter((_, i) => i !== index))}
                                    className="mt-3 px-2 text-muted-foreground hover:text-destructive transition-colors"
                                    title="Remove"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                        {customFields.length < 5 && (
                            <button
                                type="button"
                                onClick={() => setCustomFields([...customFields, { title: '', description: '' }])}
                                className="text-sm text-primary hover:text-primary/80 transition-colors"
                            >
                                + Add custom field
                            </button>
                        )}
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

                {/* Hidden submit for programmatic form submission */}
                <button type="submit" className="hidden" />
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
