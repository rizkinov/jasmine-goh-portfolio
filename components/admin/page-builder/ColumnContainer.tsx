'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Column, ContentBlock, BlockType } from '@/types/page-builder';
import { ContentBlockWrapper } from './ContentBlockWrapper';
import { AddBlockMenu } from './AddBlockMenu';
import { TextBlockEditor } from './TextBlockEditor';
import { ImageBlockEditor } from './ImageBlockEditor';
import { VideoBlockEditor } from './VideoBlockEditor';
import { SpacerBlockEditor } from './SpacerBlockEditor';
import { TableBlockEditor } from './TableBlockEditor';
import { CodeBlockEditor } from './CodeBlockEditor';
import { usePageBuilder } from './PageBuilderContext';

interface ColumnContainerProps {
    column: Column;
    sectionId: string;
}

export function ColumnContainer({ column, sectionId }: ColumnContainerProps) {
    const { addBlock, removeBlock, updateBlock, moveBlockUp, moveBlockDown, openMediaLibrary } = usePageBuilder();

    const droppableId = `${sectionId}:${column.id}`;
    const { setNodeRef, isOver } = useDroppable({
        id: droppableId,
        data: {
            type: 'column',
            sectionId,
            columnId: column.id,
        },
    });

    const sortableItems = column.blocks.map(b => b.id);

    const handleAddBlock = (type: BlockType) => {
        addBlock(sectionId, column.id, type);
    };

    const handleUpdateBlock = (blockId: string, updates: Partial<ContentBlock>) => {
        updateBlock(sectionId, column.id, blockId, updates);
    };

    const handleRemoveBlock = (blockId: string) => {
        removeBlock(sectionId, column.id, blockId);
    };

    const handleDuplicateBlock = (block: ContentBlock) => {
        // Add a block of the same type, then update it with the same data
        addBlock(sectionId, column.id, block.type);
    };

    const renderBlockContent = (block: ContentBlock) => {
        switch (block.type) {
            case 'text':
                return (
                    <TextBlockEditor
                        content={block.content_html}
                        onChange={(html) => handleUpdateBlock(block.id, { content_html: html } as Partial<ContentBlock>)}
                    />
                );
            case 'image':
                return (
                    <ImageBlockEditor
                        block={block}
                        onUpdate={(updates) => handleUpdateBlock(block.id, updates as Partial<ContentBlock>)}
                        onSelectImage={() => {
                            openMediaLibrary((media) => {
                                handleUpdateBlock(block.id, {
                                    src: media.url,
                                    alt: media.alt || '',
                                    width: media.width,
                                    height: media.height,
                                } as Partial<ContentBlock>);
                            });
                        }}
                    />
                );
            case 'video':
                return (
                    <VideoBlockEditor
                        block={block}
                        onUpdate={(updates) => handleUpdateBlock(block.id, updates as Partial<ContentBlock>)}
                        onSelectVideo={() => {
                            openMediaLibrary((media) => {
                                handleUpdateBlock(block.id, {
                                    src: media.url,
                                    width: media.width,
                                    height: media.height,
                                } as Partial<ContentBlock>);
                            });
                        }}
                    />
                );
            case 'spacer':
                return (
                    <SpacerBlockEditor
                        block={block}
                        onUpdate={(updates) => handleUpdateBlock(block.id, updates as Partial<ContentBlock>)}
                    />
                );
            case 'divider':
                return <hr className="border-t border-border my-2" />;
            case 'table':
                return (
                    <TableBlockEditor
                        block={block}
                        onUpdate={(updates) => handleUpdateBlock(block.id, updates as Partial<ContentBlock>)}
                    />
                );
            case 'code':
                return (
                    <CodeBlockEditor
                        content={block.content_html}
                        onChange={(html) => handleUpdateBlock(block.id, { content_html: html } as Partial<ContentBlock>)}
                    />
                );
        }
    };

    return (
        <div
            ref={setNodeRef}
            className={`column-container flex-1 min-w-0 ${isOver ? 'bg-primary/5' : ''}`}
            style={{ flex: `0 0 ${column.widthPercent}%` }}
        >
            <SortableContext items={sortableItems} strategy={verticalListSortingStrategy}>
                {column.blocks.map((block, index) => (
                    <ContentBlockWrapper
                        key={block.id}
                        block={block}
                        sectionId={sectionId}
                        columnId={column.id}
                        onRemove={() => handleRemoveBlock(block.id)}
                        onDuplicate={() => handleDuplicateBlock(block)}
                        onMoveUp={() => moveBlockUp(sectionId, column.id, block.id)}
                        onMoveDown={() => moveBlockDown(sectionId, column.id, block.id)}
                        isFirst={index === 0}
                        isLast={index === column.blocks.length - 1}
                    >
                        {renderBlockContent(block)}
                    </ContentBlockWrapper>
                ))}
            </SortableContext>
            <div className="mt-2">
                <AddBlockMenu onAdd={handleAddBlock} />
            </div>
        </div>
    );
}
