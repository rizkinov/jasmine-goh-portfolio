import { supabase } from './supabase';

export interface MediaItem {
    id: string;
    filename: string;
    original_filename: string;
    storage_path: string;
    public_url: string;
    mime_type: string;
    size_bytes: number;
    width: number | null;
    height: number | null;
    duration: number | null; // Video duration in seconds
    alt_text: string | null;
    created_at: string;
    updated_at: string;
}

export interface UploadResult {
    success: boolean;
    media?: MediaItem;
    error?: string;
}

// Generate a unique filename
function generateFilename(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    return `${timestamp}-${random}.${extension}`;
}

// Get image dimensions from a blob
async function getImageDimensions(blob: Blob): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
            URL.revokeObjectURL(img.src);
        };
        img.onerror = () => {
            resolve({ width: 0, height: 0 });
            URL.revokeObjectURL(img.src);
        };
        img.src = URL.createObjectURL(blob);
    });
}

// Get video dimensions and duration from a blob
async function getVideoMetadata(blob: Blob): Promise<{ width: number; height: number; duration: number }> {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            resolve({
                width: video.videoWidth,
                height: video.videoHeight,
                duration: Math.round(video.duration)
            });
            URL.revokeObjectURL(video.src);
        };
        video.onerror = () => {
            resolve({ width: 0, height: 0, duration: 0 });
            URL.revokeObjectURL(video.src);
        };
        video.src = URL.createObjectURL(blob);
    });
}

// Check if file is a video based on MIME type
export function isVideoFile(mimeType: string): boolean {
    return mimeType.startsWith('video/');
}

// Upload image to Supabase Storage
export async function uploadImage(
    file: File | Blob,
    originalFilename: string,
    altText?: string
): Promise<UploadResult> {
    if (!supabase) {
        return { success: false, error: 'Supabase is not configured' };
    }

    try {
        const filename = generateFilename(originalFilename);
        const storagePath = `uploads/${filename}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(storagePath, file, {
                contentType: file.type || 'image/jpeg',
                cacheControl: '31536000', // 1 year cache
            });

        if (uploadError) {
            console.error('Storage upload error:', uploadError);
            return { success: false, error: uploadError.message };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('media')
            .getPublicUrl(storagePath);

        const publicUrl = urlData.publicUrl;

        // Get image dimensions
        const dimensions = await getImageDimensions(file);

        // Insert into media table
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: mediaData, error: dbError } = await (supabase as any)
            .from('media')
            .insert({
                filename,
                original_filename: originalFilename,
                storage_path: storagePath,
                public_url: publicUrl,
                mime_type: file.type || 'image/jpeg',
                size_bytes: file.size,
                width: dimensions.width || null,
                height: dimensions.height || null,
                alt_text: altText || null,
            })
            .select()
            .single();

        if (dbError) {
            console.error('Database insert error:', dbError);
            // Try to clean up the uploaded file
            await supabase.storage.from('media').remove([storagePath]);
            return { success: false, error: dbError.message };
        }

        return { success: true, media: mediaData };
    } catch (error) {
        console.error('Upload error:', error);
        return { success: false, error: 'Failed to upload image' };
    }
}

// Upload video to Supabase Storage
export async function uploadVideo(
    file: File | Blob,
    originalFilename: string,
    altText?: string
): Promise<UploadResult> {
    if (!supabase) {
        return { success: false, error: 'Supabase is not configured' };
    }

    try {
        const filename = generateFilename(originalFilename);
        const storagePath = `uploads/${filename}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
            .from('media')
            .upload(storagePath, file, {
                contentType: file.type || 'video/mp4',
                cacheControl: '31536000', // 1 year cache
            });

        if (uploadError) {
            console.error('Storage upload error:', uploadError);
            return { success: false, error: uploadError.message };
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('media')
            .getPublicUrl(storagePath);

        const publicUrl = urlData.publicUrl;

        // Get video dimensions and duration
        const metadata = await getVideoMetadata(file);

        // Insert into media table
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: mediaData, error: dbError } = await (supabase as any)
            .from('media')
            .insert({
                filename,
                original_filename: originalFilename,
                storage_path: storagePath,
                public_url: publicUrl,
                mime_type: file.type || 'video/mp4',
                size_bytes: file.size,
                width: metadata.width || null,
                height: metadata.height || null,
                duration: metadata.duration || null,
                alt_text: altText || null,
            })
            .select()
            .single();

        if (dbError) {
            console.error('Database insert error:', dbError);
            // Try to clean up the uploaded file
            await supabase.storage.from('media').remove([storagePath]);
            return { success: false, error: dbError.message };
        }

        return { success: true, media: mediaData };
    } catch (error) {
        console.error('Upload error:', error);
        return { success: false, error: 'Failed to upload video' };
    }
}

// Unified upload function that detects file type
export async function uploadMedia(
    file: File | Blob,
    originalFilename: string,
    altText?: string
): Promise<UploadResult> {
    const mimeType = file.type || '';

    if (isVideoFile(mimeType)) {
        return uploadVideo(file, originalFilename, altText);
    } else {
        return uploadImage(file, originalFilename, altText);
    }
}

// Get all media items
export async function getMediaItems(): Promise<MediaItem[]> {
    if (!supabase) {
        return [];
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('media')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching media:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error fetching media:', error);
        return [];
    }
}

// Delete a media item
export async function deleteMedia(id: string, storagePath: string): Promise<boolean> {
    if (!supabase) {
        return false;
    }

    try {
        // Delete from storage
        const { error: storageError } = await supabase.storage
            .from('media')
            .remove([storagePath]);

        if (storageError) {
            console.error('Storage delete error:', storageError);
        }

        // Delete from database
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: dbError } = await (supabase as any)
            .from('media')
            .delete()
            .eq('id', id);

        if (dbError) {
            console.error('Database delete error:', dbError);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Delete error:', error);
        return false;
    }
}

// Get media by original filename (case-insensitive partial match)
export async function getMediaByFilename(searchTerm: string): Promise<MediaItem | null> {
    if (!supabase) {
        return null;
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('media')
            .select('*')
            .ilike('original_filename', `%${searchTerm}%`)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            console.error('Error fetching media by filename:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error fetching media by filename:', error);
        return null;
    }
}

// Update media alt text
export async function updateMediaAltText(id: string, altText: string): Promise<boolean> {
    if (!supabase) {
        return false;
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('media')
            .update({ alt_text: altText })
            .eq('id', id);

        if (error) {
            console.error('Update error:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Update error:', error);
        return false;
    }
}
