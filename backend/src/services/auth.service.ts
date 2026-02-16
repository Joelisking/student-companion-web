import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function findOrCreateUserByEmail(
  email: string
): Promise<{ userId: string }> {
  // ... existing code ...
  const normalized = email.trim().toLowerCase();
  if (!normalized) {
    throw new Error('Email is required');
  }
  let user = await prisma.user.findUnique({
    where: { email: normalized },
  });
  if (!user) {
    user = await prisma.user.create({
      data: { email: normalized },
    });
  }
  return { userId: user.id };
}

export async function register(
  email: string,
  password: string
): Promise<{ userId: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      password: hashedPassword,
    },
  });

  return { userId: user.id };
}

export async function login(
  email: string,
  password: string
): Promise<{ userId: string; email: string } | null> {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user || !user.password) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return null;
  }

  return { userId: user.id, email: user.email! };
}
