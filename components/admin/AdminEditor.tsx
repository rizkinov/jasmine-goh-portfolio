'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { Mark } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Heading from '@tiptap/extension-heading';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { common, createLowlight } from 'lowlight';
import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MediaLibrary } from './MediaLibrary';
import { ImageInsertDialog, type ImageInsertOptions, type ImageSize, type ImageRounded, type ImageShadow } from './ImageInsertDialog';
import { VideoInsertDialog, type VideoInsertOptions } from './VideoInsertDialog';
import { TableInsertDialog } from './TableInsertDialog';
import { isVideoFile, type MediaItem } from '@/lib/media';
import { Video } from '@/lib/tiptap-video';
import { Figure } from '@/lib/tiptap-figure';

// Create lowlight instance with common languages
const lowlight = createLowlight(common);

// Custom Caption mark for source/note text styling
const CaptionMark = Mark.create({
    name: 'caption',
    parseHTML() {
        return [{ tag: 'span.caption-text' }];
    },
    renderHTML({ HTMLAttributes }) {
        return ['span', { ...HTMLAttributes, class: 'caption-text' }, 0];
    },
});

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
    const [showHeadingMenu, setShowHeadingMenu] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [editingImage, setEditingImage] = useState<{
        src: string;
        alt: string;
        size: ImageSize;
        rounded: ImageRounded;
        shadow: ImageShadow;
        caption?: string;
        width?: number;
        height?: number;
    } | null>(null);
    const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);

    // Mount state for portal
    useEffect(() => {
        setMounted(true);
    }, []);

    const editor = useEditor({
        immediatelyRender: false, // Prevent SSR hydration mismatch
        extensions: [
            StarterKit.configure({
                heading: false, // We'll use our own heading config
                codeBlock: false, // We'll use code block with syntax highlighting
            }),
            Heading.configure({
                levels: [1, 2, 3, 4, 5, 6],
            }),
            Placeholder.configure({
                placeholder,
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-xl max-w-full my-8',
                },
            }),
            Video.configure({
                HTMLAttributes: {
                    class: 'rounded-xl max-w-full my-8',
                },
            }),
            Figure,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline underline-offset-4 hover:text-primary/80',
                },
            }),
            Underline,
            Highlight.configure({
                multicolor: false,
                HTMLAttributes: {
                    class: 'bg-primary/20 rounded px-1',
                },
            }),
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: 'bg-muted rounded-xl p-4 my-6 overflow-x-auto text-sm font-mono',
                },
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'border-collapse my-8 w-full',
                },
            }),
            TableRow.configure({
                HTMLAttributes: {
                    class: 'border-b border-border',
                },
            }),
            TableHeader.configure({
                HTMLAttributes: {
                    class: 'border-b-2 border-border bg-muted/50 p-3 text-left font-semibold text-foreground',
                },
            }),
            TableCell.configure({
                HTMLAttributes: {
                    class: 'border-b border-border p-3 text-muted-foreground',
                },
            }),
            CaptionMark,
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: 'prose prose-neutral dark:prose-invert max-w-none focus:outline-none min-h-[400px] px-6 py-4',
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

    // Handle final image insertion with styling options
    const handleImageInsert = useCallback((options: ImageInsertOptions) => {
        if (!editor) return;

        // Use the custom Figure extension to properly persist classes
        editor.chain().focus().setFigure({
            src: options.src,
            alt: options.alt,
            width: options.width,
            height: options.height,
            size: options.size,
            rounded: options.rounded,
            shadow: options.shadow,
            caption: options.caption,
        }).run();

        setSelectedMedia(null);
    }, [editor]);

    // Handle video insertion with options
    const handleVideoInsert = useCallback((options: VideoInsertOptions) => {
        if (!editor) return;

        editor.chain().focus().setVideo({
            src: options.src,
            width: options.width,
            height: options.height,
            autoplay: options.autoplay,
            loop: options.loop,
            muted: options.muted,
            controls: options.controls,
        }).run();

        setSelectedMedia(null);
    }, [editor]);

    // Insert table helper
    const insertTable = useCallback((rows: number, cols: number, withHeaderRow: boolean, equalColumns: boolean) => {
        if (!editor) return;
        editor.chain().focus().insertTable({ rows, cols, withHeaderRow }).run();

        // If equalColumns is true, set equal percentage width on each column
        if (equalColumns) {
            // Use setTimeout to ensure the table is inserted before we update it
            setTimeout(() => {
                const { state, view } = editor;
                let { tr } = state;

                // Calculate the width for each column (TipTap uses pixels, we'll use a base width)
                const colWidth = Math.floor(1000 / cols);

                // Collect all positions first to avoid issues with changing positions
                const cellUpdates: { pos: number; attrs: Record<string, unknown> }[] = [];
                const tableUpdates: { pos: number; attrs: Record<string, unknown> }[] = [];

                state.doc.descendants((node, pos) => {
                    if (node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
                        cellUpdates.push({
                            pos,
                            attrs: { ...node.attrs, colwidth: null },
                        });
                    }
                    if (node.type.name === 'table') {
                        const existingClass = node.attrs.class || '';
                        if (!existingClass.includes('table-equal-cols')) {
                            tableUpdates.push({
                                pos,
                                attrs: {
                                    ...node.attrs,
                                    class: existingClass ? `${existingClass} table-equal-cols` : 'table-equal-cols',
                                },
                            });
                        }
                    }
                });

                // Apply updates in reverse order (from end to start) to preserve positions
                [...cellUpdates, ...tableUpdates]
                    .sort((a, b) => b.pos - a.pos)
                    .forEach(({ pos, attrs }) => {
                        const node = tr.doc.nodeAt(pos);
                        if (node) {
                            tr = tr.setNodeMarkup(pos, undefined, attrs);
                        }
                    });

                view.dispatch(tr);
            }, 10);
        }

        setIsTableDialogOpen(false);
    }, [editor]);

    // Parse image classes to extract styling options
    const parseImageClasses = useCallback((classes: string[]): { size: ImageSize; rounded: ImageRounded; shadow: ImageShadow } => {
        let size: ImageSize = 'l';
        let rounded: ImageRounded = 'none';
        let shadow: ImageShadow = 'none';

        for (const cls of classes) {
            if (cls.startsWith('img-size-')) {
                const val = cls.replace('img-size-', '') as ImageSize;
                if (['xl', 'l', 'm', 's'].includes(val)) size = val;
            }
            if (cls.startsWith('img-rounded-')) {
                const val = cls.replace('img-rounded-', '') as ImageRounded;
                if (['sm', 'md', 'lg'].includes(val)) rounded = val;
            }
            if (cls.startsWith('img-shadow-')) {
                const val = cls.replace('img-shadow-', '') as ImageShadow;
                if (['sm', 'md', 'lg'].includes(val)) shadow = val;
            }
        }

        return { size, rounded, shadow };
    }, []);

    // Handle click on editor to detect figure/image clicks
    const handleEditorClick = useCallback((e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        const figure = target.closest('figure');

        if (figure) {
            const img = figure.querySelector('img');
            const figcaption = figure.querySelector('figcaption');

            if (img) {
                const classes = Array.from(figure.classList);
                const { size, rounded, shadow } = parseImageClasses(classes);

                setEditingImage({
                    src: img.src,
                    alt: img.alt || '',
                    size,
                    rounded,
                    shadow,
                    caption: figcaption?.textContent || undefined,
                    width: img.width || undefined,
                    height: img.height || undefined,
                });
            }
        }
    }, [parseImageClasses]);

    // Handle editing existing image
    const handleEditImage = useCallback((options: ImageInsertOptions) => {
        if (!editor || !editingImage) return;

        // Find and replace the figure in the editor
        const html = editor.getHTML();

        // Build new figure HTML using the same format as the Figure extension
        const classes = [
            `img-size-${options.size}`,
            `img-rounded-${options.rounded}`,
            `img-shadow-${options.shadow}`
        ].join(' ');

        const imgAttrs = `src="${options.src}" alt="${options.alt}"${options.width ? ` width="${options.width}"` : ''}${options.height ? ` height="${options.height}"` : ''}`;

        const newFigureHtml = options.caption
            ? `<figure class="${classes}"><img ${imgAttrs}><figcaption>${options.caption}</figcaption></figure>`
            : `<figure class="${classes}"><img ${imgAttrs}></figure>`;

        // Find the figure containing the image with matching src and replace it
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const figures = doc.querySelectorAll('figure');

        // Extract just the pathname for comparison (handles full URLs vs relative paths)
        const getPathname = (src: string) => {
            try {
                return new URL(src, window.location.origin).pathname;
            } catch {
                return src;
            }
        };

        const editingSrcPath = getPathname(editingImage.src);

        for (const fig of figures) {
            const img = fig.querySelector('img');
            if (img) {
                const imgSrcPath = getPathname(img.getAttribute('src') || '');
                if (imgSrcPath === editingSrcPath) {
                    fig.outerHTML = newFigureHtml;
                    break;
                }
            }
        }

        // Update editor content - the Figure extension will re-parse this
        editor.commands.setContent(doc.body.innerHTML);
        setEditingImage(null);
    }, [editor, editingImage]);

    if (!editor) {
        return (
            <div className="animate-pulse bg-muted rounded-xl h-[500px]" />
        );
    }

    return (
        <div className="border border-border rounded-xl bg-card">
            {/* Toolbar - Sticky below admin header (65px) */}
            <div className="border-b border-border bg-muted/30 px-3 py-2 flex flex-wrap items-center gap-0.5 sticky top-[65px] z-20 backdrop-blur-sm">
                {/* Text Formatting Group */}
                <div className="flex items-center gap-0.5 bg-background/50 rounded-lg p-1">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Bold (Ctrl+B)"
                    >
                        <span className="font-bold text-xs">B</span>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Italic (Ctrl+I)"
                    >
                        <span className="italic text-xs">I</span>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive('underline')}
                        title="Underline (Ctrl+U)"
                    >
                        <span className="underline text-xs">U</span>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        title="Strikethrough"
                    >
                        <span className="line-through text-xs">S</span>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        isActive={editor.isActive('highlight')}
                        title="Highlight"
                    >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 5a5 5 0 0110 0v2A5 5 0 015 7V5zM0 16.68A19.9 19.9 0 0110 14c3.64 0 7.06.97 10 2.68V20H0v-3.32z" />
                        </svg>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleMark('caption').run()}
                        isActive={editor.isActive('caption')}
                        title="Caption/Source (smaller italic text)"
                    >
                        <span className="text-[10px] italic opacity-70">Src</span>
                    </ToolbarButton>
                </div>

                <ToolbarDivider />

                {/* Headings Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowHeadingMenu(!showHeadingMenu)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${editor.isActive('heading')
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background/50 hover:bg-muted text-foreground'
                            }`}
                    >
                        <span className="font-serif">Heading</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {showHeadingMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowHeadingMenu(false)} />
                            <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-20 py-1 min-w-[140px]">
                                <HeadingMenuItem
                                    onClick={() => { editor.chain().focus().setParagraph().run(); setShowHeadingMenu(false); }}
                                    isActive={editor.isActive('paragraph')}
                                >
                                    <span className="text-sm">Paragraph</span>
                                </HeadingMenuItem>
                                {[1, 2, 3, 4, 5, 6].map((level) => (
                                    <HeadingMenuItem
                                        key={level}
                                        onClick={() => { editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run(); setShowHeadingMenu(false); }}
                                        isActive={editor.isActive('heading', { level })}
                                    >
                                        <span className={`font-serif ${level === 1 ? 'text-xl' :
                                            level === 2 ? 'text-lg' :
                                                level === 3 ? 'text-base' :
                                                    level === 4 ? 'text-sm' :
                                                        'text-xs'
                                            }`}>
                                            Heading {level}
                                        </span>
                                    </HeadingMenuItem>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <ToolbarDivider />

                {/* Lists Group */}
                <div className="flex items-center gap-0.5 bg-background/50 rounded-lg p-1">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="Bullet List"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title="Numbered List"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10M7 16h10M3 8h.01M3 12h.01M3 16h.01" />
                        </svg>
                    </ToolbarButton>
                </div>

                <ToolbarDivider />

                {/* Block Elements Group */}
                <div className="flex items-center gap-0.5 bg-background/50 rounded-lg p-1">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        title="Quote"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        isActive={editor.isActive('codeBlock')}
                        title="Code Block"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        title="Divider"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                        </svg>
                    </ToolbarButton>
                </div>

                <ToolbarDivider />

                {/* Table */}
                <ToolbarButton
                    onClick={() => setIsTableDialogOpen(true)}
                    isActive={editor.isActive('table')}
                    title="Insert Table"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </ToolbarButton>

                <ToolbarDivider />

                {/* Link & Media Group */}
                <div className="flex items-center gap-0.5 bg-background/50 rounded-lg p-1">
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
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    </ToolbarButton>
                    {editor.isActive('link') && (
                        <ToolbarButton
                            onClick={() => editor.chain().focus().unsetLink().run()}
                            title="Remove Link"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </ToolbarButton>
                    )}
                    <ToolbarButton
                        onClick={() => setIsMediaLibraryOpen(true)}
                        title="Insert Image/Video"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </ToolbarButton>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Save Button */}
                {onSave && (
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors tracking-wide"
                    >
                        {isSaving ? 'Saving...' : 'Save Content'}
                    </button>
                )}
            </div>

            {/* Table Controls (shown when table is active) */}
            {editor.isActive('table') && (
                <div className="border-b border-border bg-muted/20 px-3 py-2 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium">Table:</span>
                    <button
                        onClick={() => editor.chain().focus().addColumnBefore().run()}
                        className="px-2 py-1 text-xs bg-background rounded hover:bg-muted transition-colors"
                    >
                        + Col Before
                    </button>
                    <button
                        onClick={() => editor.chain().focus().addColumnAfter().run()}
                        className="px-2 py-1 text-xs bg-background rounded hover:bg-muted transition-colors"
                    >
                        + Col After
                    </button>
                    <button
                        onClick={() => editor.chain().focus().addRowBefore().run()}
                        className="px-2 py-1 text-xs bg-background rounded hover:bg-muted transition-colors"
                    >
                        + Row Before
                    </button>
                    <button
                        onClick={() => editor.chain().focus().addRowAfter().run()}
                        className="px-2 py-1 text-xs bg-background rounded hover:bg-muted transition-colors"
                    >
                        + Row After
                    </button>
                    <div className="w-px h-4 bg-border mx-1" />
                    <button
                        onClick={() => editor.chain().focus().deleteColumn().run()}
                        className="px-2 py-1 text-xs bg-background rounded hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                        Delete Col
                    </button>
                    <button
                        onClick={() => editor.chain().focus().deleteRow().run()}
                        className="px-2 py-1 text-xs bg-background rounded hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                        Delete Row
                    </button>
                    <button
                        onClick={() => editor.chain().focus().deleteTable().run()}
                        className="px-2 py-1 text-xs bg-background rounded hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                        Delete Table
                    </button>
                </div>
            )}

            {/* Editor Content */}
            <div onClick={handleEditorClick}>
                <EditorContent editor={editor} className="editor-content" />
            </div>

            {/* Footer */}
            <div className="border-t border-border bg-muted/20 px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                    {editor.storage.characterCount?.characters?.() ?? editor.getText().length} characters
                </span>
                <span className="font-serif text-primary/60">Editorial Mode</span>
            </div>

            {/* Dialogs rendered via portal to escape transform containing block */}
            {mounted && createPortal(
                <>
                    {/* Media Library Modal */}
                    <MediaLibrary
                        isOpen={isMediaLibraryOpen}
                        onClose={() => setIsMediaLibraryOpen(false)}
                        onSelect={handleMediaSelect}
                        mode="select"
                    />

                    {/* Image Insert Dialog (for new images) */}
                    {selectedMedia && !isVideoFile(selectedMedia.mime_type) && (
                        <ImageInsertDialog
                            isOpen={!!selectedMedia}
                            onClose={() => setSelectedMedia(null)}
                            onInsert={handleImageInsert}
                            media={selectedMedia}
                        />
                    )}

                    {/* Video Insert Dialog */}
                    {selectedMedia && isVideoFile(selectedMedia.mime_type) && (
                        <VideoInsertDialog
                            isOpen={!!selectedMedia}
                            onClose={() => setSelectedMedia(null)}
                            onInsert={handleVideoInsert}
                            media={selectedMedia}
                        />
                    )}

                    {/* Image Edit Dialog (for existing images) */}
                    {editingImage && (
                        <ImageInsertDialog
                            isOpen={!!editingImage}
                            onClose={() => setEditingImage(null)}
                            onInsert={handleEditImage}
                            editingImage={editingImage}
                        />
                    )}

                    {/* Table Insert Dialog */}
                    <TableInsertDialog
                        isOpen={isTableDialogOpen}
                        onClose={() => setIsTableDialogOpen(false)}
                        onInsert={insertTable}
                    />
                </>,
                document.body
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
            className={`p-1.5 rounded-md text-sm transition-colors ${isActive
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
    return <div className="w-px h-5 bg-border/50 mx-1.5" />;
}

// Heading Menu Item Component
function HeadingMenuItem({
    onClick,
    isActive,
    children
}: {
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={`w-full px-3 py-2 text-left transition-colors ${isActive
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-muted text-foreground'
                }`}
        >
            {children}
        </button>
    );
}
