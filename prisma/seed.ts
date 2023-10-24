import { faker } from '@faker-js/faker';
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driven.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }
  console.log({ event });

  let activities = await prisma.activity.findMany();
  if (activities.length === 0){
    await prisma.activity.createMany({
      data: [
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
          capacity: 1,
          startsAt: faker.date.soon(2),
          endsAt: faker.date.soon(14),
          name: faker.lorem.words(),
        },
        {
          auditory: "LATERAL",
          capacity: 1,
          startsAt: faker.date.soon(2),
          endsAt: faker.date.soon(14),
          name: faker.lorem.words(),
        },
      ]
    })
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
