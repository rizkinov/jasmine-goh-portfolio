'use client';

import { useCallback, useRef, useState } from 'react';
import type { SpacerBlock } from '@/types/page-builder';

interface SpacerBlockEditorProps {
    block: SpacerBlock;
    onUpdate: (updates: Partial<SpacerBlock>) => void;
}

export function SpacerBlockEditor({ block, onUpdate }: SpacerBlockEditorProps) {
    const [isDragging, setIsDragging] = useState(false);
    const startY = useRef(0);
    const startHeight = useRef(0);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        startY.current = e.clientY;
        startHeight.current = block.height;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const delta = moveEvent.clientY - startY.current;
            const newHeight = Math.max(16, Math.min(400, startHeight.current + delta));
            onUpdate({ height: Math.round(newHeight) });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }, [block.height, onUpdate]);

    return (
        <div
            className="relative group"
            style={{ height: `${block.height}px` }}
        >
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{block.height}px</span>
                </div>
            </div>
            {/* Resize handle at bottom */}
            <div
                className={`absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize flex items-center justify-center ${isDragging ? 'bg-primary/20' : 'hover:bg-muted/50'}`}
                onMouseDown={handleMouseDown}
            >
                <div className="w-8 h-0.5 bg-border rounded-full group-hover:bg-muted-foreground transition-colors" />
            </div>
        </div>
    );
}
