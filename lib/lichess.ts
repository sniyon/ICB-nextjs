import crypto from "crypto";

// -------------------
// --- PKCE HELPERS ---
// -------------------
export function createVerifier(): string {
  return base64URLEncode(crypto.randomBytes(32));
}

export function createChallenge(verifier: string): string {
  return base64URLEncode(
    crypto.createHash("sha256").update(verifier).digest()
  );
}

function base64URLEncode(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

// -------------------
// --- OAUTH TOKEN ---
// -------------------
export interface TokenParams {
  code: string;
  verifier: string;
  clientId: string;
  redirectUri: string;
}

export async function getToken(params: TokenParams) {
  const res = await fetch("https://lichess.org/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: params.code,
      code_verifier: params.verifier,
      client_id: params.clientId,
      redirect_uri: params.redirectUri,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to get token: ${res.statusText}`);
  }

  return res.json();
}

// -------------------
// --- USER INFO ---
// -------------------
export async function getUser(accessToken: string) {
  const res = await fetch("https://lichess.org/api/account", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch user info: ${res.statusText}`);
  }

  return res.json();
}

// -------------------
// --- CREATE GAME VS AI ---
// -------------------
export interface CreateGameAIParams {
  accessToken: string;
  color: "white" | "black";
  aiLevel: number; // 1-8
}

export async function createGameAgainstAI(params: CreateGameAIParams) {
  const res = await fetch("https://lichess.org/api/challenge/ai", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      level: params.aiLevel,
      variant: "standard",
      color: params.color,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to create game: ${res.statusText}`);
  }

  return res.json();
}

// -------------------
// --- MAKE MOVE ---
// -------------------
export interface MakeMoveParams {
  accessToken: string;
  gameId: string;
  move: string; // ex: "e2e4"
}

export async function makeMove(params: MakeMoveParams) {
  const res = await fetch(
    `https://lichess.org/api/board/game/${params.gameId}/move/${params.move}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${params.accessToken}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to make move: ${res.statusText}`);
  }

  return res.json();
}
