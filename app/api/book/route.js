import prisma from "@/lib/prisma";
import { createCalendarEvent } from "@/lib/google-calendar";
import { sendHostNotification } from "@/lib/mailer";

export async function POST(req) {
  const { userId, guestName, guestEmail, start, end } = await req.json();

  const startDate = new Date(start);
  const endDate = new Date(end);

  const conflict = await prisma.booking.findFirst({
    where: {
      userId,
      start: { lt: endDate },
      end: { gt: startDate },
    },
  });

  if (conflict) {
    return Response.json(
      { error: "This slot is already booked." },
      { status: 409 },
    );
  }

  const booking = await prisma.booking.create({
    data: {
      userId,
      guestName,
      guestEmail,
      start: startDate,
      end: endDate,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      name: true,
      googleAccessToken: true,
      googleRefreshToken: true,
    },
  });

  if (user?.googleAccessToken) {
    try {
      await createCalendarEvent({
        accessToken: user.googleAccessToken,
        refreshToken: user.googleRefreshToken,
        summary: `Meeting with ${guestName}`,
        start: startDate,
        end: endDate,
        guestEmail,
        guestName,
        userId,
      });
    } catch (e) {
      // Calendar sync failed — booking still succeeds
      console.log("error in catch", e);
    }
  }

  const hostName = user?.name ?? user?.email;

  if (user?.email) {
    try {
      await sendHostNotification({
        to: user.email,
        hostName,
        guestName,
        guestEmail,
        start: startDate,
        end: endDate,
      });
    } catch (e) {
      console.log("email send error (host)", e);
    }
  }

  return Response.json(booking);
}
