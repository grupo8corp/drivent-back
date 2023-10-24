import { prisma } from '@/config';
import faker from '@faker-js/faker';
import dayjs from 'dayjs';

export async function createActivity(capacity: number = 5, sameTime: boolean = false){
  return prisma.activity.create({
    data: {
      auditory: "LATERAL",
      capacity,
      startsAt: (sameTime ? dayjs().toDate() : faker.date.soon()),
      endsAt: (sameTime ? dayjs().add(2, "hours").toDate() : faker.date.soon(10)),
      name: faker.lorem.words(),
    },
  })
};

export async function createParticipant(activityId: number, userId: number){
  return prisma.userInActivity.create({
    data: {
      activityId,
      userId
    },
    include: {
      Activity: {
        select: {
          _count: {
            select: {
              Participants: true
            }
          }
        }
      }
    }
  })
}