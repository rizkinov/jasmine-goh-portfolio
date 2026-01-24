import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database, Project, Profile } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if Supabase is configured
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
    console.warn(
        '⚠️ Supabase environment variables are not set. Using mock data.\n' +
        'To connect to Supabase, set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    );
}

// Create Supabase client only if configured (anon key for public reads)
let supabase: SupabaseClient<Database> | null = null;

if (isSupabaseConfigured) {
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
}

// Create service role client for admin operations (server-side only)
// This bypasses RLS and should only be used in API routes
let supabaseAdmin: SupabaseClient<Database> | null = null;

if (supabaseUrl && supabaseServiceRoleKey) {
    supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceRoleKey);
}

export { supabase, supabaseAdmin };

// Helper function to get all projects
export async function getProjects(): Promise<Project[]> {
    if (!supabase) {
        // Return empty array to trigger mock data fallback
        return [];
    }

    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching projects:', error);
            return [];
        }

        return data || [];
    } catch (err) {
        console.error('Error fetching projects:', err);
        return [];
    }
}

// Helper function to get a single project by slug
export async function getProjectBySlug(slug: string): Promise<Project | null> {
    if (!supabase) {
        // Return null to trigger mock data fallback
        return null;
    }

    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error('Error fetching project:', error);
            return null;
        }

        return data;
    } catch (err) {
        console.error('Error fetching project:', err);
        return null;
    }
}

// Helper function to get profile
export async function getProfile(): Promise<Profile | null> {
    if (!supabase) {
        // Return null to trigger mock data fallback
        return null;
    }

    try {
        const { data, error } = await supabase
            .from('profile')
            .select('*')
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }

        return data;
    } catch (err) {
        console.error('Error fetching profile:', err);
        return null;
    }
}

// Helper function to update project (server-side only - uses admin client)
export async function updateProject(id: string, updates: Partial<Database['public']['Tables']['projects']['Update']>) {
    if (!supabaseAdmin) {
        console.error('Supabase admin client is not configured. Cannot update project.');
        return null;
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabaseAdmin as any)
            .from('projects')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating project:', error);
            return null;
        }

        return data;
    } catch (err) {
        console.error('Error updating project:', err);
        return null;
    }
}

// Helper function to create a new project (server-side only - uses admin client)
export async function createProject(input: Database['public']['Tables']['projects']['Insert']): Promise<Project | null> {
    if (!supabaseAdmin) {
        console.error('Supabase admin client is not configured. Cannot create project.');
        return null;
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabaseAdmin as any)
            .from('projects')
            .insert({
                ...input,
                content_html: input.content_html || '',
                tags: input.tags || [],
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating project:', error);
            return null;
        }

        return data;
    } catch (err) {
        console.error('Error creating project:', err);
        return null;
    }
}

// Helper function to delete a project (server-side only - uses admin client)
export async function deleteProject(id: string): Promise<boolean> {
    if (!supabaseAdmin) {
        console.error('Supabase admin client is not configured. Cannot delete project.');
        return false;
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabaseAdmin as any)
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting project:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Error deleting project:', err);
        return false;
    }
}

// Helper function to update profile (server-side only - uses admin client)
export async function updateProfile(id: string, updates: Partial<Database['public']['Tables']['profile']['Update']>): Promise<Profile | null> {
    if (!supabaseAdmin) {
        console.error('Supabase admin client is not configured. Cannot update profile.');
        return null;
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabaseAdmin as any)
            .from('profile')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating profile:', error);
            return null;
        }

        return data;
    } catch (err) {
        console.error('Error updating profile:', err);
        return null;
    }
}
