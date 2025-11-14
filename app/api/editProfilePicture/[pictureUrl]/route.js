import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET(_, { params }) {
  const session = getSession();
  const user = session.user.id;

  const response = await fetch(`https://lichess.org/api/${user}/note`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.accessToken.access_token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      text: `[avatar]${params.pictureUrl}[/avatar]`
    }),
  });

  return NextResponse.json(response.ok);
}
