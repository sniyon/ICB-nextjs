// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { createVerifier, createChallenge } from "@/lib/oauth";
import { saveSession } from "@/lib/session";

const clientId = process.env.LICHESS_CLIENT_ID;

export async function GET(req: Request) {
  const url = new URL(req.url);

  // 1. Créer le code_verifier et le code_challenge
  const codeVerifier = createVerifier();
  const codeChallenge = createChallenge(codeVerifier);

  // 2. SAUVEGARDER le code_verifier dans la session
  await saveSession({ codeVerifier });

  // 3. Construire l’URL OAuth Lichess
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId!,
    redirect_uri: `${url.origin}/api/auth/callback`,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    scope: "challenge:write bot:play board:play racer:write preference:write",
  });

  return NextResponse.redirect(`https://lichess.org/oauth?${params.toString()}`);
}
