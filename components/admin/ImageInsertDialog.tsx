'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { MediaItem } from '@/lib/media';

export type ImageSize = 'xl' | 'l' | 'm' | 's';
export type ImageRounded = 'none' | 'sm' | 'md' | 'lg';
export type ImageShadow = 'none' | 'sm' | 'md' | 'lg';

export interface ImageInsertOptions {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    size: ImageSize;
    rounded: ImageRounded;
    shadow: ImageShadow;
    caption?: string;
}

interface ImageInsertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onInsert: (options: ImageInsertOptions) => void;
    media: MediaItem;
}

export function ImageInsertDialog({
    isOpen,
    onClose,
    onInsert,
    media,
}: ImageInsertDialogProps) {
    const [altText, setAltText] = useState<string>(media.alt_text || media.original_filename);
    const [caption, setCaption] = useState<string>('');
    const [size, setSize] = useState<ImageSize>('l');
    const [rounded, setRounded] = useState<ImageRounded>('md');
    const [shadow, setShadow] = useState<ImageShadow>('md');

    const sizeOptions: { value: ImageSize; label: string; width: number }[] = [
        { value: 'xl', label: 'XL (Full Width)', width: 1200 },
        { value: 'l', label: 'L (Large)', width: 800 },
        { value: 'm', label: 'M (Medium)', width: 600 },
        { value: 's', label: 'S (Small)', width: 400 },
    ];

    const roundedOptions: { value: ImageRounded; label: string }[] = [
        { value: 'none', label: 'None' },
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
    ];

    const shadowOptions: { value: ImageShadow; label: string }[] = [
        { value: 'none', label: 'None' },
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
    ];

    const originalAspectRatio = (media.width || 800) / (media.height || 600);
    const selectedWidth = sizeOptions.find(s => s.value === size)?.width || 800;
    const selectedHeight = Math.round(selectedWidth / originalAspectRatio);

    // Generate preview classes
    const getPreviewClasses = () => {
        const classes = [];

        // Rounded
        if (rounded === 'sm') classes.push('rounded');
        else if (rounded === 'md') classes.push('rounded-xl');
        else if (rounded === 'lg') classes.push('rounded-2xl');

        // Shadow
        if (shadow === 'sm') classes.push('shadow-sm');
        else if (shadow === 'md') classes.push('shadow-lg');
        else if (shadow === 'lg') classes.push('shadow-xl');

        return classes.join(' ');
    };

    const handleInsert = () => {
        onInsert({
            src: media.public_url,
            alt: altText,
            width: selectedWidth,
            height: selectedHeight,
            size,
            rounded,
            shadow,
            caption: caption.trim() || undefined,
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
                {/* Header */}
                <div className="border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 bg-card z-10">
                    <h3 className="text-lg font-semibold">Insert Image</h3>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Preview */}
                    <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center">
                        <div
                            className={`relative bg-white border border-border overflow-hidden transition-all ${getPreviewClasses()}`}
                            style={{ maxWidth: '100%', maxHeight: 250 }}
                        >
                            <Image
                                src={media.public_url}
                                alt={altText}
                                width={Math.min(selectedWidth, 500)}
                                height={Math.min(selectedHeight, 250)}
                                className="object-contain"
                                style={{
                                    width: 'auto',
                                    height: 'auto',
                                    maxWidth: '100%',
                                    maxHeight: 250,
                                }}
                            />
                        </div>
                    </div>

                    {/* Alt Text */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Alt Text <span className="text-muted-foreground font-normal">(for accessibility)</span>
                        </label>
                        <input
                            type="text"
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            placeholder="Describe this image..."
                            className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    {/* Caption / Footnote */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Caption / Source <span className="text-muted-foreground font-normal">(optional, displays below image)</span>
                        </label>
                        <input
                            type="text"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="e.g., Source: Company Report 2024"
                            className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    {/* Size */}
                    <div>
                        <label className="block text-sm font-medium mb-3">
                            Size
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {sizeOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setSize(option.value)}
                                    className={`px-3 py-2.5 text-xs font-medium rounded-lg transition-all ${
                                        size === option.value
                                            ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-card'
                                            : 'bg-muted hover:bg-muted/80 text-foreground'
                                    }`}
                                >
                                    <span className="block text-sm font-semibold">{option.value.toUpperCase()}</span>
                                    <span className="block text-[10px] opacity-70">{option.width}px</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Rounded Corners */}
                    <div>
                        <label className="block text-sm font-medium mb-3">
                            Rounded Corners
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {roundedOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setRounded(option.value)}
                                    className={`px-3 py-2.5 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                                        rounded === option.value
                                            ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-card'
                                            : 'bg-muted hover:bg-muted/80 text-foreground'
                                    }`}
                                >
                                    <div
                                        className={`w-4 h-4 bg-current opacity-40 ${
                                            option.value === 'none' ? '' :
                                            option.value === 'sm' ? 'rounded-sm' :
                                            option.value === 'md' ? 'rounded-md' :
                                            'rounded-lg'
                                        }`}
                                    />
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Shadow */}
                    <div>
                        <label className="block text-sm font-medium mb-3">
                            Shadow
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {shadowOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setShadow(option.value)}
                                    className={`px-3 py-2.5 text-xs font-medium rounded-lg transition-all ${
                                        shadow === option.value
                                            ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-card'
                                            : 'bg-muted hover:bg-muted/80 text-foreground'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 space-y-1">
                        <p><strong>Original:</strong> {media.width} × {media.height}px</p>
                        <p><strong>Output:</strong> {selectedWidth} × {selectedHeight}px</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-border px-6 py-4 flex justify-end gap-3 sticky bottom-0 bg-card">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleInsert}
                        className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                        Insert Image
                    </button>
                </div>
            </div>
        </div>
    );
}
