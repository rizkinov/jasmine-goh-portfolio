'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { Mark } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';

// Caption mark reused from AdminEditor
const CaptionMark = Mark.create({
    name: 'caption',
    parseHTML() {
        return [{ tag: 'span.caption-text' }];
    },
    renderHTML({ HTMLAttributes }) {
        return ['span', { ...HTMLAttributes, class: 'caption-text' }, 0];
    },
});

interface TextBlockEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export function TextBlockEditor({ content, onChange, placeholder = 'Type something...' }: TextBlockEditorProps) {
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Track focus at container level so toolbar interactions don't dismiss it
    const handleContainerBlur = useCallback((e: React.FocusEvent) => {
        // If focus is moving to another element within the container, stay focused
        if (containerRef.current?.contains(e.relatedTarget as Node)) return;
        setIsFocused(false);
    }, []);

    const handleContainerFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: false,
            }),
            Heading.configure({
                levels: [1, 2, 3, 4, 5, 6],
            }),
            Placeholder.configure({ placeholder }),
            Link.configure({
                openOnClick: false,
            }),
            Underline,
            Highlight.configure({ multicolor: false }),
            CaptionMark,
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-neutral dark:prose-invert max-w-none focus:outline-none min-h-[2rem] text-block-editor',
            },
        },
        onUpdate: ({ editor: ed }) => {
            onChange(ed.getHTML());
        },
    });

    // Sync external content changes
    const prevContentRef = useRef(content);
    useEffect(() => {
        if (editor && content !== prevContentRef.current && content !== editor.getHTML()) {
            editor.commands.setContent(content, { emitUpdate: false });
        }
        prevContentRef.current = content;
    }, [content, editor]);

    // Inline mini-toolbar when focused
    const renderToolbar = useCallback(() => {
        if (!editor || !isFocused) return null;

        return (
            <div className="flex items-center gap-0.5 px-1 py-0.5 mb-1 bg-muted/50 rounded-md text-xs">
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}
                    className={`px-1.5 py-0.5 rounded hover:bg-muted ${editor.isActive('bold') ? 'bg-muted text-foreground font-bold' : 'text-muted-foreground'}`}
                >B</button>
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }}
                    className={`px-1.5 py-0.5 rounded hover:bg-muted ${editor.isActive('italic') ? 'bg-muted text-foreground italic' : 'text-muted-foreground'}`}
                >I</button>
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }}
                    className={`px-1.5 py-0.5 rounded hover:bg-muted ${editor.isActive('underline') ? 'bg-muted text-foreground underline' : 'text-muted-foreground'}`}
                >U</button>
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleMark('caption').run(); }}
                    className={`px-1.5 py-0.5 rounded hover:bg-muted ${editor.isActive('caption') ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
                    title="Source (smaller italic text)"
                ><span className="text-[10px] italic opacity-70">Src</span></button>
                <div className="w-px h-4 bg-border mx-0.5" />
                <select
                    className="bg-transparent text-xs text-muted-foreground px-1 py-0.5 rounded hover:bg-muted cursor-pointer"
                    value={
                        editor.isActive('heading', { level: 1 }) ? '1' :
                        editor.isActive('heading', { level: 2 }) ? '2' :
                        editor.isActive('heading', { level: 3 }) ? '3' :
                        editor.isActive('heading', { level: 4 }) ? '4' :
                        '0'
                    }
                    onChange={(e) => {
                        const level = parseInt(e.target.value);
                        if (level === 0) {
                            editor.chain().focus().setParagraph().run();
                        } else {
                            editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 }).run();
                        }
                    }}
                >
                    <option value="0">Text</option>
                    <option value="1">H1</option>
                    <option value="2">H2</option>
                    <option value="3">H3</option>
                    <option value="4">H4</option>
                </select>
                <div className="w-px h-4 bg-border mx-0.5" />
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }}
                    className={`px-1.5 py-0.5 rounded hover:bg-muted ${editor.isActive('bulletList') ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
                >List</button>
                <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }}
                    className={`px-1.5 py-0.5 rounded hover:bg-muted ${editor.isActive('blockquote') ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
                >Quote</button>
                <button
                    type="button"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        const url = window.prompt('Enter URL:');
                        if (url) {
                            editor.chain().focus().setLink({ href: url }).run();
                        }
                    }}
                    className={`px-1.5 py-0.5 rounded hover:bg-muted ${editor.isActive('link') ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
                >Link</button>
            </div>
        );
    }, [editor, isFocused]);

    return (
        <div ref={containerRef} className="group text-block-container" onFocus={handleContainerFocus} onBlur={handleContainerBlur}>
            {renderToolbar()}
            <div className="project-content">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
