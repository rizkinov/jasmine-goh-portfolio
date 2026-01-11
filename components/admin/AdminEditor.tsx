'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Heading from '@tiptap/extension-heading';
import { useState, useCallback } from 'react';
import { MediaLibrary } from './MediaLibrary';
import { ImageInsertDialog } from './ImageInsertDialog';
import type { MediaItem } from '@/lib/media';

interface AdminEditorProps {
    initialContent?: string;
    onSave?: (content: string) => Promise<void>;
    placeholder?: string;
}

export function AdminEditor({
    initialContent = '',
    onSave,
    placeholder = 'Start writing your content...'
}: AdminEditorProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

    const editor = useEditor({
        immediatelyRender: false, // Prevent SSR hydration mismatch
        extensions: [
            StarterKit.configure({
                heading: false, // We'll use our own heading config
            }),
            Heading.configure({
                levels: [2, 3, 4],
            }),
            Placeholder.configure({
                placeholder,
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline underline-offset-4',
                },
            }),
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: 'prose prose-neutral dark:prose-invert max-w-none focus:outline-none min-h-[400px] px-4 py-3',
            },
        },
    });

    const handleSave = useCallback(async () => {
        if (!editor || !onSave) return;

        setIsSaving(true);
        try {
            const html = editor.getHTML();
            await onSave(html);
        } catch (error) {
            console.error('Error saving content:', error);
        } finally {
            setIsSaving(false);
        }
    }, [editor, onSave]);

    // Handle media selection from library
    const handleMediaSelect = useCallback((media: MediaItem) => {
        setSelectedMedia(media);
        setIsMediaLibraryOpen(false);
    }, []);

    // Handle final image insertion with dimensions
    const handleImageInsert = useCallback((src: string, alt: string, width?: number, height?: number) => {
        if (!editor) return;

        // Insert image with inline styles for dimensions
        editor.chain().focus().setImage({
            src,
            alt,
            width: width,
            height: height,
        }).run();

        setSelectedMedia(null);
    }, [editor]);

    if (!editor) {
        return (
            <div className="animate-pulse bg-muted rounded-lg h-[500px]" />
        );
    }

    return (
        <div className="border border-border rounded-xl overflow-hidden bg-card">
            {/* Toolbar */}
            <div className="border-b border-border bg-muted/50 px-4 py-2 flex flex-wrap items-center gap-1">
                {/* Text Formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Bold"
                >
                    <span className="font-bold">B</span>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Italic"
                >
                    <span className="italic">I</span>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    title="Strikethrough"
                >
                    <span className="line-through">S</span>
                </ToolbarButton>

                <ToolbarDivider />

                {/* Headings */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="Heading 2"
                >
                    H2
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    title="Heading 3"
                >
                    H3
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                    isActive={editor.isActive('heading', { level: 4 })}
                    title="Heading 4"
                >
                    H4
                </ToolbarButton>

                <ToolbarDivider />

                {/* Lists */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Numbered List"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10M7 16h10M3 8h.01M3 12h.01M3 16h.01" />
                    </svg>
                </ToolbarButton>

                <ToolbarDivider />

                {/* Block Elements */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    title="Quote"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="Horizontal Rule"
                >
                    —
                </ToolbarButton>

                <ToolbarDivider />

                {/* Link */}
                <ToolbarButton
                    onClick={() => {
                        const url = window.prompt('Enter URL:');
                        if (url) {
                            editor.chain().focus().setLink({ href: url }).run();
                        }
                    }}
                    isActive={editor.isActive('link')}
                    title="Add Link"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                </ToolbarButton>

                <ToolbarDivider />

                {/* Image */}
                <ToolbarButton
                    onClick={() => setIsMediaLibraryOpen(true)}
                    title="Insert Image"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </ToolbarButton>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Save Button */}
                {onSave && (
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                )}
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />

            {/* Character Count */}
            <div className="border-t border-border bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
                {editor.storage.characterCount?.characters?.() ?? editor.getText().length} characters
            </div>

            {/* Media Library Modal */}
            <MediaLibrary
                isOpen={isMediaLibraryOpen}
                onClose={() => setIsMediaLibraryOpen(false)}
                onSelect={handleMediaSelect}
                mode="select"
            />

            {/* Image Insert Dialog */}
            {selectedMedia && (
                <ImageInsertDialog
                    isOpen={!!selectedMedia}
                    onClose={() => setSelectedMedia(null)}
                    onInsert={handleImageInsert}
                    media={selectedMedia}
                />
            )}
        </div>
    );
}

// Toolbar Button Component
function ToolbarButton({
    onClick,
    isActive = false,
    title,
    children
}: {
    onClick: () => void;
    isActive?: boolean;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            title={title}
            className={`p-2 rounded-lg text-sm transition-colors ${isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-foreground'
                }`}
        >
            {children}
        </button>
    );
}

// Toolbar Divider Component
function ToolbarDivider() {
    return <div className="w-px h-6 bg-border mx-1" />;
}
