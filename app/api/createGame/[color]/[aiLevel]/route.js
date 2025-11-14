import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createGameAgainstAI } from "@/lib/lichess";

export async function GET(req, context) {
  const session = await getSession();

  if (!session.accessToken) {
    return new Response("User is not logged in", { status: 401 });
  }

  // ⚡ params dynamiques
  const params = await context.params;
  const { color, aiLevel } = params;

  // validation de la couleur
  if (!["white", "black", "random"].includes(color)) {
    return new Response("Invalid color", { status: 400 });
  }

  // récupération du paramètre fen optionnel
  const fen = req.nextUrl.searchParams.get("fen") || "";
  if (fen) console.log("Using FEN:", fen);

  // conversion aiLevel en nombre si nécessaire
  const level = parseInt(aiLevel, 10);

  // appel à Lichess
  try {
    const response = await createGameAgainstAI({
      accessToken: session.accessToken.access_token,
      color,
      aiLevel: level,
      fen,
    });
    console.log(response);

    return NextResponse.json(response);
  } catch (err) {
    console.error(err);
    return new Response("Failed to create game", { status: 500 });
  }
}
