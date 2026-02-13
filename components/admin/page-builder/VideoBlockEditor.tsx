'use client';

import { useState } from 'react';
import type { VideoBlock } from '@/types/page-builder';

interface VideoBlockEditorProps {
    block: VideoBlock;
    onUpdate: (updates: Partial<VideoBlock>) => void;
    onSelectVideo: () => void;
}

export function VideoBlockEditor({ block, onSelectVideo }: VideoBlockEditorProps) {
    const [isHovered, setIsHovered] = useState(false);

    if (!block.src) {
        return (
            <button
                type="button"
                onClick={onSelectVideo}
                className="w-full min-h-[120px] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/>
                    <rect x="2" y="6" width="14" height="12" rx="2"/>
                </svg>
                <span className="text-sm font-medium">Select Video</span>
            </button>
        );
    }

    return (
        <div
            className="project-content relative"
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onSelectVideo}
        >
            <video
                src={block.src}
                width={block.width}
                height={block.height}
                muted
                playsInline
                preload="metadata"
                className="rounded-xl max-w-full"
                style={{ opacity: isHovered ? 0.7 : 1, transition: 'opacity 0.2s' }}
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
        </div>
    );
}
