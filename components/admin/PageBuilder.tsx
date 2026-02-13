'use client';

import { useState, useCallback, useRef } from 'react';
import {
    DndContext,
    closestCenter,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
    type DragStartEvent,
    type DragEndEvent,
    type DragOverEvent,
    type CollisionDetection,
    DragOverlay,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import type { PageContent, Section, ContentBlock, ColumnLayout, BlockType } from '@/types/page-builder';
import {
    createSection,
    createBlock,
    redistributeColumns,
    cloneSection,
    generateId,
    createEmptyPageContent,
} from '@/lib/page-builder-utils';
import { PageBuilderProvider, type PageBuilderContextValue } from './page-builder/PageBuilderContext';
import { SectionRow } from './page-builder/SectionRow';
import { MediaLibrary } from './MediaLibrary';
import type { MediaItem } from '@/lib/media';

interface PageBuilderProps {
    initialContent?: PageContent | null;
    onSave?: (content: PageContent) => Promise<void>;
}

export function PageBuilder({ initialContent, onSave }: PageBuilderProps) {
    const [pageContent, setPageContent] = useState<PageContent>(
        initialContent ?? createEmptyPageContent()
    );
    const [isSaving, setIsSaving] = useState(false);
    const [activeDragId, setActiveDragId] = useState<string | null>(null);
    const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
    const mediaCallbackRef = useRef<((media: { url: string; width?: number; height?: number; alt?: string }) => void) | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    // ---- Section operations ----

    const addSection = useCallback((layout: ColumnLayout, insertIndex?: number) => {
        setPageContent(prev => {
            const newSection = createSection(layout);
            const sections = [...prev.sections];
            if (insertIndex !== undefined) {
                sections.splice(insertIndex, 0, newSection);
            } else {
                sections.push(newSection);
            }
            return { ...prev, sections };
        });
    }, []);

    const removeSection = useCallback((sectionId: string) => {
        setPageContent(prev => ({
            ...prev,
            sections: prev.sections.filter(s => s.id !== sectionId),
        }));
    }, []);

    const duplicateSection = useCallback((sectionId: string) => {
        setPageContent(prev => {
            const idx = prev.sections.findIndex(s => s.id === sectionId);
            if (idx === -1) return prev;
            const cloned = cloneSection(prev.sections[idx]);
            const sections = [...prev.sections];
            sections.splice(idx + 1, 0, cloned);
            return { ...prev, sections };
        });
    }, []);

    const moveSectionUp = useCallback((sectionId: string) => {
        setPageContent(prev => {
            const idx = prev.sections.findIndex(s => s.id === sectionId);
            if (idx <= 0) return prev;
            const sections = arrayMove(prev.sections, idx, idx - 1);
            return { ...prev, sections };
        });
    }, []);

    const moveSectionDown = useCallback((sectionId: string) => {
        setPageContent(prev => {
            const idx = prev.sections.findIndex(s => s.id === sectionId);
            if (idx === -1 || idx >= prev.sections.length - 1) return prev;
            const sections = arrayMove(prev.sections, idx, idx + 1);
            return { ...prev, sections };
        });
    }, []);

    const updateSectionLayout = useCallback((sectionId: string, layout: ColumnLayout) => {
        setPageContent(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === sectionId
                    ? { ...s, layout, columns: redistributeColumns(s.columns, layout) }
                    : s
            ),
        }));
    }, []);

    // ---- Block operations ----

    const addBlock = useCallback((sectionId: string, columnId: string, type: BlockType) => {
        setPageContent(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === sectionId
                    ? {
                        ...s,
                        columns: s.columns.map(c =>
                            c.id === columnId
                                ? { ...c, blocks: [...c.blocks, createBlock(type)] }
                                : c
                        ),
                    }
                    : s
            ),
        }));
    }, []);

    const removeBlock = useCallback((sectionId: string, columnId: string, blockId: string) => {
        setPageContent(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === sectionId
                    ? {
                        ...s,
                        columns: s.columns.map(c =>
                            c.id === columnId
                                ? { ...c, blocks: c.blocks.filter(b => b.id !== blockId) }
                                : c
                        ),
                    }
                    : s
            ),
        }));
    }, []);

    const updateBlock = useCallback((sectionId: string, columnId: string, blockId: string, updates: Partial<ContentBlock>) => {
        setPageContent(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === sectionId
                    ? {
                        ...s,
                        columns: s.columns.map(c =>
                            c.id === columnId
                                ? {
                                    ...c,
                                    blocks: c.blocks.map(b =>
                                        b.id === blockId ? { ...b, ...updates } as ContentBlock : b
                                    ),
                                }
                                : c
                        ),
                    }
                    : s
            ),
        }));
    }, []);

    // ---- Media Library ----

    const openMediaLibrary = useCallback((callback: (media: { url: string; width?: number; height?: number; alt?: string }) => void) => {
        mediaCallbackRef.current = callback;
        setIsMediaLibraryOpen(true);
    }, []);

    const handleMediaSelect = useCallback((media: MediaItem) => {
        if (mediaCallbackRef.current) {
            mediaCallbackRef.current({
                url: media.public_url,
                width: media.width ?? undefined,
                height: media.height ?? undefined,
                alt: media.alt_text ?? undefined,
            });
            mediaCallbackRef.current = null;
        }
        setIsMediaLibraryOpen(false);
    }, []);

    // ---- Drag and Drop ----

    // Custom collision detection: sections only snap to sections, blocks only to blocks/columns
    const collisionDetection: CollisionDetection = useCallback((args) => {
        const activeType = args.active.data.current?.type;

        if (activeType === 'section') {
            return closestCenter({
                ...args,
                droppableContainers: args.droppableContainers.filter(
                    container => container.data.current?.type === 'section'
                ),
            });
        }

        return closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
                container => container.data.current?.type !== 'section'
            ),
        });
    }, []);

    const handleDragStart = useCallback((event: DragStartEvent) => {
        setActiveDragId(event.active.id as string);
    }, []);

    const handleDragOver = useCallback((event: DragOverEvent) => {
        const { active, over } = event;
        if (!over || !active) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        // Only handle block-level drag between columns
        if (activeData?.type !== 'block') return;

        const blockId = active.id as string;
        const fromSectionId = activeData.sectionId;
        const fromColumnId = activeData.columnId;

        let toSectionId: string;
        let toColumnId: string;

        if (overData?.type === 'column') {
            toSectionId = overData.sectionId;
            toColumnId = overData.columnId;
        } else if (overData?.type === 'block') {
            toSectionId = overData.sectionId;
            toColumnId = overData.columnId;
        } else {
            return;
        }

        // Only handle cross-column transfers in dragOver
        if (fromSectionId === toSectionId && fromColumnId === toColumnId) return;

        setPageContent(prev => {
            const newSections = prev.sections.map(s => ({
                ...s,
                columns: s.columns.map(c => ({ ...c, blocks: [...c.blocks] })),
            }));

            // Find source
            const srcSection = newSections.find(s => s.id === fromSectionId);
            const srcColumn = srcSection?.columns.find(c => c.id === fromColumnId);
            if (!srcColumn) return prev;

            const blockIndex = srcColumn.blocks.findIndex(b => b.id === blockId);
            if (blockIndex === -1) return prev;

            const [movedBlock] = srcColumn.blocks.splice(blockIndex, 1);

            // Find destination
            const dstSection = newSections.find(s => s.id === toSectionId);
            const dstColumn = dstSection?.columns.find(c => c.id === toColumnId);
            if (!dstColumn) return prev;

            // Insert at the over block's position, or at end
            if (overData?.type === 'block') {
                const overBlockId = over.id as string;
                if (overBlockId !== blockId) {
                    const overBlockIndex = dstColumn.blocks.findIndex(b => b.id === overBlockId);
                    if (overBlockIndex !== -1) {
                        dstColumn.blocks.splice(overBlockIndex, 0, movedBlock);
                    } else {
                        dstColumn.blocks.push(movedBlock);
                    }
                } else {
                    dstColumn.blocks.push(movedBlock);
                }
            } else {
                dstColumn.blocks.push(movedBlock);
            }

            return { ...prev, sections: newSections };
        });
    }, []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        setActiveDragId(null);
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        // Section reordering
        if (activeData?.type === 'section') {
            const activeId = (active.id as string).replace('section:', '');
            const overId = (over.id as string).replace('section:', '');

            setPageContent(prev => {
                const oldIndex = prev.sections.findIndex(s => s.id === activeId);
                const newIndex = prev.sections.findIndex(s => s.id === overId);
                if (oldIndex === -1 || newIndex === -1) return prev;
                return { ...prev, sections: arrayMove(prev.sections, oldIndex, newIndex) };
            });
            return;
        }

        // Block reordering within same column
        if (activeData?.type === 'block') {
            const blockId = active.id as string;
            const fromSectionId = activeData.sectionId;
            const fromColumnId = activeData.columnId;

            let toSectionId: string, toColumnId: string;
            if (overData?.type === 'block') {
                toSectionId = overData.sectionId;
                toColumnId = overData.columnId;
            } else if (overData?.type === 'column') {
                toSectionId = overData.sectionId;
                toColumnId = overData.columnId;
            } else {
                return;
            }

            // Same column reorder
            if (fromSectionId === toSectionId && fromColumnId === toColumnId) {
                const overBlockId = over.id as string;

                setPageContent(prev => ({
                    ...prev,
                    sections: prev.sections.map(s =>
                        s.id === fromSectionId
                            ? {
                                ...s,
                                columns: s.columns.map(c => {
                                    if (c.id !== fromColumnId) return c;
                                    const oldIndex = c.blocks.findIndex(b => b.id === blockId);
                                    const newIndex = c.blocks.findIndex(b => b.id === overBlockId);
                                    if (oldIndex === -1 || newIndex === -1) return c;
                                    return { ...c, blocks: arrayMove(c.blocks, oldIndex, newIndex) };
                                }),
                            }
                            : s
                    ),
                }));
            }
            // Cross-column moves already handled by handleDragOver
        }
    }, []);

    const handleDragCancel = useCallback(() => {
        setActiveDragId(null);
    }, []);

    // ---- Save ----

    const handleSave = useCallback(async () => {
        if (!onSave) return;
        setIsSaving(true);
        try {
            await onSave(pageContent);
        } finally {
            setIsSaving(false);
        }
    }, [onSave, pageContent]);

    // ---- Context value ----

    const contextValue: PageBuilderContextValue = {
        pageContent,
        addSection,
        removeSection,
        duplicateSection,
        moveSectionUp,
        moveSectionDown,
        updateSectionLayout,
        addBlock,
        removeBlock,
        updateBlock,
        openMediaLibrary,
    };

    const sectionIds = pageContent.sections.map(s => `section:${s.id}`);

    return (
        <PageBuilderProvider value={contextValue}>
            <div className="page-builder-editor">
                {/* Toolbar */}
                <div className="sticky top-[65px] z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => addSection('100')}
                            className="px-3 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-muted transition-colors"
                        >
                            + Add Section
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : 'Save Content'}
                    </button>
                </div>

                {/* Sections */}
                <div className="p-4 min-h-[400px]">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={collisionDetection}
                        autoScroll={{ acceleration: 25, threshold: { x: 0.2, y: 0.25 } }}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleDragEnd}
                        onDragCancel={handleDragCancel}
                    >
                        <SortableContext items={sectionIds} strategy={verticalListSortingStrategy}>
                            {pageContent.sections.map((section, index) => (
                                <SectionRow
                                    key={section.id}
                                    section={section}
                                    index={index}
                                    totalSections={pageContent.sections.length}
                                />
                            ))}
                        </SortableContext>
                        <DragOverlay>
                            {activeDragId?.startsWith('section:') && (() => {
                                const section = pageContent.sections.find(
                                    s => s.id === activeDragId.replace('section:', '')
                                );
                                if (!section) return null;
                                return (
                                    <div className="opacity-60 border-2 border-primary border-dashed rounded-lg bg-background/80 p-3 shadow-lg">
                                        <div className="flex gap-1">
                                            {section.columns.map(col => (
                                                <div
                                                    key={col.id}
                                                    className="bg-muted/50 rounded h-12 flex items-center justify-center text-[10px] text-muted-foreground"
                                                    style={{ flex: `0 0 ${col.widthPercent}%` }}
                                                >
                                                    {col.blocks.length} block{col.blocks.length !== 1 ? 's' : ''}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })()}
                        </DragOverlay>
                    </DndContext>

                    {/* Add section at bottom */}
                    {pageContent.sections.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <p className="text-sm mb-4">No sections yet. Add one to get started.</p>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => addSection('100')}
                        className="w-full py-3 mt-4 border-2 border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                        + Add Section
                    </button>
                </div>
            </div>

            {/* Media Library Modal */}
            <MediaLibrary
                isOpen={isMediaLibraryOpen}
                mode="select"
                onSelect={handleMediaSelect}
                onClose={() => setIsMediaLibraryOpen(false)}
            />
        </PageBuilderProvider>
    );
}
