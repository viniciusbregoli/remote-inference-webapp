import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@example.com';
    const adminUsername = 'admin';

    const adminExists = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!adminExists) {
        console.log('Admin user not found, creating one...');
        const hashedPassword = await bcrypt.hash('admin', 10);
        const adminUser = await prisma.user.create({
            data: {
                username: adminUsername,
                email: adminEmail,
                password_hash: hashedPassword,
                is_admin: true,
                is_active: true,
            },
        });
        console.log('Default admin user created:', adminUser);
    } else {
        console.log('Default admin user already exists.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 