'use client';

import { useState, useRef, useEffect } from 'react';
import type { ColumnLayout } from '@/types/page-builder';

interface LayoutPickerProps {
    currentLayout: ColumnLayout;
    onChange: (layout: ColumnLayout) => void;
}

interface LayoutOption {
    layout: ColumnLayout;
    label: string;
    widths: number[];
}

const LAYOUT_OPTIONS: LayoutOption[] = [
    { layout: '100', label: '1 Column', widths: [100] },
    { layout: '50-50', label: '2 Equal', widths: [50, 50] },
    { layout: '60-40', label: '60 / 40', widths: [60, 40] },
    { layout: '40-60', label: '40 / 60', widths: [40, 60] },
    { layout: '70-30', label: '70 / 30', widths: [70, 30] },
    { layout: '30-70', label: '30 / 70', widths: [30, 70] },
    { layout: '33-33-33', label: '3 Equal', widths: [33, 33, 34] },
    { layout: '50-25-25', label: '50 / 25 / 25', widths: [50, 25, 25] },
    { layout: '25-50-25', label: '25 / 50 / 25', widths: [25, 50, 25] },
    { layout: '25-25-50', label: '25 / 25 / 50', widths: [25, 25, 50] },
    { layout: '25-25-25-25', label: '4 Equal', widths: [25, 25, 25, 25] },
];

function LayoutIcon({ widths, isActive }: { widths: number[]; isActive: boolean }) {
    return (
        <div className="flex gap-0.5 w-16 h-5">
            {widths.map((w, i) => (
                <div
                    key={i}
                    className={`h-full rounded-sm ${isActive ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                    style={{ width: `${w}%` }}
                />
            ))}
        </div>
    );
}

export function LayoutPicker({ currentLayout, onChange }: LayoutPickerProps) {
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
                className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-muted text-xs text-muted-foreground hover:text-foreground transition-colors"
                title="Change layout"
            >
                <LayoutIcon
                    widths={LAYOUT_OPTIONS.find(o => o.layout === currentLayout)?.widths || [100]}
                    isActive={false}
                />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-30 p-2 min-w-[200px]">
                    <div className="text-xs text-muted-foreground px-2 py-1 font-medium">Layout</div>
                    <div className="grid grid-cols-2 gap-1">
                        {LAYOUT_OPTIONS.map((opt) => (
                            <button
                                key={opt.layout}
                                type="button"
                                onClick={() => {
                                    onChange(opt.layout);
                                    setIsOpen(false);
                                }}
                                className={`flex flex-col items-center gap-1 px-2 py-2 rounded hover:bg-muted transition-colors ${
                                    currentLayout === opt.layout ? 'bg-muted ring-1 ring-primary' : ''
                                }`}
                            >
                                <LayoutIcon widths={opt.widths} isActive={currentLayout === opt.layout} />
                                <span className="text-[10px] text-muted-foreground">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
