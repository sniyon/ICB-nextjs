import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET(_, { params }) {
  const session = getSession();
  const response = await fetch(
    `https://lichess.org/api/board/game/${params.gameId}/resign`,
    { method: "POST", headers: { Authorization: `Bearer ${session.accessToken.access_token}` } }
  );
  return NextResponse.json(response.ok);
}
