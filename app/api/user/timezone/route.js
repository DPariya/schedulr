import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { timezone } = await req.json();

  await prisma.user.update({
    where: { id: session.user.id },
    data: { timezone },
  });

  return Response.json({ success: true });
}
