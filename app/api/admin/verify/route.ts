import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('admin_token')?.value;

        if (!token) {
            return NextResponse.json(
                { authenticated: false },
                { status: 401 }
            );
        }

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        return NextResponse.json({
            authenticated: true,
            user: decoded,
        });
    } catch (error) {
        // Token is invalid or expired
        return NextResponse.json(
            { authenticated: false },
            { status: 401 }
        );
    }
}
