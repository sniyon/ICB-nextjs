"use client";

import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Edges, Box } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { FBXLoader } from "three/examples/jsm/Addons.js";

//Tile
type TileProps = {
  isBlack: boolean;
  Tilesize: number;
  position: THREE.Vector3;
  index: number;
  colIndex: number;
  rowIndex: number;
  selected: number | null;
  setSelect: React.Dispatch<React.SetStateAction<null | number>>;
};

function Tile({
  isBlack = true,
  Tilesize = 0.5,
  position = new THREE.Vector3(0, 0, 0),
  index = 0,
  selected = 0,
  setSelect,
  colIndex = 0,
  rowIndex = 0,
}: TileProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const blackColor = "#2b2b2b";
  const whiteColor = "#ffffff";
  const edgeColorHovered = "#83ff6e";
  const edgeColorNotHovered = isBlack ? blackColor : whiteColor;

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.position, {
        z: selected == index ? 0.3 : 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [selected, index]);

  useFrame(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.3 + (rowIndex + colIndex) * 0.1,
        ease: "power2.out",
      });
    }
  });

  return (
    <mesh
      scale={[0, 0, 0]}
      ref={meshRef}
      onPointerOver={() => {
        setHover(true);
        setSelect(index);
      }}
      onPointerOut={() => {
        setHover(false);
        if (selected != null) setSelect(null);
      }}
    >
      <Box ref={undefined} args={[Tilesize, Tilesize, 0.2]} position={position}>
        <meshToonMaterial color={isBlack ? blackColor : whiteColor} />
        <Edges color={hovered ? edgeColorHovered : edgeColorNotHovered} threshold={15} />
      </Box>
    </mesh>
  );
}

//Pieces

type PieceProps = {
  index: number;
  selected: number | null;
  type: string
};

function Piece({ index = 0, selected, type = 'p' }: PieceProps) {
  const piece = useLoader(FBXLoader,`models/pieces/${type}.fbx`);
  const meshRef = useRef<THREE.Mesh>(null);
  const blackColor = "#2b2b2b";
  const initialPositionX = -3 * 0.6;
  const initialPositionY = 0.09;
  const initialPositionZ = 0.1;
  const horizontalPosition = index % 8;
  const verticalPosition = Math.trunc(index / 8);
  const squareSize = 0.6;

  //Piece Shaders
  useEffect(() => {
    piece.scale.set(0.008, 0.008, 0.008);
    piece.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshToonMaterial({ color: blackColor });
      }
    });
  }, [piece, blackColor]);

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.position, {
        x: initialPositionX + horizontalPosition * squareSize,
        y: initialPositionY + verticalPosition * squareSize,
        z: selected == index + 1 ? initialPositionZ + 0.3 : initialPositionZ,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [selected, index, initialPositionZ]);

  return (
    <mesh
      ref={meshRef}
      rotation={[Math.PI / 2, 0, 0]}
      position={[
        initialPositionX + horizontalPosition * squareSize,
        initialPositionY + verticalPosition * squareSize,
        initialPositionZ,
      ]}
    >
      <primitive object={piece} />
    </mesh>
  );
}

//Board
type BoardProps = {
  selected: null | number;
  setSelect: React.Dispatch<React.SetStateAction<null | number>>;
  fen: string
};

function Board({ selected, setSelect, fen ="" }: BoardProps) {
  const tileSize = 0.6;
  const boardOffset = tileSize * 3;
  return (
    //Tiles
    <>
      {/* Place Tiles */}
      <mesh rotation={[0, 0, 0]} position={new THREE.Vector3(-boardOffset, 0, 0)}>
        {Array.from({ length: 8 }).map((_, rowIndex) => (
          <mesh key={rowIndex}>
            {Array.from({ length: 8 }).map((_, colIndex) => (
              <Tile
                key={`${rowIndex}-${colIndex}`}
                isBlack={
                  rowIndex % 2 == 0
                    ? colIndex % 2 == 0
                    : !(colIndex % 2 == 0)
                }
                Tilesize={tileSize}
                position={new THREE.Vector3(colIndex * tileSize, rowIndex * tileSize, 0)}
                index={colIndex + Math.pow(9, rowIndex)}
                colIndex={colIndex}
                rowIndex={rowIndex}
                selected={selected}
                setSelect={setSelect}
              />
            ))}
          </mesh>
        ))}
      </mesh>

      {/* Place Pieces */}

    </>
  );
}


export default function ICBBoard() {
  const [selected, setSelect] = useState<null | number>(null);
  return (
    <div className="w-full h-[600px]">
      <Canvas camera={{ fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={10} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <Board selected={selected} setSelect={setSelect} fen="" />
        <Piece index={8} selected={selected} type="p" />
      </Canvas>
    </div>
  );
}