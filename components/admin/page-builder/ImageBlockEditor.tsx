'use client';

import { useState } from 'react';
import type { ImageBlock } from '@/types/page-builder';

interface ImageBlockEditorProps {
    block: ImageBlock;
    onUpdate: (updates: Partial<ImageBlock>) => void;
    onSelectImage: () => void;
}

const roundedOptions: { value: ImageBlock['rounded']; label: string; preview: string }[] = [
    { value: 'none', label: 'None', preview: '' },
    { value: 'sm', label: 'SM', preview: 'rounded-sm' },
    { value: 'md', label: 'MD', preview: 'rounded-md' },
    { value: 'lg', label: 'LG', preview: 'rounded-lg' },
];

const shadowOptions: { value: ImageBlock['shadow']; label: string }[] = [
    { value: 'none', label: 'None' },
    { value: 'sm', label: 'SM' },
    { value: 'md', label: 'MD' },
    { value: 'lg', label: 'LG' },
];

export function ImageBlockEditor({ block, onUpdate, onSelectImage }: ImageBlockEditorProps) {
    const [isHovered, setIsHovered] = useState(false);

    if (!block.src) {
        return (
            <button
                type="button"
                onClick={onSelectImage}
                className="w-full min-h-[120px] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
                <span className="text-sm font-medium">Select Image</span>
            </button>
        );
    }

    const figureClasses = [
        `img-size-${block.size}`,
        `img-rounded-${block.rounded}`,
        `img-shadow-${block.shadow}`,
    ].join(' ');

    return (
        <div>
            <div className="project-content">
                <figure
                    className={figureClasses}
                    style={{ position: 'relative', cursor: 'pointer' }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={onSelectImage}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={block.src}
                        alt={block.alt || ''}
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                            display: 'block',
                            opacity: isHovered ? 0.7 : 1,
                            transition: 'opacity 0.2s',
                        }}
                    />
                    {isHovered && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                padding: '0.75rem 1.5rem',
                                background: 'rgba(0, 0, 0, 0.85)',
                                color: 'white',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                zIndex: 20,
                            }}
                        >
                            Click to change image
                        </div>
                    )}
                    {block.caption && (
                        <figcaption>{block.caption}</figcaption>
                    )}
                </figure>
            </div>

            {/* Display Controls */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                {/* Rounded */}
                <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground font-medium">Rounded</span>
                    <div className="flex gap-0.5 bg-muted rounded-md p-0.5">
                        {roundedOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => onUpdate({ rounded: option.value })}
                                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                                    block.rounded === option.value
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Shadow */}
                <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground font-medium">Shadow</span>
                    <div className="flex gap-0.5 bg-muted rounded-md p-0.5">
                        {shadowOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => onUpdate({ shadow: option.value })}
                                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                                    block.shadow === option.value
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
