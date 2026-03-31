import { getAuthUrl } from "@/lib/google-calendar";

export async function GET() {
  const url = getAuthUrl();
  return Response.redirect(url);
}
