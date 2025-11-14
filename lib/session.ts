// lib/session.ts
import { cookies } from "next/headers";

export async function getSession() {
  const cookieStore = await cookies();

  // ⚠ fallback si .get() n'existe pas
  const cookie =
    cookieStore.get?.("lichess_auth") ||
    cookieStore.getAll?.().find((c: any) => c.name === "lichess_auth");

  if (!cookie) return {};
  try {
    return JSON.parse(cookie.value);
  } catch {
    return {};
  }
}

export async function saveSession(session: Record<string, any>) {
  const cookieStore = await cookies();

  // On écrit un cookie HTTPOnly pour stocker la session
  cookieStore.set({
    name: "lichess_auth",
    value: JSON.stringify(session),
    path: "/",        // accessible sur tout le site
    httpOnly: true,   // non accessible côté client
    sameSite: "lax",  // protège contre CSRF
    secure: process.env.NODE_ENV === "production", // HTTPS uniquement en prod
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });
}
