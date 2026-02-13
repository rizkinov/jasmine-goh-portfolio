-- Add content_blocks JSONB column to projects table
-- When set, takes precedence over content_html for rendering
ALTER TABLE projects ADD COLUMN IF NOT EXISTS content_blocks JSONB DEFAULT NULL;
