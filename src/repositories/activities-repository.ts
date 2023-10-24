import { prisma } from '@/config';

async function findMany() {
  return prisma.activity.findMany({
    include: {
      _count: {
        select: {
          Participants: true
        }
      },
      Participants: true
    }
  });
};

async function findActivityById(activityId: number) {
  return prisma.activity.findUnique({
    where: {
      id: activityId
    },
    select: {
      _count: {
        select: {
          Participants: true
        }
      },
      capacity: true
    }
  })
}

async function findParticipantByInput(activityId: number, userId: number) {
  return prisma.userInActivity.findFirst({
    where: {
      AND: {
        activityId,
        userId
      }
    }
  });
};

async function createParticipant(activityId: number, userId: number) {
  return prisma.userInActivity.create({
    data: {
      activityId,
      userId
    }
  });
};

export const activitiesRepository = {
  findMany,
  findActivityById,
  findParticipantByInput,
  createParticipant
};
