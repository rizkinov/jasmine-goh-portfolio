'use client';

import { useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';

const lowlight = createLowlight(common);

interface CodeBlockEditorProps {
    content: string;
    onChange: (html: string) => void;
}

export function CodeBlockEditor({ content, onChange }: CodeBlockEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                codeBlock: false,
            }),
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: 'bg-muted rounded-xl p-4 my-4 overflow-x-auto text-sm font-mono',
                },
            }),
        ],
        content: content || '<pre><code></code></pre>',
        editorProps: {
            attributes: {
                class: 'prose prose-neutral dark:prose-invert max-w-none focus:outline-none min-h-[2rem]',
            },
        },
        onUpdate: ({ editor: ed }) => {
            onChange(ed.getHTML());
        },
    });

    const prevContentRef = useRef(content);
    useEffect(() => {
        if (editor && content !== prevContentRef.current && content !== editor.getHTML()) {
            editor.commands.setContent(content, { emitUpdate: false });
        }
        prevContentRef.current = content;
    }, [content, editor]);

    return (
        <div className="code-block-container">
            <div className="project-content">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
