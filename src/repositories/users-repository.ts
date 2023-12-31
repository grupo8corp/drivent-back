import { Prisma } from '@prisma/client';
import { prisma } from '@/config';

async function findByEmail(email: string, select?: Prisma.UserSelect) {
  const params: Prisma.UserFindUniqueArgs = {
    where: {
      email,
    },
  };

  if (select) {
    params.select = select;
  }

  return prisma.user.findUnique(params);
}

async function create(data: Prisma.UserUncheckedCreateInput) {
  return prisma.user.create({
    data,
  });
}

async function upsertByEmail(data: Prisma.UserUncheckedCreateInput) {
  return prisma.user.upsert({
    where: {
      email: data.email,
    },
    update: {
      email: data.email,
    },
    create: {
      email: data.email,
      password: data.password,
    },
  });
}

export const userRepository = {
  findByEmail,
  create,
  upsertByEmail,
};
