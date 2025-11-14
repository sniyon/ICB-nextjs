// app/api/auth/callback/route.ts
import { NextResponse } from "next/server";
import { getSession, saveSession } from "@/lib/session";

const clientId = process.env.LICHESS_CLIENT_ID;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) return new Response("No code provided", { status: 400 });

  const session = await getSession();
  const verifier = session.codeVerifier;
  if (!verifier) return new Response("No code verifier", { status: 400 });

  const redirectUri = `${url.origin}/api/auth/callback`;

  const tokenRes = await fetch("https://lichess.org/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId!,
      code_verifier: verifier,
      redirect_uri: redirectUri,
    }),
  });

  const token = await tokenRes.json();
  if (!token.access_token)
    return new Response("Failed getting token", { status: 400 });

  const userRes = await fetch("https://lichess.org/api/account", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });

  const user = await userRes.json();

  await saveSession({ accessToken: token, user });

  return NextResponse.redirect("http://localhost:3000/menu");
}
