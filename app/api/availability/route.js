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

  const data = slots.map((slot) => ({
    ...slot,
    userId: session.user.id,
  }));

  await prisma.availability.createMany({
    data,
  });

  return Response.json({ success: true });
}
