import { getSession } from "@/lib/session";

export async function GET(req, { params }) {
  const session = getSession();
  if (!session.accessToken) return new Response("User not logged in");

  const response = await fetch(
    `https://lichess.org/api/board/game/stream/${params.gameId}`,
    { headers: { Authorization: `Bearer ${session.accessToken.access_token}` } }
  );

  return new Response(response.body, {
    headers: { "Content-Type": "application/x-ndjson" }
  });
}
