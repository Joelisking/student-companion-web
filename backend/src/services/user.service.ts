import prisma from '../lib/prisma';

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });
  if (!user) throw new Error('User not found');
  return user;
}

export async function updateProfile(userId: string, name: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { name: name.trim() },
    select: { id: true, name: true, email: true },
  });
}
