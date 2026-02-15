'use client';

import { useState, useRef, useEffect } from 'react';
import type { BlockType } from '@/types/page-builder';

interface AddBlockMenuProps {
    onAdd: (type: BlockType) => void;
}

const BLOCK_OPTIONS: { type: BlockType; label: string; icon: string }[] = [
    { type: 'text', label: 'Text', icon: 'T' },
    { type: 'image', label: 'Image', icon: '🖼' },
    { type: 'video', label: 'Video', icon: '▶' },
    { type: 'spacer', label: 'Spacer', icon: '↕' },
    { type: 'divider', label: 'Divider', icon: '—' },
    { type: 'table', label: 'Table', icon: '⊞' },
    { type: 'code', label: 'Code', icon: '</>' },
];

export function AddBlockMenu({ onAdd }: AddBlockMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen]);

    return (
        <div ref={menuRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-2 border border-dashed border-border rounded-md text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
            >
                <span className="text-base leading-none">+</span>
                <span>Add block</span>
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-30 py-1">
                    {BLOCK_OPTIONS.map((opt) => (
                        <button
                            key={opt.type}
                            type="button"
                            onClick={() => {
                                onAdd(opt.type);
                                setIsOpen(false);
                            }}
                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-muted flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <span className="w-6 text-center text-xs opacity-60">{opt.icon}</span>
                            <span>{opt.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
