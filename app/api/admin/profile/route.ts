import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { updateProfile, getProfile } from '@/lib/supabase';

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

// GET - Fetch profile
export async function GET(request: NextRequest) {
    if (!verifyAuth(request)) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        const profile = await getProfile();
        if (!profile) {
            return NextResponse.json(
                { error: 'Profile not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}

// PUT - Update profile
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
                { error: 'Profile ID is required' },
                { status: 400 }
            );
        }

        const updatedProfile = await updateProfile(id, updates);

        if (!updatedProfile) {
            return NextResponse.json(
                { error: 'Failed to update profile' },
                { status: 500 }
            );
        }

        return NextResponse.json(updatedProfile);
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        );
    }
}
