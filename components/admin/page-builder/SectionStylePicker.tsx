'use client';

import { useState, useRef, useEffect } from 'react';
import type { SectionStyle, SectionBgPreset } from '@/types/page-builder';

interface SectionStylePickerProps {
    currentStyle?: SectionStyle;
    onChange: (style: SectionStyle) => void;
    onOpenChange?: (open: boolean) => void;
}

const BG_PRESETS: { preset: SectionBgPreset; label: string; cssVar: string }[] = [
    { preset: 'none', label: 'None', cssVar: '' },
    { preset: 'muted', label: 'Muted', cssVar: 'var(--muted)' },
    { preset: 'primary', label: 'Primary', cssVar: 'var(--primary)' },
    { preset: 'secondary', label: 'Secondary', cssVar: 'var(--secondary)' },
    { preset: 'accent', label: 'Accent', cssVar: 'var(--accent)' },
    { preset: 'foreground', label: 'Dark', cssVar: 'var(--foreground)' },
];

export function SectionStylePicker({ currentStyle, onChange, onOpenChange }: SectionStylePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const colorPickerActive = useRef(false);
    const style = currentStyle ?? {};

    useEffect(() => {
        onOpenChange?.(isOpen);
    }, [isOpen, onOpenChange]);

    useEffect(() => {
        if (!isOpen) return;
        const handleClick = (e: MouseEvent) => {
            if (colorPickerActive.current) return;
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen]);

    const hasStyle = (style.bgPreset && style.bgPreset !== 'none') || style.bgCustom || style.colorMode === 'dark';
    const activePreset = style.bgCustom ? null : (style.bgPreset ?? 'none');

    return (
        <div ref={menuRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1 px-1.5 py-1 rounded hover:bg-muted text-xs transition-colors ${
                    hasStyle ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Section style"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-30 p-3 w-[220px]">
                    {/* Background Color */}
                    <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-2">Background</div>
                    <div className="flex gap-1.5 mb-3">
                        {BG_PRESETS.map((opt) => (
                            <button
                                key={opt.preset}
                                type="button"
                                onClick={() => onChange({ ...style, bgPreset: opt.preset, bgCustom: undefined })}
                                className={`w-7 h-7 rounded-md border-2 transition-colors ${
                                    activePreset === opt.preset
                                        ? 'border-primary ring-1 ring-primary/30'
                                        : 'border-border hover:border-muted-foreground'
                                }`}
                                style={opt.preset === 'none' ? {
                                    backgroundImage: 'linear-gradient(45deg, #ddd 25%, transparent 25%), linear-gradient(-45deg, #ddd 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ddd 75%), linear-gradient(-45deg, transparent 75%, #ddd 75%)',
                                    backgroundSize: '8px 8px',
                                    backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                                } : {
                                    background: opt.cssVar,
                                }}
                                title={opt.label}
                            />
                        ))}
                    </div>

                    {/* Custom hex */}
                    <div className="flex items-center gap-2 mb-3">
                        <input
                            type="color"
                            value={style.bgCustom || '#ffffff'}
                            onChange={(e) => onChange({ ...style, bgPreset: 'none', bgCustom: e.target.value })}
                            onMouseDown={() => { colorPickerActive.current = true; }}
                            onBlur={() => { setTimeout(() => { colorPickerActive.current = false; }, 300); }}
                            className="w-7 h-7 rounded cursor-pointer border border-border p-0.5"
                        />
                        <input
                            type="text"
                            value={style.bgCustom || ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (/^#?[0-9a-fA-F]{0,6}$/.test(val) || val === '') {
                                    onChange({ ...style, bgPreset: 'none', bgCustom: val || undefined });
                                }
                            }}
                            placeholder="#hex color"
                            className="flex-1 px-2 py-1 text-xs border border-border rounded bg-background font-mono"
                        />
                    </div>

                    <div className="w-full h-px bg-border mb-3" />

                    {/* Color Mode */}
                    <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-2">Color Mode</div>
                    <div className="flex gap-0.5 bg-muted rounded-md p-0.5">
                        <button
                            type="button"
                            onClick={() => onChange({ ...style, colorMode: 'light' })}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium transition-all ${
                                style.colorMode !== 'dark'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
                            </svg>
                            Light
                        </button>
                        <button
                            type="button"
                            onClick={() => onChange({ ...style, colorMode: 'dark' })}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded text-xs font-medium transition-all ${
                                style.colorMode === 'dark'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                            </svg>
                            Dark
                        </button>
                    </div>

                    {/* Reset */}
                    {hasStyle && (
                        <>
                            <div className="w-full h-px bg-border mt-3 mb-2" />
                            <button
                                type="button"
                                onClick={() => {
                                    onChange({});
                                    setIsOpen(false);
                                }}
                                className="w-full text-xs text-muted-foreground hover:text-foreground py-1 transition-colors"
                            >
                                Reset to default
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
