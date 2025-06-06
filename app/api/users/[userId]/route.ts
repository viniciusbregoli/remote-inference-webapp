import { NextResponse } from 'next/server';
import { prisma } from '@/services/prisma';
import bcrypt from 'bcryptjs';

export async function GET(request: Request, props: { params: Promise<{ userId: string }> }) {
    /**
     * Retrieves a single user by their ID
     * 
     * @param {Request} request - The incoming HTTP request
     * @param {Promise<{ params: Promise<{ userId: string }> }>} props - The request parameters
     * @returns {Promise<NextResponse>} A JSON response containing either:
     *   - The user object on success
     *   - An error message with 404 status if the user is not found
     * 
     * @example
     * // Request:
     * GET /api/users/1
     * 
     */

    const params = await props.params;
    const { userId } = params;
    const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
    });
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
}

export async function PUT(request: Request, props: { params: Promise<{ userId: string }> }) {
    /**
     * Updates a user by their ID
     * 
     * @param {Request} request - The incoming HTTP request
     * @param {Promise<{ params: Promise<{ userId: string }> }>} props - The request parameters
     * @returns {Promise<NextResponse>} A JSON response containing either:
     *   - The updated user object on success
     *   - An error message with 404 status if the user is not found
     * 
     * @example
     * // Request body:
     * {
     *   "username": "johndoe",
     *   "email": "john@example.com",
     *   "password": "securepassword",
     *   "is_active": true,
     *   "is_admin": false
     * }
     */

    const params = await props.params;
    const { userId } = params;
    const body = await request.json();
    const { username, email, password, is_active, is_admin } = body;

    const db_user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
    });

    if (!db_user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data: any = {};
    if (username) data.username = username;
    if (email) data.email = email;
    if (password) data.password_hash = await bcrypt.hash(password, 10);
    if (is_active !== undefined) data.is_active = is_active;
    if (is_admin !== undefined) data.is_admin = is_admin;

    try {
        const result = await prisma.user.updateMany({
            where: { id: parseInt(userId) },
            data,
        });

        if (result.count === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const updatedUser = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Update failed", error);
        return NextResponse.json({ error: "Could not update user." }, { status: 500 });
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ userId: string }> }) {
    /**
     * Deletes a user by their ID
     * 
     * @param {Request} request - The incoming HTTP request
     * @param {Promise<{ params: Promise<{ userId: string }> }>} props - The request parameters
     * @returns {Promise<NextResponse>} A JSON response containing either:
     *   - A 204 status with no content on success
     *   - An error message with 404 status if the user is not found
     * 
     * @example
     * // Request:
     * DELETE /api/users/1
     * 
     */
    const params = await props.params;
    const { userId } = params;

    const db_user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
    });

    if (!db_user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.user.delete({
        where: { id: parseInt(userId) },
    });

    return new NextResponse(null, { status: 204 });
} 