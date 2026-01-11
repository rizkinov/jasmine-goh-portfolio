'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { MediaItem } from '@/lib/media';

interface ImageInsertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onInsert: (src: string, alt: string, width?: number, height?: number) => void;
    media: MediaItem;
}

export function ImageInsertDialog({
    isOpen,
    onClose,
    onInsert,
    media,
}: ImageInsertDialogProps) {
    const [width, setWidth] = useState<number>(media.width || 800);
    const [height, setHeight] = useState<number>(media.height || 600);
    const [altText, setAltText] = useState<string>(media.alt_text || media.original_filename);
    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
    const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('center');

    const originalAspectRatio = (media.width || 800) / (media.height || 600);

    const handleWidthChange = (newWidth: number) => {
        setWidth(newWidth);
        if (maintainAspectRatio) {
            setHeight(Math.round(newWidth / originalAspectRatio));
        }
    };

    const handleHeightChange = (newHeight: number) => {
        setHeight(newHeight);
        if (maintainAspectRatio) {
            setWidth(Math.round(newHeight * originalAspectRatio));
        }
    };

    const presets = [
        { label: '✓ Original', width: media.width || 800, height: media.height || 600, highlight: true },
        { label: 'Full Width', width: 1200, height: Math.round(1200 / originalAspectRatio), highlight: false },
        { label: 'Large (800px)', width: 800, height: Math.round(800 / originalAspectRatio), highlight: false },
        { label: 'Medium (600px)', width: 600, height: Math.round(600 / originalAspectRatio), highlight: false },
        { label: 'Small (400px)', width: 400, height: Math.round(400 / originalAspectRatio), highlight: false },
    ];

    const handleInsert = () => {
        onInsert(media.public_url, altText, width, height);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-card rounded-xl max-w-2xl w-full max-h-[85vh] overflow-auto">
                {/* Header */}
                <div className="border-b border-border px-6 py-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Insert Image</h3>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Preview */}
                    <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center">
                        <div
                            className="relative bg-white border border-border rounded overflow-hidden"
                            style={{ maxWidth: '100%', maxHeight: 300 }}
                        >
                            <Image
                                src={media.public_url}
                                alt={altText}
                                width={Math.min(width, 500)}
                                height={Math.min(height, 300)}
                                className="object-contain"
                                style={{
                                    width: 'auto',
                                    height: 'auto',
                                    maxWidth: '100%',
                                    maxHeight: 300,
                                }}
                            />
                        </div>
                    </div>

                    {/* Alt Text */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Alt Text (for accessibility & SEO)
                        </label>
                        <input
                            type="text"
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            placeholder="Describe this image..."
                            className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm"
                        />
                    </div>

                    {/* Size Presets */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Size Presets
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {presets.map((preset) => (
                                <button
                                    key={preset.label}
                                    onClick={() => {
                                        setWidth(preset.width);
                                        setHeight(preset.height);
                                    }}
                                    className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${width === preset.width
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted hover:bg-muted/80'
                                        }`}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Dimensions */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium">
                                Custom Dimensions
                            </label>
                            <label className="flex items-center gap-2 text-xs text-muted-foreground">
                                <input
                                    type="checkbox"
                                    checked={maintainAspectRatio}
                                    onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                                    className="rounded"
                                />
                                Maintain aspect ratio
                            </label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-muted-foreground">Width (px)</label>
                                <input
                                    type="number"
                                    value={width}
                                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                                    min={50}
                                    max={2000}
                                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground">Height (px)</label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                                    min={50}
                                    max={2000}
                                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Alignment */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Alignment
                        </label>
                        <div className="flex gap-2">
                            {(['left', 'center', 'right'] as const).map((align) => (
                                <button
                                    key={align}
                                    onClick={() => setAlignment(align)}
                                    className={`px-4 py-2 text-xs rounded-lg transition-colors ${alignment === align
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted hover:bg-muted/80'
                                        }`}
                                >
                                    {align.charAt(0).toUpperCase() + align.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                        <p><strong>Original:</strong> {media.width} × {media.height} px</p>
                        <p><strong>Output:</strong> {width} × {height} px</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-border px-6 py-4 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleInsert}
                        className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Insert Image
                    </button>
                </div>
            </div>
        </div>
    );
}
