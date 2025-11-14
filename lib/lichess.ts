import crypto from "crypto";

// --- PKCE ---
export function createVerifier() {
  return base64URLEncode(crypto.randomBytes(32));
}

export function createChallenge(verifier: string) {
  return base64URLEncode(
    crypto.createHash("sha256").update(verifier).digest()
  );
}

function base64URLEncode(str: Buffer) {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

// --- OAUTH TOKEN ---
export async function getToken({ code, verifier, clientId, redirectUri }) {
  const res = await fetch("https://lichess.org/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      code_verifier: verifier,
      client_id: clientId,
      redirect_uri: redirectUri,
    }),
  });

  return await res.json();
}

// --- USER INFO ---
export async function getUser(accessToken: string) {
  const res = await fetch("https://lichess.org/api/account", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return await res.json();
}

// --- CREATE GAME VS AI ---
export async function createGameAgainstAI({ accessToken, color, aiLevel }) {
  const res = await fetch("https://lichess.org/api/challenge/ai", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      level: aiLevel,
      variant: "standard",
      color,
    }),
  });

  return await res.json();
}
