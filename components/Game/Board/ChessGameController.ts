import { Chess, type Piece, type Square } from "chess.js";
import { type RefObject } from "react";
import utils from "../../../utils/utils";
import axios from "axios";

export type GameMode = "singlePlayer" | "multiplayerLocal" | "multiplayerOnline";

export default class ChessGameController {
  isPlayerWhite = false;
  chessRules: Chess;
  gameMode: GameMode;
  gameId: string | null = null;
  userId: string | null = null;
  isWhiteTurn = true;
  streamData: JSON | null = null;
  numberOfTurns = 0;
  isWhiteChecked = false;
  isBlackChecked = false;
  capturedWhitePiece: string[] = [];
  capturedBlackPiece: string[] = [];
  moveHistory: [string, string][] = [];
  lastMove = "";
  status: "none" | "check" | "mate" | "draw" | "resign" = "none";
  listeners: Map<string, ((data: any) => void)[]>;

  constructor(gameMode: GameMode, gameId: string, userId: string) {
    this.gameMode = gameMode;
    this.gameId = gameId;
    this.userId = userId;
    this.chessRules = new Chess();
    this.listeners = new Map();
    this.status = "none";
  }

  on(event: string, callback: (data: any) => void) {
    const list = this.listeners.get(event);
    if (!list) this.listeners.set(event, [callback]);
    else list.push(callback);
  }

  emit(event: string, data: any) {
    this.listeners.get(event)?.forEach((cb) => cb(data));
  }

  async init() {
    try {
      const res = await axios.get(`/api/monitorGame/${this.gameId}`);
      const moves_string: string = res.data?.state?.moves || "";
      this.isPlayerWhite = res.data?.white?.id === this.userId;

      const moves_list = moves_string ? moves_string.split(" ") : [];
      for (const move of moves_list) {
        if (!move) continue;
        try {
          this.updateTurnAndBoard(move);
        } catch (e) {
          console.warn("Failed to apply move:", move, e);
        }
      }

      this.status = "none";
    } catch (err) {
      console.error("Failed to initialize game:", err);
    }
  }

  getCurrentFen() {
    return this.chessRules.fen();
  }

  getLegalMovesTileIndecies(tileIndex: number) {
    if (!this.chessRules) return [];
    const rowIndex = Math.floor(tileIndex / 8);
    const colIndex = tileIndex % 8;
    const square = utils.columnNames[colIndex] + utils.rowNames[rowIndex];

    const allMoves = this.chessRules.moves({ verbose: true }) || [];
    const movesFromSquare = allMoves
      .filter((m) => m.from === square)
      .map((m) => {
        if (m.san === "O-O-O") return this.isPlayerWhite ? "a1" : "a8";
        if (m.san === "O-O") return this.isPlayerWhite ? "h1" : "h8";
        return m.to;
      });

    return utils.convertTileNamesToIndices(movesFromSquare);
  }

  updateTurnAndBoard(move: string) {
    const chessMove = this.chessRules.move(move);
    if (!chessMove) {
      console.warn("Invalid move skipped:", move);
      return;
    }

    this.moveHistory.push([chessMove.piece, move.substring(2, 4)]);
    this.lastMove = move;

    if (chessMove.captured) {
      if (chessMove.color === "b") this.capturedWhitePiece.push(chessMove.captured);
      else this.capturedBlackPiece.push(chessMove.captured);
    }

    this.isWhiteChecked = this.chessRules.isCheck() && this.isWhiteTurn;
    this.isBlackChecked = this.chessRules.isCheck() && !this.isWhiteTurn;

    if (this.chessRules.isCheckmate()) {
      this.status = "mate";
      this.emit("statusChange", "Mate");
    } else if (this.chessRules.isDraw()) {
      this.status = "draw";
      this.emit("statusChange", "Draw");
    } else {
      this.isWhiteTurn = !this.isWhiteTurn;
      this.numberOfTurns += 1;
      this.emit("turnChange", this.isWhiteTurn ? "white" : "black");
    }
  }

  pushMoveToLichess(move: string) {
    if (!this.gameId) return;
    axios.get(`/api/makeMove/${this.gameId}/${move}`).catch(console.error);
  }

  async getLastGameUpdates() {
    try {
      const res = await axios.get(`/api/monitorGame/${this.gameId}`);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch last game updates:", err);
      return null;
    }
  }

  async getLastMove() {
    const data = await this.getLastGameUpdates();
    const moves = data?.state?.moves || "";
    return moves.slice(-4);
  }

  async getAllMoves() {
    const data = await this.getLastGameUpdates();
    return data?.state?.moves || "";
  }

  async hasBotPlayedTurn() {
    const allRecordedMoves = await this.getAllMoves();
    return this.isPlayerWhite !== this.isWhiteTurn && this.numberOfTurns * 5 < allRecordedMoves.length;
  }

  async resign() {
    this.status = "resign";
    this.emit("statusChange", "Resign");
    try {
      await axios.get(`/api/resign/${this.gameId}`);
    } catch (err) {
      console.warn("Failed to resign the game:", err);
    }
  }

  getPieceAt(squareName: string): Piece | undefined {
    return this.chessRules.get(squareName as Square);
  }

  isCheck() {
    return this.chessRules.isCheck();
  }

  isKingSideCastle(move: string) {
    return move === "e8h8" || move === "e1h1";
  }

  isQueenSideCastle(move: string) {
    return move === "e8a8" || move === "e1a1";
  }
}
