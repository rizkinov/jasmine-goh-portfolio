import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database, Project, Profile } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if Supabase is configured
const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
    console.warn(
        '⚠️ Supabase environment variables are not set. Using mock data.\n' +
        'To connect to Supabase, set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    );
}

// Create Supabase client only if configured
let supabase: SupabaseClient<Database> | null = null;

if (isSupabaseConfigured) {
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
}

export { supabase };

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

// Helper function to update project
export async function updateProject(id: string, updates: Partial<Database['public']['Tables']['projects']['Update']>) {
    if (!supabase) {
        console.error('Supabase is not configured. Cannot update project.');
        return null;
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
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
