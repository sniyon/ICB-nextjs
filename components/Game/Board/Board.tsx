// Board.tsx
"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
  type RefObject,
} from "react";

import { Piece, PieceComponent } from "./Piece";
import { Tile, TileComponent } from "./Tile";
import ChessGameController, { type GameMode } from "./ChessGameController";
import BoardMenus from "./BoardMenus";
import utils from "../../../utils/utils";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

interface BoardProps {
  chessGameControllerRef: RefObject<ChessGameController | null>;
}

export default function Board({ chessGameControllerRef }: BoardProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(
    null
  );
  const [checkedPieceIndex, setCheckedPieceIndex] = useState<number | null>(
    null
  );
  const [previouslySelectedTile, setPreviouslySelectedTile] = useState<
    number | null
  >(null);
  const [legalMoves, setLegalMoves] = useState<number[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<string | null>(
    null
  );
  const [menuActive, setMenuActive] = useState(false);
  const [menuType, setMenuType] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [forceRerender, setForceRerender] = useState(0);

  const piecesRef = useRef<Piece[]>([]);
  const tilesRef = useRef<Tile[]>([]);
  const lastMoveRef = useRef("");
  const previouslyFetchedMove = useRef<string | null>(null);
  const initialized = useRef(false);

  // Preload 3D models
  const models: Record<string, THREE.Group<THREE.Object3DEventMap>> = {
    p: useLoader(FBXLoader, "/models/pieces/p.fbx"),
    r: useLoader(FBXLoader, "/models/pieces/r.fbx"),
    n: useLoader(FBXLoader, "/models/pieces/n.fbx"),
    b: useLoader(FBXLoader, "/models/pieces/b.fbx"),
    q: useLoader(FBXLoader, "/models/pieces/q.fbx"),
    k: useLoader(FBXLoader, "/models/pieces/k.fbx"),
    p_b: useLoader(FBXLoader, "/models/pieces/p_b.fbx"),
    r_b: useLoader(FBXLoader, "/models/pieces/r_b.fbx"),
    n_b: useLoader(FBXLoader, "/models/pieces/n_b.fbx"),
    b_b: useLoader(FBXLoader, "/models/pieces/b_b.fbx"),
    q_b: useLoader(FBXLoader, "/models/pieces/q_b.fbx"),
    k_b: useLoader(FBXLoader, "/models/pieces/k_b.fbx"),
  };

  // Initialize board
  useEffect(() => {
    (async () => {
      if (initialized.current) return;
      initialized.current = true;

      const controller = chessGameControllerRef.current;
      if (!controller) return;

      previouslyFetchedMove.current = await controller.getLastMove();
      piecesRef.current = getPiecesArrayFromFen(
        controller.getCurrentFen(),
        selectedTileIndex,
        hovered,
        legalMoves,
        models,
        checkedPieceIndex
      );

      controller.capturedBlackPiece.forEach((type) => {
        const p = new Piece(
          type.toLowerCase() + "_b",
          true,
          0,
          null,
          null,
          legalMoves,
          models,
          checkedPieceIndex
        );
        p.captured();
        piecesRef.current.push(p);
      });
      controller.capturedWhitePiece.forEach((type) => {
        const p = new Piece(
          type.toLowerCase(),
          false,
          0,
          null,
          null,
          legalMoves,
          models,
          checkedPieceIndex
        );
        p.captured();
        piecesRef.current.push(p);
      });

      setForceRerender((prev) => prev + 1);
    })();
  }, []);

  // Update piece states on hover/selection
  useEffect(() => {
    piecesRef.current.forEach((piece) => {
      piece.selected = selectedTileIndex;
      piece.hovered = hovered;
      piece.legalMoves = legalMoves;
      piece.checkedPieceIndex = checkedPieceIndex;
    });
  }, [hovered, selectedTileIndex, legalMoves, checkedPieceIndex]);

  // Periodically fetch game updates
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const controller = chessGameControllerRef.current;
      if (!controller) return;

      const data = await controller.getLastGameUpdates();
      const fetchedMove = await controller.getLastMove();

      if (fetchedMove && fetchedMove !== previouslyFetchedMove.current) {
        previouslyFetchedMove.current = fetchedMove;
        if (fetchedMove !== lastMoveRef.current) {
          lastMoveRef.current = fetchedMove;
          handleOpponentMove(fetchedMove);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  });

  // Listen to status changes
  useEffect(() => {
    const controller = chessGameControllerRef.current;
    if (!controller) return;

    const handleStatusChange = (newStatus: string) => {
      setMenuActive(true);
      setMenuType("result");
      setResult(
        newStatus === "mate"
          ? controller.isWhiteTurn
            ? "White"
            : "Black"
          : newStatus
      );
    };

    controller.on("statusChange", handleStatusChange);
    return () => {
      controller.listeners.set(
        "statusChange",
        controller.listeners
          .get("statusChange")
          ?.filter((cb) => cb !== handleStatusChange) || []
      );
    };
  }, []);

  // Handle player moves
  useEffect(() => {
    if (!chessGameControllerRef.current || selectedTileIndex === null) return;
    const controller = chessGameControllerRef.current;

    if (controller.isPlayerWhite !== controller.isWhiteTurn) return;

    const legalMovesIndices =
      controller.getLegalMovesTileIndecies(selectedTileIndex);
    setLegalMoves(legalMovesIndices ?? []);

    if (previouslySelectedTile === null) {
      setPreviouslySelectedTile(selectedTileIndex);
      return;
    }

    const moveAttempt =
      utils.convertTileIndiciesToName(previouslySelectedTile) +
      utils.convertTileIndiciesToName(selectedTileIndex);
    const selectedPiece = piecesRef.current.find(
      (p) => p.index === previouslySelectedTile
    );
    if (!selectedPiece) return;

    // Handle promotions, castling, and normal moves
    handleMove(selectedPiece, moveAttempt);
  }, [selectedTileIndex, selectedPromotion]);

  // Check detection
  useEffect(() => {
    if (!chessGameControllerRef.current) return;
    const controller = chessGameControllerRef.current;
    if (!controller.isCheck()) {
      setCheckedPieceIndex(null);
      return;
    }

    const kingType = controller.isWhiteTurn ? "k" : "k_b";
    const king = piecesRef.current.find((p) => p.type === kingType);
    setCheckedPieceIndex(king?.index ?? null);
  }, [chessGameControllerRef.current?.isCheck()]);

  if (!chessGameControllerRef.current) return null;

  const tileSize = 0.6;
  const boardOffset = tileSize * 3;

  return (
    <div className="relative w-full h-[100vh] bg-[#ededed] z-10">
      <Canvas
        camera={{ fov: 60 }}
        style={{
          filter: menuActive ? "blur(10px)" : "blur(0px)",
          pointerEvents: menuActive ? "none" : "auto",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <group
          rotation={[
            0,
            0,
            chessGameControllerRef.current.isPlayerWhite ? 0 : Math.PI,
          ]}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={10} />
          {placeTiles(
            tilesRef,
            selectedTileIndex,
            hovered,
            legalMoves,
            setSelectedTileIndex,
            setHovered,
            checkedPieceIndex
          )}
          {placePieces(piecesRef.current)}
          <OrbitControls enablePan enableZoom enableRotate />
        </group>
      </Canvas>
      <BoardMenus
        active={menuActive}
        setActive={setMenuActive}
        setSelectedPromotion={setSelectedPromotion}
        menuType={menuType}
        result={result}
      />
    </div>
  );
}

// --- Helper Functions ---

function placeTiles(
  tilesRef: RefObject<Tile[]>,
  selected: number | null,
  hovered: number | null,
  legalMoves: number[],
  setSelected: Dispatch<SetStateAction<number | null>>,
  setHovered: Dispatch<SetStateAction<number | null>>,
  checkedPieceIndex: number | null
) {
  const tiles: Tile[] = [];
  const tileSize = 0.6;
  for (let i = 0; i < 64; i++) {
    const col = i % 8;
    const row = Math.floor(i / 8);
    const pos = new THREE.Vector3(col * tileSize, row * tileSize, 0);
    const tile = new Tile(
      selected,
      hovered,
      legalMoves,
      i,
      (row + col) % 2 === 0,
      tileSize,
      pos,
      setSelected,
      setHovered,
      checkedPieceIndex
    );
    tiles.push(tile);
  }
  tilesRef.current = tiles;

  return (
    <group position={[-tileSize * 3, 0, 0]}>
      {Array.from({ length: 8 }).map((_, row) => (
        <group key={`row-${row}`}>
          {Array.from({ length: 8 }).map((_, col) => {
            const tile = tiles[col + 8 * row];
            return <TileComponent key={`tile-${tile.index}`} tile={tile} />;
          })}
        </group>
      ))}
    </group>
  );
}

function placePieces(pieces: Piece[]) {
  return pieces.map((p) => (
    <PieceComponent key={`piece-${p.index}-${p.type}`} piece={p} />
  ));
}

// --- Move handling functions ---

function handleOpponentMove(fetchedMove: string) {
  // logic to convert fetchedMove to fromIndex/toIndex and move pieces
  // implement similar to your old Board logic
}

function handleMove(selectedPiece: Piece, rawMove: string) {
  // logic to handle promotions, castling, normal moves
  // implement similar to your old Board logic
}

function getPiecesArrayFromFen(
  fen: string,
  selected: number | null,
  hovered: number | null,
  legalMoves: number[],
  models: Record<string, THREE.Group<THREE.Object3DEventMap>>,
  checkedPieceIndex: number | null
) {
  const pieces: Piece[] = [];
  const rows = fen.split(" ")[0].split("/").reverse();
  let idx = 0;

  for (const row of rows) {
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (!isNaN(Number(char))) {
        idx += Number(char);
        continue;
      }
      const isBlack = char === char.toLowerCase();
      const type = isBlack ? char.toLowerCase() + "_b" : char.toLowerCase();
      pieces.push(
        new Piece(
          type,
          isBlack,
          idx,
          selected,
          hovered,
          legalMoves,
          models,
          checkedPieceIndex
        )
      );
      idx++;
    }
  }
  return pieces;
}
