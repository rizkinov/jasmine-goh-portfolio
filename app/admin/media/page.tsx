'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getMediaItems, deleteMedia, uploadImage, updateMediaAltText, type MediaItem } from '@/lib/media';
import { ImageCropper } from '@/components/admin/ImageCropper';

export default function MediaPage() {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
    const [cropperImage, setCropperImage] = useState<string | null>(null);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch media on mount
    const fetchMedia = useCallback(async () => {
        setIsLoading(true);
        const items = await getMediaItems();
        setMedia(items);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchMedia();
    }, [fetchMedia]);

    // Handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show cropper
        const reader = new FileReader();
        reader.onload = () => {
            setCropperImage(reader.result as string);
            setPendingFile(file);
        };
        reader.readAsDataURL(file);

        // Reset input
        e.target.value = '';
    };

    // Handle crop complete
    const handleCropComplete = async (croppedBlob: Blob) => {
        if (!pendingFile) return;

        setIsUploading(true);
        setCropperImage(null);

        const result = await uploadImage(croppedBlob, pendingFile.name);

        if (result.success && result.media) {
            setMedia((prev) => [result.media!, ...prev]);
        } else {
            console.error('Upload failed:', result.error);
            alert('Upload failed: ' + result.error);
        }

        setIsUploading(false);
        setPendingFile(null);
    };

    // Handle delete
    const handleDelete = async (items: MediaItem[]) => {
        if (!confirm(`Are you sure you want to delete ${items.length} image(s)?`)) return;

        for (const item of items) {
            const success = await deleteMedia(item.id, item.storage_path);
            if (success) {
                setMedia((prev) => prev.filter((m) => m.id !== item.id));
            }
        }
        setSelectedItems(new Set());
    };

    // Handle alt text update
    const handleAltTextUpdate = async (id: string, altText: string) => {
        const success = await updateMediaAltText(id, altText);
        if (success) {
            setMedia((prev) =>
                prev.map((m) => (m.id === id ? { ...m, alt_text: altText } : m))
            );
        }
    };

    // Toggle selection
    const toggleSelection = (id: string) => {
        const newSelection = new Set(selectedItems);
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        setSelectedItems(newSelection);
    };

    // Select all
    const selectAll = () => {
        if (selectedItems.size === filteredMedia.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(filteredMedia.map((m) => m.id)));
        }
    };

    // Copy URL to clipboard
    const copyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
    };

    // Filter and sort media
    const filteredMedia = media
        .filter((item) =>
            item.original_filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.alt_text?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.original_filename.localeCompare(b.original_filename);
                case 'size':
                    return b.size_bytes - a.size_bytes;
                case 'date':
                default:
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
        });

    // Format file size
    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    // Format date
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Total storage used
    const totalStorage = media.reduce((acc, m) => acc + m.size_bytes, 0);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card sticky top-0 z-40">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            ← Back to Admin
                        </Link>
                        <h1 className="text-lg font-semibold">Media Library</h1>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{media.length} files</span>
                        <span>•</span>
                        <span>{formatSize(totalStorage)} used</span>
                    </div>
                </div>
            </header>

            {/* Toolbar */}
            <div className="border-b border-border bg-card px-6 py-3 flex items-center gap-4 flex-wrap">
                {/* Upload Button */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                {/* Search */}
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search media..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full max-w-xs px-4 py-2 bg-muted border border-border rounded-lg text-sm"
                    />
                </div>

                {/* Sort */}
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'size')}
                    className="px-3 py-2 bg-muted border border-border rounded-lg text-sm"
                >
                    <option value="date">Sort by Date</option>
                    <option value="name">Sort by Name</option>
                    <option value="size">Sort by Size</option>
                </select>

                {/* View Toggle */}
                <div className="flex bg-muted rounded-lg p-1">
                    <button
                        onClick={() => setView('grid')}
                        className={`px-3 py-1 rounded text-sm ${view === 'grid'
                                ? 'bg-background shadow-sm'
                                : 'text-muted-foreground'
                            }`}
                    >
                        Grid
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`px-3 py-1 rounded text-sm ${view === 'list'
                                ? 'bg-background shadow-sm'
                                : 'text-muted-foreground'
                            }`}
                    >
                        List
                    </button>
                </div>

                {/* Refresh */}
                <button
                    onClick={fetchMedia}
                    disabled={isLoading}
                    className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    ↻ Refresh
                </button>
            </div>

            {/* Bulk Actions */}
            {selectedItems.size > 0 && (
                <div className="border-b border-border bg-primary/5 px-6 py-3 flex items-center gap-4">
                    <span className="text-sm font-medium">
                        {selectedItems.size} selected
                    </span>
                    <button
                        onClick={() =>
                            handleDelete(
                                media.filter((m) => selectedItems.has(m.id))
                            )
                        }
                        className="px-3 py-1 text-sm text-red-500 hover:text-red-400"
                    >
                        Delete Selected
                    </button>
                    <button
                        onClick={() => setSelectedItems(new Set())}
                        className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                        Clear Selection
                    </button>
                </div>
            )}

            {/* Content */}
            <div className="p-6">
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="aspect-square bg-muted rounded-lg animate-pulse"
                            />
                        ))}
                    </div>
                ) : filteredMedia.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-lg font-medium mb-2">No media found</p>
                        <p className="text-sm mb-6">Upload images to get started</p>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90"
                        >
                            Upload Your First Image
                        </button>
                    </div>
                ) : view === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filteredMedia.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`group relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${selectedItems.has(item.id)
                                        ? 'border-primary ring-2 ring-primary/20'
                                        : 'border-transparent hover:border-primary/50'
                                    }`}
                            >
                                <Image
                                    src={item.public_url}
                                    alt={item.alt_text || item.filename}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 16vw"
                                />

                                {/* Selection Checkbox */}
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSelection(item.id);
                                    }}
                                    className={`absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedItems.has(item.id)
                                            ? 'bg-primary border-primary text-primary-foreground'
                                            : 'bg-white/80 border-white/50 opacity-0 group-hover:opacity-100'
                                        }`}
                                >
                                    {selectedItems.has(item.id) && '✓'}
                                </div>

                                {/* Overlay */}
                                <div
                                    onClick={() => setEditingItem(item)}
                                    className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center"
                                >
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                copyUrl(item.public_url);
                                            }}
                                            className="p-2 bg-white/90 rounded-lg text-xs"
                                            title="Copy URL"
                                        >
                                            📋
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete([item]);
                                            }}
                                            className="p-2 bg-red-500 text-white rounded-lg text-xs"
                                            title="Delete"
                                        >
                                            🗑
                                        </button>
                                    </div>
                                </div>

                                {/* Info Footer */}
                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-white text-xs truncate">
                                        {item.original_filename}
                                    </p>
                                    <p className="text-white/70 text-xs">
                                        {item.width}×{item.height}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-card rounded-lg border border-border overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border text-left bg-muted/30">
                                    <th className="p-3 w-10">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.size === filteredMedia.length}
                                            onChange={selectAll}
                                            className="rounded"
                                        />
                                    </th>
                                    <th className="p-3 w-16">Preview</th>
                                    <th className="p-3 font-medium">Filename</th>
                                    <th className="p-3 font-medium">Alt Text</th>
                                    <th className="p-3 font-medium">Dimensions</th>
                                    <th className="p-3 font-medium">Size</th>
                                    <th className="p-3 font-medium">Date</th>
                                    <th className="p-3 w-24">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMedia.map((item) => (
                                    <tr
                                        key={item.id}
                                        className={`border-b border-border transition-colors ${selectedItems.has(item.id)
                                                ? 'bg-primary/5'
                                                : 'hover:bg-muted/50'
                                            }`}
                                    >
                                        <td className="p-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.has(item.id)}
                                                onChange={() => toggleSelection(item.id)}
                                                className="rounded"
                                            />
                                        </td>
                                        <td className="p-3">
                                            <div
                                                className="w-12 h-12 rounded overflow-hidden relative cursor-pointer"
                                                onClick={() => setEditingItem(item)}
                                            >
                                                <Image
                                                    src={item.public_url}
                                                    alt={item.alt_text || item.filename}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <span className="truncate block max-w-[200px]">
                                                {item.original_filename}
                                            </span>
                                        </td>
                                        <td className="p-3 text-muted-foreground">
                                            <span className="truncate block max-w-[150px]">
                                                {item.alt_text || '—'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-muted-foreground">
                                            {item.width}×{item.height}
                                        </td>
                                        <td className="p-3 text-muted-foreground">
                                            {formatSize(item.size_bytes)}
                                        </td>
                                        <td className="p-3 text-muted-foreground">
                                            {formatDate(item.created_at)}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => copyUrl(item.public_url)}
                                                    className="text-muted-foreground hover:text-foreground"
                                                    title="Copy URL"
                                                >
                                                    📋
                                                </button>
                                                <button
                                                    onClick={() => handleDelete([item])}
                                                    className="text-red-500 hover:text-red-400"
                                                    title="Delete"
                                                >
                                                    🗑
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Image Detail Modal */}
            <AnimatePresence>
                {editingItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
                        onClick={() => setEditingItem(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card rounded-xl max-w-3xl w-full max-h-[85vh] overflow-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="border-b border-border px-6 py-4 flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Image Details</h3>
                                <button
                                    onClick={() => setEditingItem(null)}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Preview */}
                                <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-center">
                                    <div className="relative max-w-full max-h-[400px]">
                                        <Image
                                            src={editingItem.public_url}
                                            alt={editingItem.alt_text || editingItem.filename}
                                            width={editingItem.width || 400}
                                            height={editingItem.height || 300}
                                            className="rounded-lg object-contain max-h-[400px] w-auto"
                                        />
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Filename
                                        </label>
                                        <p className="text-sm text-muted-foreground">
                                            {editingItem.original_filename}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Dimensions
                                        </label>
                                        <p className="text-sm text-muted-foreground">
                                            {editingItem.width} × {editingItem.height} px
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Size
                                        </label>
                                        <p className="text-sm text-muted-foreground">
                                            {formatSize(editingItem.size_bytes)}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            MIME Type
                                        </label>
                                        <p className="text-sm text-muted-foreground">
                                            {editingItem.mime_type}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Uploaded
                                        </label>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(editingItem.created_at)}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Alt Text
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue={editingItem.alt_text || ''}
                                            onBlur={(e) =>
                                                handleAltTextUpdate(editingItem.id, e.target.value)
                                            }
                                            placeholder="Describe this image..."
                                            className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            URL
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={editingItem.public_url}
                                                readOnly
                                                className="flex-1 px-3 py-2 bg-muted border border-border rounded-lg text-sm text-muted-foreground"
                                            />
                                            <button
                                                onClick={() => copyUrl(editingItem.public_url)}
                                                className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-2">
                                        <button
                                            onClick={() => {
                                                handleDelete([editingItem]);
                                                setEditingItem(null);
                                            }}
                                            className="px-4 py-2 text-sm text-red-500 hover:text-red-400"
                                        >
                                            Delete Image
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Image Cropper Modal */}
            {cropperImage && (
                <ImageCropper
                    imageSrc={cropperImage}
                    onCropComplete={handleCropComplete}
                    onCancel={() => {
                        setCropperImage(null);
                        setPendingFile(null);
                    }}
                />
            )}
        </div>
    );
}
