import { prisma } from '@/config';

async function findHotels() {
  const hotel = await prisma.hotel.findMany({
    include: {
      Rooms: {
        select: {
          capacity: true,
          _count: {
            select: {
              Booking: true,
            },
          },
        },
      },
    },
  });
  return hotel.map(({ Rooms, ...rest }) => ({
    ...rest,
    type: (() => {
      const checkQtd = (n: number) => {
        return Rooms.some(({ capacity }) => capacity === (capacity > 3 && n === 3 ? capacity : n));
      };
      if (checkQtd(1) && checkQtd(2) && checkQtd(3)) return 'Single, Double e Triple';
      if (checkQtd(1) && checkQtd(2)) return 'Single e Double';
      if (checkQtd(1) && checkQtd(3)) return 'Single e Triple';
      if (checkQtd(2) && checkQtd(3)) return 'Double e Triple';
      if (checkQtd(1)) return 'Single';
      if (checkQtd(2)) return 'Double';
      if (checkQtd(3)) return 'Triple';
    })(),
    remainingVacancies: Rooms.map(({ _count: { Booking }, capacity }) => capacity - Booking).reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    ),
  }));
}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: {
        include: {
          _count: {
            select: { Booking: true },
          },
        },
      },
    },
  });
}

export const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
};
