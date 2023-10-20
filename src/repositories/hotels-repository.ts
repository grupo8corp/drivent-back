import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
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
