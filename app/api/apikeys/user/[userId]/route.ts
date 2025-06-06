import { NextResponse } from 'next/server';
import { prisma } from '@/services/prisma';

export async function GET(request: Request, props: { params: Promise<{ userId: string }> }) {
    const params = await props.params;
    const { userId } = params;

    const apiKeys = await prisma.apiKey.findMany({
        where: { user_id: parseInt(userId) },
    });

    return NextResponse.json(apiKeys);
} 