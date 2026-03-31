import { google } from "googleapis";

export function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

export function getAuthUrl() {
  const client = getOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/calendar.events"],
  });
}

export async function createCalendarEvent({
  accessToken,
  refreshToken,
  summary,
  start,
  end,
  guestEmail,
  guestName,
  userId,
}) {
  const client = getOAuthClient();
  client.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

  // Persist refreshed tokens back to DB so they don't expire permanently
  client.on("tokens", async (tokens) => {
    if (tokens.access_token) {
      const { default: prisma } = await import("@/lib/prisma");
      await prisma.user.update({
        where: { id: userId },
        data: {
          googleAccessToken: tokens.access_token,
          ...(tokens.refresh_token && { googleRefreshToken: tokens.refresh_token }),
        },
      });
    }
  });

  const calendar = google.calendar({ version: "v3", auth: client });
  await calendar.events.insert({
    calendarId: "primary",
    sendUpdates: "all",
    requestBody: {
      summary,
      start: { dateTime: start.toISOString(), timeZone: "UTC" },
      end: { dateTime: end.toISOString(), timeZone: "UTC" },
      attendees: [{ email: guestEmail, displayName: guestName }],
    },
  });
}
