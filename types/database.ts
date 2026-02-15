// =============================================
// Database Types for Supabase
// =============================================

import type { PageContent } from './page-builder';

export interface Experience {
  id?: string;  // Optional unique identifier for React keys
  company: string;
  date: string;
}

export interface Profile {
  id: string;
  name: string;
  headline: string;
  bio: string;
  experience: Experience[];
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  client: string;
  role: string;
  cover_image_url: string | null;
  hero_image_url: string | null;
  content_html: string;
  content_blocks: PageContent | null;
  tags: string[];
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Type for creating a new project (without generated fields)
export interface CreateProjectInput {
  slug: string;
  title: string;
  short_description: string;
  client: string;
  role: string;
  cover_image_url?: string | null;
  hero_image_url?: string | null;
  content_html?: string;
  content_blocks?: PageContent | null;
  tags?: string[];
  category?: string;
  status?: string;
}

// Type for updating a project
export interface UpdateProjectInput {
  slug?: string;
  title?: string;
  short_description?: string;
  client?: string;
  role?: string;
  cover_image_url?: string | null;
  hero_image_url?: string | null;
  content_html?: string;
  content_blocks?: PageContent | null;
  tags?: string[];
  category?: string;
  status?: string;
}

// Type for creating/updating profile
export interface ProfileInput {
  name: string;
  headline: string;
  bio: string;
  experience: Experience[];
}

// Media types
export interface Media {
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

export interface CreateMediaInput {
  filename: string;
  original_filename: string;
  storage_path: string;
  public_url: string;
  mime_type: string;
  size_bytes: number;
  width?: number | null;
  height?: number | null;
  duration?: number | null; // Video duration in seconds
  alt_text?: string | null;
}

export interface UpdateMediaInput {
  alt_text?: string | null;
}

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      profile: {
        Row: Profile;
        Insert: ProfileInput;
        Update: Partial<ProfileInput>;
      };
      projects: {
        Row: Project;
        Insert: CreateProjectInput;
        Update: UpdateProjectInput;
      };
      media: {
        Row: Media;
        Insert: CreateMediaInput;
        Update: UpdateMediaInput;
      };
    };
  };
}
