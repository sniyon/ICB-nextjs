import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET(_, { params }) {
  const session = getSession();
  const user = session.user.id;

  const data = await fetch(
    `https://lichess.org/api/games/user/${user}?max=${params.maxNumberOfGames}&moves=true`,
    { headers: { Authorization: `Bearer ${session.accessToken.access_token}`, Accept: "application/x-ndjson" } }
  ).then(r => r.text());

  return NextResponse.text(data);
}
