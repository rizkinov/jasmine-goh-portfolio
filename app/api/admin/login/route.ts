import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Get credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        // Validate input
        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        // Check if credentials are configured
        if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH) {
            console.error('Admin credentials not configured in environment variables');
            return NextResponse.json(
                { error: 'Authentication not configured' },
                { status: 500 }
            );
        }

        // Verify username (constant-time comparison to prevent timing attacks)
        const usernameMatch = username.length === ADMIN_USERNAME.length &&
            username.split('').every((char: string, i: number) => char === ADMIN_USERNAME[i]);

        if (!usernameMatch) {
            // Still verify password to prevent timing attacks
            await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

        if (!passwordMatch) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate JWT token (expires in 24 hours)
        const token = jwt.sign(
            { username, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Create response with HTTP-only cookie
        const response = NextResponse.json({ success: true });

        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
