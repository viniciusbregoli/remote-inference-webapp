import { NextResponse } from 'next/server';
import { prisma } from '@/services/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    /**
     * Creates a new user in the system
     * 
     * @param {Request} request - The incoming HTTP request containing user data
     * @returns {Promise<NextResponse>} A JSON response containing either:
     *   - The created user object on success
     *   - An error message with 400 status if:
     *     - Required fields are missing
     *     - Username or email already exists
     * 
     * @example
     * // Request body:
     * {
     *   "username": "johndoe",
     *   "email": "john@example.com",
     *   "password": "securepassword"
     * }
     */

    const body = await request.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { username: { equals: username, mode: 'insensitive' } },
                { email: { equals: email, mode: 'insensitive' } },
            ],
        },
    });

    if (existingUser) {
        return NextResponse.json({ error: 'Username or email already registered' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            username,
            email,
            password_hash: hashedPassword,
        },
    });

    return NextResponse.json(user);
}

export async function GET() {
    /**
     * Retrieves all users from the database
     * 
     * @returns {Promise<NextResponse>} A JSON response containing an array of user objects
     */

    const users = await prisma.user.findMany();
    return NextResponse.json(users);
} 