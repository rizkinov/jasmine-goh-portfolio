'use client';

import { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
    imageSrc: string;
    originalMimeType?: string; // Pass the original file's MIME type to preserve format
    onCropComplete: (croppedBlob: Blob) => void;
    onCancel: () => void;
    aspectRatios?: { label: string; value: number | undefined }[];
}

const DEFAULT_ASPECT_RATIOS = [
    { label: 'Free', value: undefined },
    { label: '16:9', value: 16 / 9 },
    { label: '4:3', value: 4 / 3 },
    { label: '1:1', value: 1 },
    { label: '3:2', value: 3 / 2 },
    { label: '2:3', value: 2 / 3 },
];

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number
): Crop {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight
        ),
        mediaWidth,
        mediaHeight
    );
}

export function ImageCropper({
    imageSrc,
    originalMimeType,
    onCropComplete,
    onCancel,
    aspectRatios = DEFAULT_ASPECT_RATIOS,
}: ImageCropperProps) {
    const imgRef = useRef<HTMLImageElement>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [aspect, setAspect] = useState<number | undefined>(undefined);
    const [outputWidth, setOutputWidth] = useState<number>(0); // 0 = use original
    const [outputHeight, setOutputHeight] = useState<number>(0); // 0 = use original
    const [useOriginalSize, setUseOriginalSize] = useState(true);
    const [quality, setQuality] = useState<number>(90);
    const [isProcessing, setIsProcessing] = useState(false);

    // Detect if image should preserve transparency (PNG, WebP, GIF)
    const isPng = originalMimeType === 'image/png' ||
                  imageSrc.startsWith('data:image/png') ||
                  imageSrc.toLowerCase().includes('.png');
    const isWebp = originalMimeType === 'image/webp' ||
                   imageSrc.startsWith('data:image/webp') ||
                   imageSrc.toLowerCase().includes('.webp');
    const supportsTransparency = isPng || isWebp;
    const outputMimeType = supportsTransparency ? 'image/png' : 'image/jpeg';

    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        if (aspect) {
            setCrop(centerAspectCrop(width, height, aspect));
        } else {
            setCrop({
                unit: '%',
                x: 5,
                y: 5,
                width: 90,
                height: 90,
            });
        }
    }, [aspect]);

    const handleAspectChange = (newAspect: number | undefined) => {
        setAspect(newAspect);
        if (imgRef.current && newAspect) {
            const { width, height } = imgRef.current;
            setCrop(centerAspectCrop(width, height, newAspect));
        }
    };

    const getCroppedImg = useCallback(async (): Promise<Blob | null> => {
        if (!imgRef.current || !completedCrop) return null;

        const image = imgRef.current;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) return null;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        // Get the actual cropped area dimensions
        const cropWidth = completedCrop.width * scaleX;
        const cropHeight = completedCrop.height * scaleY;

        // Calculate output dimensions
        let finalWidth: number;
        let finalHeight: number;

        if (useOriginalSize) {
            // Use the actual cropped size
            finalWidth = Math.round(cropWidth);
            finalHeight = Math.round(cropHeight);
        } else if (aspect) {
            // Fixed aspect ratio: use width and calculate height
            finalWidth = outputWidth || Math.round(cropWidth);
            finalHeight = Math.round(finalWidth / aspect);
        } else {
            // Free mode: use both width and height as specified
            finalWidth = outputWidth || Math.round(cropWidth);
            finalHeight = outputHeight || Math.round(cropHeight);
        }

        canvas.width = finalWidth;
        canvas.height = finalHeight;

        // For PNG/transparency, don't fill background (keep transparent)
        // For JPEG, fill with white background first
        if (!supportsTransparency) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, finalWidth, finalHeight);
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            finalWidth,
            finalHeight
        );

        return new Promise((resolve) => {
            // PNG is lossless, so quality only applies to JPEG
            canvas.toBlob(
                (blob) => resolve(blob),
                outputMimeType,
                supportsTransparency ? undefined : quality / 100
            );
        });
    }, [completedCrop, outputWidth, outputHeight, aspect, quality, outputMimeType, supportsTransparency]);

    const handleApplyCrop = async () => {
        setIsProcessing(true);
        try {
            const blob = await getCroppedImg();
            if (blob) {
                onCropComplete(blob);
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="border-b border-border px-6 py-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Crop & Resize Image</h3>
                    <button
                        onClick={onCancel}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Image Preview */}
                        <div className="lg:col-span-2">
                            <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center min-h-[300px]">
                                <ReactCrop
                                    crop={crop}
                                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={aspect}
                                    className="max-w-full"
                                >
                                    <img
                                        ref={imgRef}
                                        src={imageSrc}
                                        alt="Crop preview"
                                        onLoad={onImageLoad}
                                        className="max-w-full max-h-[400px] object-contain"
                                    />
                                </ReactCrop>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="space-y-6">
                            {/* Aspect Ratio */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Aspect Ratio
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {aspectRatios.map((ratio) => (
                                        <button
                                            key={ratio.label}
                                            onClick={() => handleAspectChange(ratio.value)}
                                            className={`px-3 py-2 text-xs rounded-lg transition-colors ${aspect === ratio.value
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted hover:bg-muted/80'
                                                }`}
                                        >
                                            {ratio.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Output Dimensions */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium">
                                        Output Size
                                    </label>
                                    <label className="flex items-center gap-2 text-xs">
                                        <input
                                            type="checkbox"
                                            checked={useOriginalSize}
                                            onChange={(e) => setUseOriginalSize(e.target.checked)}
                                            className="rounded"
                                        />
                                        Use cropped size
                                    </label>
                                </div>
                                {!useOriginalSize && (
                                    <>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-xs text-muted-foreground">Width (px)</label>
                                                <input
                                                    type="number"
                                                    value={outputWidth || ''}
                                                    onChange={(e) => setOutputWidth(Number(e.target.value))}
                                                    placeholder="Auto"
                                                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm"
                                                    min={100}
                                                    max={4000}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-muted-foreground">Height (px)</label>
                                                <input
                                                    type="number"
                                                    value={aspect ? (outputWidth ? Math.round(outputWidth / aspect) : '') : (outputHeight || '')}
                                                    onChange={(e) => setOutputHeight(Number(e.target.value))}
                                                    disabled={!!aspect}
                                                    placeholder="Auto"
                                                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm disabled:opacity-50"
                                                    min={100}
                                                    max={4000}
                                                />
                                            </div>
                                        </div>
                                        {aspect && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Height is calculated from aspect ratio
                                            </p>
                                        )}
                                    </>
                                )}
                                {useOriginalSize && completedCrop && imgRef.current && (
                                    <p className="text-xs text-muted-foreground">
                                        Output: ~{Math.round(completedCrop.width * (imgRef.current.naturalWidth / imgRef.current.width))} × {Math.round(completedCrop.height * (imgRef.current.naturalHeight / imgRef.current.height))} px
                                    </p>
                                )}
                            </div>

                            {/* Quality */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Quality: {quality}%
                                    {supportsTransparency && (
                                        <span className="ml-2 text-xs text-muted-foreground">(PNG is lossless)</span>
                                    )}
                                </label>
                                <input
                                    type="range"
                                    value={quality}
                                    onChange={(e) => setQuality(Number(e.target.value))}
                                    min={10}
                                    max={100}
                                    step={5}
                                    className="w-full"
                                    disabled={supportsTransparency}
                                />
                                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                    <span>Smaller file</span>
                                    <span>Better quality</span>
                                </div>
                                {supportsTransparency && (
                                    <p className="text-xs text-green-600 mt-2">
                                        ✓ Transparency will be preserved (PNG output)
                                    </p>
                                )}
                            </div>

                            {/* Presets */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Quick Presets
                                </label>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => { setUseOriginalSize(true); setAspect(undefined); }}
                                        className="w-full px-3 py-2 text-xs bg-muted hover:bg-muted/80 rounded-lg text-left font-medium"
                                    >
                                        ✓ Original Cropped Size
                                    </button>
                                    <button
                                        onClick={() => { setOutputWidth(1920); setOutputHeight(1080); setAspect(16 / 9); setUseOriginalSize(false); }}
                                        className="w-full px-3 py-2 text-xs bg-muted hover:bg-muted/80 rounded-lg text-left"
                                    >
                                        HD (1920×1080)
                                    </button>
                                    <button
                                        onClick={() => { setOutputWidth(1200); setOutputHeight(0); setAspect(undefined); setUseOriginalSize(false); }}
                                        className="w-full px-3 py-2 text-xs bg-muted hover:bg-muted/80 rounded-lg text-left"
                                    >
                                        Web (1200px wide, auto height)
                                    </button>
                                    <button
                                        onClick={() => { setOutputWidth(800); setOutputHeight(800); setAspect(1); setUseOriginalSize(false); }}
                                        className="w-full px-3 py-2 text-xs bg-muted hover:bg-muted/80 rounded-lg text-left"
                                    >
                                        Square (800×800)
                                    </button>
                                    <button
                                        onClick={() => { setOutputWidth(400); setOutputHeight(400); setAspect(1); setUseOriginalSize(false); }}
                                        className="w-full px-3 py-2 text-xs bg-muted hover:bg-muted/80 rounded-lg text-left"
                                    >
                                        Thumbnail (400×400)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-border px-6 py-4 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApplyCrop}
                        disabled={isProcessing || !completedCrop}
                        className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                        {isProcessing ? 'Processing...' : 'Apply & Upload'}
                    </button>
                </div>
            </div>
        </div>
    );
}
