'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getMediaItems, deleteMedia, uploadImage, type MediaItem } from '@/lib/media';
import { ImageCropper } from './ImageCropper';

interface MediaLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect?: (media: MediaItem) => void;
    mode?: 'select' | 'manage';
}

export function MediaLibrary({
    isOpen,
    onClose,
    onSelect,
    mode = 'select',
}: MediaLibraryProps) {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [uploadingFile, setUploadingFile] = useState<string | null>(null);
    const [cropperImage, setCropperImage] = useState<string | null>(null);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch media on mount
    const fetchMedia = useCallback(async () => {
        setIsLoading(true);
        const items = await getMediaItems();
        setMedia(items);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchMedia();
        }
    }, [isOpen, fetchMedia]);

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
        }

        setIsUploading(false);
        setPendingFile(null);
    };

    // Handle delete
    const handleDelete = async (item: MediaItem) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        setIsDeleting(true);
        const success = await deleteMedia(item.id, item.storage_path);

        if (success) {
            setMedia((prev) => prev.filter((m) => m.id !== item.id));
            if (selectedItem?.id === item.id) {
                setSelectedItem(null);
            }
        }

        setIsDeleting(false);
    };

    // Handle select
    const handleSelect = (item: MediaItem) => {
        if (mode === 'select' && onSelect) {
            onSelect(item);
            onClose();
        } else {
            setSelectedItem(item);
        }
    };

    // Filter media by search
    const filteredMedia = media.filter((item) =>
        item.original_filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.alt_text?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Format file size
    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card rounded-xl max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="border-b border-border px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h3 className="text-lg font-semibold">Media Library</h3>
                            <span className="text-sm text-muted-foreground">
                                {media.length} items
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
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
                            <button
                                onClick={onClose}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="border-b border-border px-6 py-3 flex items-center gap-4">
                        {/* Upload Button */}
                        <label className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg cursor-pointer hover:bg-primary/90 transition-colors">
                            {isUploading ? 'Uploading...' : 'Upload Image'}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                disabled={isUploading}
                                className="hidden"
                            />
                        </label>

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

                        {/* Refresh */}
                        <button
                            onClick={fetchMedia}
                            disabled={isLoading}
                            className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            ↻ Refresh
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-auto p-6">
                        {isLoading ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {[...Array(10)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="aspect-square bg-muted rounded-lg animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : filteredMedia.length === 0 ? (
                            <div className="text-center py-20 text-muted-foreground">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-lg font-medium mb-2">No media found</p>
                                <p className="text-sm">Upload images to get started</p>
                            </div>
                        ) : view === 'grid' ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {filteredMedia.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        whileHover={{ scale: 1.02 }}
                                        className={`group relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${selectedItem?.id === item.id
                                                ? 'border-primary'
                                                : 'border-transparent hover:border-primary/50'
                                            }`}
                                        onClick={() => handleSelect(item)}
                                    >
                                        <Image
                                            src={item.public_url}
                                            alt={item.alt_text || item.filename}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 50vw, 20vw"
                                        />
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors">
                                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white text-xs truncate">
                                                    {item.original_filename}
                                                </p>
                                                <p className="text-white/70 text-xs">
                                                    {item.width}×{item.height} · {formatSize(item.size_bytes)}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Delete Button */}
                                        {mode === 'manage' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(item);
                                                }}
                                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border text-left">
                                        <th className="pb-3 font-medium">Preview</th>
                                        <th className="pb-3 font-medium">Filename</th>
                                        <th className="pb-3 font-medium">Dimensions</th>
                                        <th className="pb-3 font-medium">Size</th>
                                        <th className="pb-3 font-medium">Date</th>
                                        <th className="pb-3"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMedia.map((item) => (
                                        <tr
                                            key={item.id}
                                            onClick={() => handleSelect(item)}
                                            className={`border-b border-border cursor-pointer transition-colors ${selectedItem?.id === item.id
                                                    ? 'bg-primary/10'
                                                    : 'hover:bg-muted/50'
                                                }`}
                                        >
                                            <td className="py-3">
                                                <div className="w-12 h-12 rounded overflow-hidden relative">
                                                    <Image
                                                        src={item.public_url}
                                                        alt={item.alt_text || item.filename}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-3">{item.original_filename}</td>
                                            <td className="py-3 text-muted-foreground">
                                                {item.width}×{item.height}
                                            </td>
                                            <td className="py-3 text-muted-foreground">
                                                {formatSize(item.size_bytes)}
                                            </td>
                                            <td className="py-3 text-muted-foreground">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-3">
                                                {mode === 'manage' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(item);
                                                        }}
                                                        className="text-red-500 hover:text-red-400"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Footer */}
                    {mode === 'select' && selectedItem && (
                        <div className="border-t border-border px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded overflow-hidden relative">
                                    <Image
                                        src={selectedItem.public_url}
                                        alt=""
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{selectedItem.original_filename}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {selectedItem.width}×{selectedItem.height} · {formatSize(selectedItem.size_bytes)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    if (onSelect) {
                                        onSelect(selectedItem);
                                        onClose();
                                    }
                                }}
                                className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90"
                            >
                                Insert Image
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>

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
        </AnimatePresence>
    );
}
