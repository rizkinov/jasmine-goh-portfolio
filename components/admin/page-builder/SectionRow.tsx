'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Section } from '@/types/page-builder';
import { ColumnContainer } from './ColumnContainer';
import { LayoutPicker } from './LayoutPicker';
import { usePageBuilder } from './PageBuilderContext';

interface SectionRowProps {
    section: Section;
    index: number;
    totalSections: number;
}

export function SectionRow({ section, index, totalSections }: SectionRowProps) {
    const [isHovered, setIsHovered] = useState(false);
    const { addSection, removeSection, duplicateSection, moveSectionUp, moveSectionDown, updateSectionLayout } = usePageBuilder();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: `section:${section.id}`,
        data: {
            type: 'section',
            section,
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
            className={`section-row relative group/section ${isDragging ? 'z-50' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Left-side controls - visible on section hover */}
            {!isDragging && (
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 text-transparent group-hover/section:text-muted-foreground z-20">
                    {/* Drag handle */}
                    <button
                        type="button"
                        className="p-1 rounded hover:!bg-muted cursor-grab active:cursor-grabbing transition-colors"
                        {...attributes}
                        {...listeners}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
                            <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
                        </svg>
                    </button>
                    {/* Add section below */}
                    <button
                        type="button"
                        onClick={() => addSection('100', index + 1)}
                        className="p-0.5 rounded hover:!bg-muted hover:!text-foreground transition-colors"
                        title="Add section below"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"/><path d="M12 5v14"/>
                        </svg>
                    </button>
                </div>
            )}

            {/* Section toolbar - visible on hover */}
            {isHovered && !isDragging && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-background border border-border rounded-md shadow-sm px-1 py-0.5 z-20">
                    {/* Layout picker */}
                    <LayoutPicker
                        currentLayout={section.layout}
                        onChange={(layout) => updateSectionLayout(section.id, layout)}
                    />

                    <div className="w-px h-3 bg-border" />

                    {/* Move up */}
                    <button
                        type="button"
                        onClick={() => moveSectionUp(section.id)}
                        disabled={index === 0}
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
                        onClick={() => moveSectionDown(section.id)}
                        disabled={index === totalSections - 1}
                        className="px-1 py-0.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                        title="Move down"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m6 9 6 6 6-6"/>
                        </svg>
                    </button>

                    <div className="w-px h-3 bg-border" />

                    {/* Duplicate */}
                    <button
                        type="button"
                        onClick={() => duplicateSection(section.id)}
                        className="px-1 py-0.5 rounded hover:bg-muted text-muted-foreground"
                        title="Duplicate section"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                        </svg>
                    </button>
                    {/* Delete */}
                    <button
                        type="button"
                        onClick={() => removeSection(section.id)}
                        className="px-1 py-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        title="Delete section"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            )}

            {/* Columns */}
            <div className="flex flex-nowrap gap-0">
                {section.columns.map((column) => (
                    <ColumnContainer
                        key={column.id}
                        column={column}
                        sectionId={section.id}
                    />
                ))}
            </div>
        </div>
    );
}
