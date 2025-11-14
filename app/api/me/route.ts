// app/api/me/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession(); // <-- toujours await
  if (!session?.accessToken)
    return NextResponse.json({ lichessToken: null, lichessUsername: null });

  return NextResponse.json({
    lichessToken: session.accessToken.access_token,
    lichessUsername: session.user,
  });
}
