import prisma from '../lib/prisma';

export async function findOrCreateUserByEmail(email: string): Promise<{ userId: string }> {
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
