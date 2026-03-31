import { getOAuthClient } from "@/lib/google-calendar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.redirect(new URL("/login", process.env.NEXTAUTH_URL));
  }

  const client = getOAuthClient();
  const { tokens } = await client.getToken(code);

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      googleAccessToken: tokens.access_token,
      ...(tokens.refresh_token && { googleRefreshToken: tokens.refresh_token }),
    },
  });

  return Response.redirect(new URL("/dashboard", process.env.NEXTAUTH_URL));
}
