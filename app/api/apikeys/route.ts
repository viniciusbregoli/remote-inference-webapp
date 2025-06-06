import { NextResponse } from 'next/server';
import { prisma } from '@/services/prisma';
import crypto from 'crypto';

function generateApiKey(): string {
    return crypto.randomBytes(32).toString('hex');
}

export async function POST(request: Request) {
    const body = await request.json();
    const { name, userId, expires_at } = body;

    if (!name || !userId) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const key = generateApiKey();

    const apiKey = await prisma.apiKey.create({
        data: {
            name,
            key,
            user_id: parseInt(userId),
            expires_at: expires_at ? new Date(expires_at) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        },
    });

    return NextResponse.json(apiKey);
}

export async function GET() {
    const apiKeys = await prisma.apiKey.findMany({
        include: {
            user: {
                select: {
                    username: true,
                },
            },
        },
    });
    return NextResponse.json(apiKeys);
} 