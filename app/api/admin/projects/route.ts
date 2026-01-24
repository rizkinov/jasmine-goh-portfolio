import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { updateProject, getProjects, getProjectBySlug } from '@/lib/supabase';

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

        return NextResponse.json(updatedProject);
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json(
            { error: 'Failed to update project' },
            { status: 500 }
        );
    }
}
