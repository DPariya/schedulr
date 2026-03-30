import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { name, email, password, username } = await req.json();

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashed, username },
  });

  return Response.json(user);
}
