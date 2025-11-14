"use client";
import { useParams } from "next/navigation";
import Board from "@/components/Game/Board/Board";
import { useEffect, useRef, useState, type RefObject } from "react";
import { FlagFilled, LoadingOutlined } from "@ant-design/icons";
import ChessGameController, {
  type GameMode,
} from "@/components/Game/Board/ChessGameController";
import { Spin } from "antd";

export default function Game() {
  const [isLoaded, setIsLoaded] = useState(false);
  const chessGameControllerRef: RefObject<ChessGameController | null> =
    useRef(null);
  const [isWhiteTurn, setIsWhiteTurn] = useState<boolean>(true);
  const [moveHistory, setMoveHistory] = useState<[string, string][]>([]);

  // Get params
  const params = useParams();

  // Normalize them: ensure they are strings (not string[])
  const userId = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId;
  const gameId = Array.isArray(params.gameId)
    ? params.gameId[0]
    : params.gameId;

  if (!userId || !gameId) {
    return <div>Loading game...</div>;
  }

  useEffect(() => {
    (async () => {
      if (!isLoaded) {
        const gameMode: GameMode = "singlePlayer";
        chessGameControllerRef.current = new ChessGameController(
          gameMode,
          gameId,
          userId
        );
        await chessGameControllerRef.current.init();
        setIsLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    const controller = chessGameControllerRef.current;
    if (!controller) return;
    const handleTurnChange = (turn: string) => {
      console.log("Turn changed to:", turn);
      setMoveHistory(controller.moveHistory);
      setIsWhiteTurn(turn === "white");
    };
    const handleStatusChange = (status: string) => {
      console.log("Game status changed:", status);
    };
    controller.on("turnChange", handleTurnChange);
    controller.on("statusChange", handleStatusChange);
    return () => {
      controller.listeners.set(
        "turnChange",
        controller.listeners
          .get("turnChange")
          ?.filter((cb) => cb !== handleTurnChange) || []
      );
    };
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <div className="w-screen h-screen flex justify-center items-center flex-col gap-3">
        <Spin
          indicator={
            <LoadingOutlined spin style={{ color: "black", fontSize: 50 }} />
          }
          size="large"
        />
        <h1 className="text-[10px]">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="">
      <div className="relative bg-[#f5f5f5]">
        <Board chessGameControllerRef={chessGameControllerRef} />
        <MovesLogger moves={moveHistory} />

        <GameProfileCard
          isPlayerCard={false}
          imgSrc="https://yoolk.ninja/wp-content/uploads/2017/03/Apps-Stockfish.png"
          chessGameControllerRef={chessGameControllerRef}
          isPlayerTurn={
            isWhiteTurn == chessGameControllerRef.current?.isPlayerWhite
          }
        />

        <GameProfileCard
          isPlayerCard={true}
          imgSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Lichess_Logo_2019.svg/240px-Lichess_Logo_2019.svg.png"
          chessGameControllerRef={chessGameControllerRef}
          isPlayerTurn={
            isWhiteTurn == chessGameControllerRef.current?.isPlayerWhite
          }
        />
      </div>
    </div>
  );
}

function GameProfileCard({
  isPlayerCard,
  imgSrc,
  chessGameControllerRef,
  isPlayerTurn,
}: {
  isPlayerCard: boolean;
  imgSrc: string;
  chessGameControllerRef: React.RefObject<ChessGameController | null>;
  isPlayerTurn?: boolean;
}) {
  const backgroundColor = isPlayerCard ? "bg-white/50" : "bg-[#303030]";
  const positionClass = isPlayerCard
    ? isPlayerTurn
      ? "left-1/4 bottom-10"
      : "left-1/4 bottom-0"
    : isPlayerTurn
    ? "right-1/12 top-0"
    : "right-1/12 top-10";
  const textColor = isPlayerCard ? "text-black" : "text-white";
  return (
    <div
      className={`absolute flex justify-around items-center ${positionClass} duration-300 -translate-x-1/2 w-[18%] h-[100px] z-10 rounded-md m-2 ${backgroundColor} text-white backdrop-blur-lg shadow-sm`}
    >
      {/* overlay */}
      {isPlayerCard && !isPlayerTurn && (
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30 rounded-md"></div>
      )}
      {!isPlayerCard && isPlayerTurn && (
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-20 rounded-md"></div>
      )}
      {/* Profile Image and name */}
      <div className="flex items-center gap-2">
        <img
          src={imgSrc}
          className="rounded-full w-[2.5rem] h-[2.5rem] bg-black"
        />
        <h1 className={` text-[10px] ${textColor}`}>
          {isPlayerCard ? "Player" : "Mr. BOT"}
        </h1>
      </div>

      {/* Timer and buttons */}
      <div className="flex items-center gap-2">
        <h1 className={`font-semibold text-[12px] ${textColor}`}>00:00</h1>
      </div>

      {isPlayerCard && (
        <button
          onClick={async () => {
            await chessGameControllerRef.current?.resign();
          }}
          className="group flex justify-center items-center bg-white w-10 h-10 rounded-md duration-300 hover:bg-[#f0f0f0] shadow-md"
        >
          <FlagFilled
            className={`text-center ${textColor}`}
            style={{ color: "black" }}
          />
        </button>
      )}
    </div>
  );
}

function MovesLogger({ moves }: { moves: [string, string][] }) {
  return (
    <div
      className="absolute flex flex-col duration-300 justify-start  items-center  -translate-y-1/2 top-1/2  bg-white/2 bg-opacity-40 shadow-md backdrop-blur-xl z-10 left-10 w-[100px] h-[80vh] rounded-xl gap-5 pt-10 pb-10"
      style={{ scrollbarWidth: "none", overflowY: "scroll" }}
    >
      {moves.map((move, index) => {
        const isLastMove = index === moves.length - 1;
        return (
          <div
            key={index}
            className={`text-[10px] scrollbar flex flex-row justify-center items-end text-gray-500 font-semibold hover:bg-[#c4c4c4] rounded-md w-full text-center p-1 duration-300 ${
              isLastMove ? "bg-[#303030] text-white" : ""
            }`}
          >
            <img
              src={`/assets/pieces_icons/${
                !isLastMove ? move[0] + `_b` : move[0]
              }.png`}
              className="opacity-100 w-6 h-6"
            />
            <h1 className="">{move[1]}</h1>
          </div>
        );
      })}
    </div>
  );
}
