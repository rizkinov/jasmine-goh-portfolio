'use client';

import { useState, useEffect } from 'react';
import type { MediaItem } from '@/lib/media';

interface VideoInsertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onInsert: (options: VideoInsertOptions) => void;
    media: MediaItem;
}

export interface VideoInsertOptions {
    src: string;
    width: number;
    height: number;
    autoplay: boolean;
    loop: boolean;
    muted: boolean;
    controls: boolean;
}

export function VideoInsertDialog({
    isOpen,
    onClose,
    onInsert,
    media,
}: VideoInsertDialogProps) {
    const [width, setWidth] = useState<number>(media.width || 800);
    const [height, setHeight] = useState<number>(media.height || 450);
    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
    const [autoplay, setAutoplay] = useState(false);
    const [loop, setLoop] = useState(false);
    const [muted, setMuted] = useState(false);
    const [controls, setControls] = useState(true);

    const originalAspectRatio = (media.width || 800) / (media.height || 450);

    // When autoplay is enabled, muted must be true (browser policy)
    useEffect(() => {
        if (autoplay && !muted) {
            setMuted(true);
        }
    }, [autoplay, muted]);

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
        { label: '✓ Original', width: media.width || 800, height: media.height || 450 },
        { label: 'Full Width', width: 1200, height: Math.round(1200 / originalAspectRatio) },
        { label: 'Large (800px)', width: 800, height: Math.round(800 / originalAspectRatio) },
        { label: 'Medium (600px)', width: 600, height: Math.round(600 / originalAspectRatio) },
        { label: 'Small (400px)', width: 400, height: Math.round(400 / originalAspectRatio) },
    ];

    const handleInsert = () => {
        onInsert({
            src: media.public_url,
            width,
            height,
            autoplay,
            loop,
            muted,
            controls,
        });
        onClose();
    };

    // Format duration
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${String(secs).padStart(2, '0')}`;
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
                    <h3 className="text-lg font-semibold">Insert Video</h3>
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
                            className="relative bg-black rounded overflow-hidden"
                            style={{ maxWidth: '100%', maxHeight: 300 }}
                        >
                            <video
                                src={media.public_url}
                                controls
                                muted
                                className="max-w-full max-h-[300px]"
                                style={{ width: 'auto', height: 'auto' }}
                            />
                        </div>
                    </div>

                    {/* Video Options */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium">
                            Playback Options
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Autoplay */}
                            <label className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={autoplay}
                                    onChange={(e) => setAutoplay(e.target.checked)}
                                    className="rounded"
                                />
                                <div>
                                    <p className="text-sm font-medium">Autoplay</p>
                                    <p className="text-xs text-muted-foreground">Video plays automatically</p>
                                </div>
                            </label>

                            {/* Loop */}
                            <label className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={loop}
                                    onChange={(e) => setLoop(e.target.checked)}
                                    className="rounded"
                                />
                                <div>
                                    <p className="text-sm font-medium">Loop</p>
                                    <p className="text-xs text-muted-foreground">Video repeats continuously</p>
                                </div>
                            </label>

                            {/* Muted */}
                            <label className={`flex items-center gap-3 p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors ${autoplay ? 'opacity-60' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={muted}
                                    onChange={(e) => setMuted(e.target.checked)}
                                    disabled={autoplay}
                                    className="rounded"
                                />
                                <div>
                                    <p className="text-sm font-medium">Muted</p>
                                    <p className="text-xs text-muted-foreground">
                                        {autoplay ? 'Required for autoplay' : 'Video starts muted'}
                                    </p>
                                </div>
                            </label>

                            {/* Controls */}
                            <label className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={controls}
                                    onChange={(e) => setControls(e.target.checked)}
                                    className="rounded"
                                />
                                <div>
                                    <p className="text-sm font-medium">Show Controls</p>
                                    <p className="text-xs text-muted-foreground">Play/pause, volume, etc.</p>
                                </div>
                            </label>
                        </div>
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

                    {/* Info */}
                    <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 space-y-1">
                        <p><strong>Original:</strong> {media.width} × {media.height} px</p>
                        <p><strong>Output:</strong> {width} × {height} px</p>
                        {media.duration && (
                            <p><strong>Duration:</strong> {formatDuration(media.duration)}</p>
                        )}
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
                        Insert Video
                    </button>
                </div>
            </div>
        </div>
    );
}
