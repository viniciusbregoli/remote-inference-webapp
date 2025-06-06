import { NextResponse } from 'next/server';
import { prisma } from '@/services/prisma';

export async function GET(request: Request, props: { params: Promise<{ apikeyId: string }> }) {
    const params = await props.params;
    const { apikeyId } = params;
    const apiKey = await prisma.apiKey.findUnique({
        where: { id: parseInt(apikeyId) },
    });
    if (!apiKey) {
        return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }
    return NextResponse.json(apiKey);
}

export async function PUT(request: Request, props: { params: Promise<{ apikeyId: string }> }) {
    const params = await props.params;
    const { apikeyId } = params;
    const body = await request.json();
    const { name, is_active } = body;

    const db_apiKey = await prisma.apiKey.findUnique({
        where: { id: parseInt(apikeyId) },
    });

    if (!db_apiKey) {
        return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    const data: any = {};
    if (name) data.name = name;
    if (is_active !== undefined) data.is_active = is_active;

    const updatedApiKey = await prisma.apiKey.update({
        where: { id: parseInt(apikeyId) },
        data,
    });

    return NextResponse.json(updatedApiKey);
}

export async function DELETE(request: Request, props: { params: Promise<{ apikeyId: string }> }) {
    const params = await props.params;
    const { apikeyId } = params;

    const db_apiKey = await prisma.apiKey.findUnique({
        where: { id: parseInt(apikeyId) },
    });

    if (!db_apiKey) {
        return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    await prisma.apiKey.delete({
        where: { id: parseInt(apikeyId) },
    });

    return new NextResponse(null, { status: 204 });
} 