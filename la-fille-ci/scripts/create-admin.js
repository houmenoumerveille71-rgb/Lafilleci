const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin@lafille-ci.com';
  const password = 'admin123';
  const firstName = 'Admin';
  const lastName = 'LaFille';

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { isAdmin: true, password: hashedPassword },
      create: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        isAdmin: true,
      },
    });

    console.log('Admin user created/updated successfully:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('User ID:', user.id);
  } catch (error) {
    console.error('Failed to create admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
