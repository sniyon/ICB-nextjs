import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = getSession();
  const user = session.user.id;

  const response = await fetch(`https://lichess.org/api/${user}/note`, {
    headers: { Authorization: `Bearer ${session.accessToken.access_token}` }
  });

  const data = await response.text();
  return NextResponse.text(data);
}
