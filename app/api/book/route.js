import prisma from "@/lib/prisma";

export async function POST(req) {
  const { userId, guestName, guestEmail, start, end } = await req.json();

  const booking = await prisma.booking.create({
    data: {
      userId,
      guestName,
      guestEmail,
      start: new Date(start),
      end: new Date(end),
    },
  });

  return Response.json(booking);
}
