import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = getSession();
  const user = session.user.id;

  const data = await fetch(
    `https://lichess.org/api/user/${user}/activity`,
    { headers: { Authorization: `Bearer ${session.accessToken.access_token}` } }
  ).then(r => r.json());

  return NextResponse.json(data);
}
