# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev       # Next.js dev server on http://localhost:3000
npm run build     # Production build
npm start         # Production server
npm run lint      # ESLint
```

## Architecture Overview

This is a **Jasmine Goh Portfolio** website built with Next.js 16 (App Router), Supabase, and TailwindCSS 4. It has two main sections:
- **Public portfolio** (`/`, `/about`, `/projects/[slug]`) - Server-rendered project showcase
- **Admin CMS** (`/admin`, `/admin/media`) - Client-side dashboard for content management

### Key Technologies
- Next.js 16 with App Router (server components by default)
- React 19, TypeScript (strict mode)
- Supabase for PostgreSQL database and Storage
- TipTap for rich text editing
- Framer Motion for animations
- shadcn/ui components (Radix UI primitives)

### Project Structure

```
/app
  /api/admin/         # Auth endpoints (login, verify, logout)
  /admin/             # Admin dashboard pages
  /projects/[slug]/   # Dynamic project pages
  page.tsx            # Home (server component)

/components
  /portfolio/         # Public-facing (HeroSection, ProjectCard, Navbar, etc.)
  /admin/             # Admin-only (AdminEditor, MediaLibrary, ImageCropper)
  /ui/                # shadcn base components

/lib
  supabase.ts         # Supabase client & helper functions
  media.ts            # Media upload utilities

/types
  database.ts         # TypeScript interfaces for Supabase tables

/supabase
  schema.sql          # Database schema (profile, projects)
  media-schema.sql    # Media table schema
```

### Data Flow
- `getProjects()`, `getProjectBySlug()`, `getProfile()` are async server functions in `/lib/supabase.ts`
- Projects stored in Supabase with `content_html` (TipTap rich text)
- Media stored in Supabase Storage with metadata in `media` table
- RLS policies: public SELECT, authenticated INSERT/UPDATE/DELETE

### Authentication
- JWT-based admin auth with bcrypt password verification
- Token stored in HTTP-only cookie (24h expiration)
- Endpoints: `/api/admin/login`, `/api/admin/verify`, `/api/admin/logout`

## Important Patterns

### Framer Motion Easing Types
Use `as const` for easing values to satisfy TypeScript strict mode:
```typescript
ease: 'easeOut' as const
```

### Supabase Type Assertions
Media operations may require type assertions due to strict table typing:
```typescript
const { data } = await supabase.from('media').select('*') as any
```

### Client vs Server Components
- Default to server components
- Mark with `'use client'` only when needed (interactivity, hooks)
- TipTap editor uses `immediatelyRender: false` for SSR safety

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_USERNAME
ADMIN_PASSWORD_HASH
JWT_SECRET
```

## Database Tables

- **profile**: Single row with designer info (name, headline, bio, experience JSONB)
- **projects**: Case studies (slug, title, content_html, cover_image_url, tags)
- **media**: Uploaded images (storage_path, public_url, dimensions, alt_text)
