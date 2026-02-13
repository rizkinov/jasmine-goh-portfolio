'use client';

import { useState } from 'react';
import type { ImageBlock } from '@/types/page-builder';

interface ImageBlockEditorProps {
    block: ImageBlock;
    onUpdate: (updates: Partial<ImageBlock>) => void;
    onSelectImage: () => void;
}

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
                        Click to edit
                    </div>
                )}
                {block.caption && (
                    <figcaption>{block.caption}</figcaption>
                )}
            </figure>
        </div>
    );
}
