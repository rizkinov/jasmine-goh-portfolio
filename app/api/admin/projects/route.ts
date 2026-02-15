import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import jwt from 'jsonwebtoken';
import { updateProject, getProjects, getProjectBySlug, createProject, deleteProject } from '@/lib/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

// Verify admin authentication
function verifyAuth(request: NextRequest): boolean {
    try {
        const token = request.cookies.get('admin_token')?.value;
        if (!token) return false;
        jwt.verify(token, JWT_SECRET);
        return true;
    } catch (error) {
        console.error('Auth verification failed:', error);
        return false;
    }
}

// GET - Fetch all projects or single project by slug
export async function GET(request: NextRequest) {
    if (!verifyAuth(request)) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        if (slug) {
            const project = await getProjectBySlug(slug);
            if (!project) {
                return NextResponse.json(
                    { error: 'Project not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json(project);
        }

        const projects = await getProjects();
        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

// POST - Create new project
export async function POST(request: NextRequest) {
    if (!verifyAuth(request)) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        const { title, slug, short_description, client, role, cover_image_url, hero_image_url, content_html, content_blocks, tags, category, status, methods_tools, date_from, date_to } = body;

        // Validation
        if (!title || !slug || !short_description) {
            return NextResponse.json(
                { error: 'Missing required fields: title, slug, short_description' },
                { status: 400 }
            );
        }

        // Check for duplicate slug
        const existingProject = await getProjectBySlug(slug);
        if (existingProject) {
            return NextResponse.json(
                { error: 'A project with this slug already exists' },
                { status: 409 }
            );
        }

        // Create project
        const newProject = await createProject({
            title,
            slug,
            short_description,
            client: client || '',
            role: role || '',
            cover_image_url: cover_image_url || null,
            hero_image_url: hero_image_url || null,
            content_html: content_html || '',
            content_blocks: content_blocks || null,
            tags: tags || [],
            category: category || '',
            status: status || 'Completed',
            methods_tools: methods_tools || '',
            date_from: date_from || '',
            date_to: date_to || '',
        });

        if (!newProject) {
            return NextResponse.json(
                { error: 'Failed to create project' },
                { status: 500 }
            );
        }

        revalidatePath(`/projects/${newProject.slug}`);
        revalidatePath('/');

        return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json(
            { error: 'Failed to create project' },
            { status: 500 }
        );
    }
}

// PUT - Update project
export async function PUT(request: NextRequest) {
    if (!verifyAuth(request)) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Project ID is required' },
                { status: 400 }
            );
        }

        const updatedProject = await updateProject(id, updates);

        if (!updatedProject) {
            return NextResponse.json(
                { error: 'Failed to update project' },
                { status: 500 }
            );
        }

        revalidatePath(`/projects/${updatedProject.slug}`);
        revalidatePath('/');

        return NextResponse.json(updatedProject);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update project';
        console.error('Error updating project:', message);
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}

// DELETE - Delete project
export async function DELETE(request: NextRequest) {
    if (!verifyAuth(request)) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Project ID is required' },
                { status: 400 }
            );
        }

        const success = await deleteProject(id);

        if (!success) {
            return NextResponse.json(
                { error: 'Failed to delete project' },
                { status: 500 }
            );
        }

        revalidatePath('/');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json(
            { error: 'Failed to delete project' },
            { status: 500 }
        );
    }
}
