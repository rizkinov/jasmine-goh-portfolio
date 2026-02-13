'use client';

import { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';

interface TableBlockEditorProps {
    content: string;
    onChange: (html: string) => void;
}

export function TableBlockEditor({ content, onChange }: TableBlockEditorProps) {
    const [isFocused, setIsFocused] = useState(false);

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
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-neutral dark:prose-invert max-w-none focus:outline-none min-h-[2rem]',
            },
        },
        onUpdate: ({ editor: ed }) => {
            onChange(ed.getHTML());
        },
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
    });

    const prevContentRef = useRef(content);
    useEffect(() => {
        if (editor && content !== prevContentRef.current && content !== editor.getHTML()) {
            editor.commands.setContent(content, { emitUpdate: false });
        }
        prevContentRef.current = content;
    }, [content, editor]);

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
                </div>
            )}
            <div className="project-content">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
