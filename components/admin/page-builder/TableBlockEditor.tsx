'use client';

import { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import type { TableBlock } from '@/types/page-builder';

interface TableBlockEditorProps {
    block: TableBlock;
    onUpdate: (updates: Partial<TableBlock>) => void;
}

export function TableBlockEditor({ block, onUpdate }: TableBlockEditorProps) {
    const [isFocused, setIsFocused] = useState(false);
    const orientation = block.headerOrientation || 'row';

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: false,
                codeBlock: false,
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'border-collapse my-4 w-full',
                },
            }),
            TableRow.configure({
                HTMLAttributes: { class: 'border-b border-border' },
            }),
            TableHeader.configure({
                HTMLAttributes: { class: 'border-b-2 border-border bg-muted/50 p-3 text-left font-semibold text-foreground' },
            }),
            TableCell.configure({
                HTMLAttributes: { class: 'border-b border-border p-3 text-muted-foreground' },
            }),
        ],
        content: block.content_html,
        editorProps: {
            attributes: {
                class: 'prose prose-neutral dark:prose-invert max-w-none focus:outline-none min-h-[2rem]',
            },
        },
        onUpdate: ({ editor: ed }) => {
            onUpdate({ content_html: ed.getHTML() });
        },
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
    });

    const prevContentRef = useRef(block.content_html);
    useEffect(() => {
        if (editor && block.content_html !== prevContentRef.current && block.content_html !== editor.getHTML()) {
            editor.commands.setContent(block.content_html, { emitUpdate: false });
        }
        prevContentRef.current = block.content_html;
    }, [block.content_html, editor]);

    return (
        <div className="group table-block-container">
            {isFocused && editor && (
                <div className="flex items-center gap-0.5 px-1 py-0.5 mb-1 bg-muted/50 rounded-md text-xs">
                    <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().addColumnAfter().run(); }}
                        className="px-1.5 py-0.5 rounded hover:bg-muted text-muted-foreground"
                    >+ Col</button>
                    <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().addRowAfter().run(); }}
                        className="px-1.5 py-0.5 rounded hover:bg-muted text-muted-foreground"
                    >+ Row</button>
                    <div className="w-px h-4 bg-border mx-0.5" />
                    <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().deleteColumn().run(); }}
                        className="px-1.5 py-0.5 rounded hover:bg-muted text-muted-foreground"
                    >- Col</button>
                    <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().deleteRow().run(); }}
                        className="px-1.5 py-0.5 rounded hover:bg-muted text-muted-foreground"
                    >- Row</button>
                    <div className="w-px h-4 bg-border mx-0.5" />
                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            onUpdate({ headerOrientation: orientation === 'row' ? 'column' : 'row' });
                        }}
                        className={`px-1.5 py-0.5 rounded ${orientation === 'column' ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                        title={orientation === 'row' ? 'Switch to column header' : 'Switch to row header'}
                    >{orientation === 'row' ? 'Row Header' : 'Col Header'}</button>
                </div>
            )}
            <div className={`project-content${orientation === 'column' ? ' table-header-col' : ''}`}>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
