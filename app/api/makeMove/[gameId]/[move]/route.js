import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { makeMove } from "@/lib/lichess";

export async function GET(_, { params }) {
  const session = getSession();
  if (!session.accessToken) return NextResponse.text("User is not logged in");

  const { gameId, move } = params;
  const result = await makeMove(session.accessToken.access_token, gameId, move);
  return NextResponse.json(result);
}
