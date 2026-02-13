'use client';

import { createContext, useContext } from 'react';
import type { PageContent, Section, ContentBlock, ColumnLayout, BlockType } from '@/types/page-builder';

export interface PageBuilderContextValue {
    pageContent: PageContent;
    // Section operations
    addSection: (layout: ColumnLayout, insertIndex?: number) => void;
    removeSection: (sectionId: string) => void;
    duplicateSection: (sectionId: string) => void;
    moveSectionUp: (sectionId: string) => void;
    moveSectionDown: (sectionId: string) => void;
    updateSectionLayout: (sectionId: string, layout: ColumnLayout) => void;
    // Block operations
    addBlock: (sectionId: string, columnId: string, type: BlockType) => void;
    removeBlock: (sectionId: string, columnId: string, blockId: string) => void;
    updateBlock: (sectionId: string, columnId: string, blockId: string, updates: Partial<ContentBlock>) => void;
    // Media
    openMediaLibrary: (callback: (media: { url: string; width?: number; height?: number; alt?: string }) => void) => void;
}

const PageBuilderContext = createContext<PageBuilderContextValue | null>(null);

export function PageBuilderProvider({ children, value }: { children: React.ReactNode; value: PageBuilderContextValue }) {
    return <PageBuilderContext.Provider value={value}>{children}</PageBuilderContext.Provider>;
}

export function usePageBuilder(): PageBuilderContextValue {
    const ctx = useContext(PageBuilderContext);
    if (!ctx) throw new Error('usePageBuilder must be used within PageBuilderProvider');
    return ctx;
}
