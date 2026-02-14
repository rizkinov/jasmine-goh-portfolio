'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
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
    const [activeDragBlock, setActiveDragBlock] = useState<ContentBlock | null>(null);
    const activeDragLocationRef = useRef<{ sectionId: string; columnId: string } | null>(null);
    const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
    const mediaCallbackRef = useRef<((media: { url: string; width?: number; height?: number; alt?: string }) => void) | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    // ---- Undo / Redo ----

    const pageContentRef = useRef(pageContent);
    pageContentRef.current = pageContent;

    const undoStackRef = useRef<PageContent[]>([]);
    const redoStackRef = useRef<PageContent[]>([]);
    const [, forceHistoryRender] = useState(0);

    const canUndo = undoStackRef.current.length > 0;
    const canRedo = redoStackRef.current.length > 0;
    const MAX_HISTORY = 50;

    const recordSnapshot = useCallback(() => {
        undoStackRef.current.push(pageContentRef.current);
        if (undoStackRef.current.length > MAX_HISTORY) undoStackRef.current.shift();
        redoStackRef.current = [];
        forceHistoryRender(n => n + 1);
    }, []);

    const undo = useCallback(() => {
        if (undoStackRef.current.length === 0) return;
        const prevState = undoStackRef.current.pop()!;
        redoStackRef.current.push(pageContentRef.current);
        setPageContent(prevState);
        forceHistoryRender(n => n + 1);
    }, []);

    const redo = useCallback(() => {
        if (redoStackRef.current.length === 0) return;
        const nextState = redoStackRef.current.pop()!;
        undoStackRef.current.push(pageContentRef.current);
        setPageContent(nextState);
        forceHistoryRender(n => n + 1);
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
                e.preventDefault();
                redo();
            }
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [undo, redo]);

    // ---- Section operations ----

    const addSection = useCallback((layout: ColumnLayout, insertIndex?: number) => {
        recordSnapshot();
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
    }, [recordSnapshot]);

    const removeSection = useCallback((sectionId: string) => {
        recordSnapshot();
        setPageContent(prev => ({
            ...prev,
            sections: prev.sections.filter(s => s.id !== sectionId),
        }));
    }, [recordSnapshot]);

    const duplicateSection = useCallback((sectionId: string) => {
        recordSnapshot();
        setPageContent(prev => {
            const idx = prev.sections.findIndex(s => s.id === sectionId);
            if (idx === -1) return prev;
            const cloned = cloneSection(prev.sections[idx]);
            const sections = [...prev.sections];
            sections.splice(idx + 1, 0, cloned);
            return { ...prev, sections };
        });
    }, [recordSnapshot]);

    const moveSectionUp = useCallback((sectionId: string) => {
        recordSnapshot();
        setPageContent(prev => {
            const idx = prev.sections.findIndex(s => s.id === sectionId);
            if (idx <= 0) return prev;
            const sections = arrayMove(prev.sections, idx, idx - 1);
            return { ...prev, sections };
        });
    }, [recordSnapshot]);

    const moveSectionDown = useCallback((sectionId: string) => {
        recordSnapshot();
        setPageContent(prev => {
            const idx = prev.sections.findIndex(s => s.id === sectionId);
            if (idx === -1 || idx >= prev.sections.length - 1) return prev;
            const sections = arrayMove(prev.sections, idx, idx + 1);
            return { ...prev, sections };
        });
    }, [recordSnapshot]);

    const updateSectionLayout = useCallback((sectionId: string, layout: ColumnLayout) => {
        recordSnapshot();
        setPageContent(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === sectionId
                    ? { ...s, layout, columns: redistributeColumns(s.columns, layout) }
                    : s
            ),
        }));
    }, [recordSnapshot]);

    // ---- Block operations ----

    const addBlock = useCallback((sectionId: string, columnId: string, type: BlockType) => {
        recordSnapshot();
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
    }, [recordSnapshot]);

    const removeBlock = useCallback((sectionId: string, columnId: string, blockId: string) => {
        recordSnapshot();
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
    }, [recordSnapshot]);

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

    const moveBlockUp = useCallback((sectionId: string, columnId: string, blockId: string) => {
        recordSnapshot();
        setPageContent(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === sectionId
                    ? {
                        ...s,
                        columns: s.columns.map(c => {
                            if (c.id !== columnId) return c;
                            const idx = c.blocks.findIndex(b => b.id === blockId);
                            if (idx <= 0) return c;
                            return { ...c, blocks: arrayMove(c.blocks, idx, idx - 1) };
                        }),
                    }
                    : s
            ),
        }));
    }, [recordSnapshot]);

    const moveBlockDown = useCallback((sectionId: string, columnId: string, blockId: string) => {
        recordSnapshot();
        setPageContent(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === sectionId
                    ? {
                        ...s,
                        columns: s.columns.map(c => {
                            if (c.id !== columnId) return c;
                            const idx = c.blocks.findIndex(b => b.id === blockId);
                            if (idx === -1 || idx >= c.blocks.length - 1) return c;
                            return { ...c, blocks: arrayMove(c.blocks, idx, idx + 1) };
                        }),
                    }
                    : s
            ),
        }));
    }, [recordSnapshot]);

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
        recordSnapshot();
        setActiveDragId(event.active.id as string);
        const data = event.active.data.current;
        if (data?.type === 'block') {
            setActiveDragBlock(data.block);
            activeDragLocationRef.current = {
                sectionId: data.sectionId,
                columnId: data.columnId,
            };
        }
    }, [recordSnapshot]);

    const handleDragOver = useCallback((event: DragOverEvent) => {
        const { active, over } = event;
        if (!over || !active) return;

        const activeData = active.data.current;
        const overData = over.data.current;

        // Only handle block-level drag between columns
        if (activeData?.type !== 'block') return;
        if (!activeDragLocationRef.current) return;

        const blockId = active.id as string;
        // Use ref for current location (active.data.current goes stale after cross-column moves)
        const fromSectionId = activeDragLocationRef.current.sectionId;
        const fromColumnId = activeDragLocationRef.current.columnId;

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

        // Update ref to reflect the block's new location
        activeDragLocationRef.current = { sectionId: toSectionId, columnId: toColumnId };
    }, []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        setActiveDragId(null);
        setActiveDragBlock(null);
        const dragLocation = activeDragLocationRef.current;
        activeDragLocationRef.current = null;

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
        if (activeData?.type === 'block' && dragLocation) {
            const blockId = active.id as string;
            // Use ref for current location (may have changed during drag)
            const fromSectionId = dragLocation.sectionId;
            const fromColumnId = dragLocation.columnId;

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
        setActiveDragBlock(null);
        activeDragLocationRef.current = null;
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
        moveBlockUp,
        moveBlockDown,
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
                        <div className="w-px h-5 bg-border" />
                        <button
                            type="button"
                            onClick={undo}
                            disabled={!canUndo}
                            className="p-1.5 text-xs border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-30"
                            title="Undo (Ctrl+Z)"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={redo}
                            disabled={!canRedo}
                            className="p-1.5 text-xs border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-30"
                            title="Redo (Ctrl+Shift+Z)"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/>
                            </svg>
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
                            {activeDragBlock && (() => {
                                const block = activeDragBlock;
                                const label = block.type === 'text'
                                    ? block.content_html.replace(/<[^>]*>/g, '').slice(0, 40) || 'Empty text'
                                    : block.type === 'image'
                                        ? (block as { alt?: string }).alt || 'Image'
                                        : block.type === 'spacer'
                                            ? `Spacer (${(block as { height: number }).height}px)`
                                            : block.type.charAt(0).toUpperCase() + block.type.slice(1);
                                return (
                                    <div className="opacity-70 border-2 border-primary border-dashed rounded-lg bg-background/90 p-3 shadow-lg max-w-xs">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/>
                                                <circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/>
                                            </svg>
                                            <span className="capitalize font-medium">{block.type}</span>
                                            <span className="truncate opacity-60">{label}</span>
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
