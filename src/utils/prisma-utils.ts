import faker from "@faker-js/faker";
import { Activity } from "@prisma/client";
import dayjs from "dayjs";

export function exclude<T, Key extends keyof T>(entity: T, ...keys: Key[]): Omit<T, Key> {
  const newEntity = JSON.parse(JSON.stringify(entity));
  for (const key of keys) {
    delete newEntity[key];
  }
  return newEntity;
}

type ActivityArray = Omit<Activity, 'id' | 'updatedAt' | 'createdAt'>
export function seedActivityFactory(): ActivityArray[]{
  return [
    {
      auditory: "LATERAL",
      capacity: 5,
      startsAt: dayjs().add(1, "hours").toDate(),
      endsAt: dayjs().add(2, "hours").toDate(),
      name: faker.lorem.words(),
    },
    {
      auditory: "MAIN",
      capacity: 4,
      startsAt: dayjs().add(2, "hours").toDate(),
      endsAt: dayjs().add(3, "hours").toDate(),
      name: faker.lorem.words(),
    },
    {
      auditory: "WORKSHOP",
      capacity: 2,
      startsAt: dayjs().add(5, "hours").toDate(),
      endsAt: dayjs().add(7, "hours").toDate(),
      name: faker.lorem.words(),
    },
    {
      auditory: "LATERAL",
      capacity: 1,
      startsAt: dayjs().add(3, "hours").toDate(),
      endsAt: dayjs().add(6, "hours").toDate(),
      name: faker.lorem.words(),
    },
    

    {
      auditory: "LATERAL",
      capacity: 1,
      startsAt: dayjs().add(1, "days").add(3, "hours").toDate(),
      endsAt: dayjs().add(1, "days").add(6, "hours").toDate(),
      name: faker.lorem.words(),
    },
    {
      auditory: "LATERAL",
      capacity: 5,
      startsAt: dayjs().add(1, "days").add(1, "hours").toDate(),
      endsAt: dayjs().add(1, "days").add(2, "hours").toDate(),
      name: faker.lorem.words(),
    },
    {
      auditory: "MAIN",
      capacity: 4,
      startsAt: dayjs().add(1, "days").add(2, "hours").toDate(),
      endsAt: dayjs().add(1, "days").add(3, "hours").toDate(),
      name: faker.lorem.words(),
    },
    {
      auditory: "WORKSHOP",
      capacity: 2,
      startsAt: dayjs().add(1, "days").add(5, "hours").toDate(),
      endsAt: dayjs().add(1, "days").add(7, "hours").toDate(),
      name: faker.lorem.words(),
    }
  ];
};
