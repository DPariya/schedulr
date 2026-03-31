import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  // console.log("session at availability :", session);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const slots = await req.json();

  const days = slots.map((s) => s.dayOfWeek);

  // Replace existing records for the submitted days
  await prisma.availability.deleteMany({
    where: { userId: session.user.id, dayOfWeek: { in: days } },
  });

  await prisma.availability.createMany({
    data: slots.map((slot) => ({ ...slot, userId: session.user.id })),
  });

  return Response.json({ success: true });
}
