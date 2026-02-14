'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ContentBlock } from '@/types/page-builder';

interface ContentBlockWrapperProps {
    block: ContentBlock;
    sectionId: string;
    columnId: string;
    onRemove: () => void;
    onDuplicate: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    isFirst: boolean;
    isLast: boolean;
    children: React.ReactNode;
}

export function ContentBlockWrapper({
    block,
    sectionId,
    columnId,
    onRemove,
    onDuplicate,
    onMoveUp,
    onMoveDown,
    isFirst,
    isLast,
    children,
}: ContentBlockWrapperProps) {
    const [isHovered, setIsHovered] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: block.id,
        data: {
            type: 'block',
            block,
            sectionId,
            columnId,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`block-wrapper relative group/block ${isDragging ? 'z-50' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Block toolbar - visible on hover */}
            {isHovered && !isDragging && (
                <div className="absolute -top-3 right-1 flex items-center gap-0.5 bg-background border border-border rounded-md shadow-sm px-1 py-0.5 z-20">
                    {/* Drag handle */}
                    <button
                        type="button"
                        className="px-1 py-0.5 rounded hover:bg-muted text-muted-foreground cursor-grab active:cursor-grabbing"
                        {...attributes}
                        {...listeners}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
                            <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
                        </svg>
                    </button>
                    {/* Move up */}
                    <button
                        type="button"
                        onClick={onMoveUp}
                        disabled={isFirst}
                        className="px-1 py-0.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                        title="Move up"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m18 15-6-6-6 6"/>
                        </svg>
                    </button>
                    {/* Move down */}
                    <button
                        type="button"
                        onClick={onMoveDown}
                        disabled={isLast}
                        className="px-1 py-0.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                        title="Move down"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m6 9 6 6 6-6"/>
                        </svg>
                    </button>
                    {/* Block type label */}
                    <span className="text-[10px] text-muted-foreground px-1 capitalize">{block.type}</span>
                    <div className="w-px h-3 bg-border" />
                    {/* Duplicate */}
                    <button
                        type="button"
                        onClick={onDuplicate}
                        className="px-1 py-0.5 rounded hover:bg-muted text-muted-foreground"
                        title="Duplicate"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                        </svg>
                    </button>
                    {/* Delete */}
                    <button
                        type="button"
                        onClick={onRemove}
                        className="px-1 py-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        title="Delete"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            )}
            {children}
        </div>
    );
}
