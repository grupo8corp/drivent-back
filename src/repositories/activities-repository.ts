import { prisma } from '@/config';

async function findMany() {
  return prisma.activity.findMany({
    include: {
      _count: {
        select: {
          Participants: true
        }
      },
      Participants: {
        select: {
          id: true, 
          userId: true
        }
      }
    }
  });
};

async function findActivityById(activityId: number) {
  return prisma.activity.findUnique({
    where: {
      id: activityId
    },
    select: {
      startsAt: true,
      endsAt: true,
      _count: {
        select: {
          Participants: true
        }
      },
      capacity: true
    }
  })
};

async function findParticipantByUserId(userId: number) {
  return prisma.userInActivity.findMany({
    where: {
      userId
    },
    select: {
      Activity: {
        select: {
          endsAt: true,
          startsAt: true
        }
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
  findParticipantByUserId,
  createParticipant
};
