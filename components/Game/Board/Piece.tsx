import React, { useRef, useEffect, useState } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

// Pure data class
export class Piece {
  type: string;
  isBlack: boolean;
  index: number;
  prevIndex: number;
  selected: number | null;
  hovered: number | null;
  legalMoves: Array<number>;
  checkedPieceIndex: number | null;
  static capturedWhitePieceNextIndex = 64;
  static capturedBlackPieceNextIndex = -1;
  models:Record<string,THREE.Group<THREE.Object3DEventMap>> = {};

  constructor(type: string, isBlack: boolean, index:number, selected: number | null, hovered:number | null, legalMoves: Array<number>, models:Record<string,THREE.Group<THREE.Object3DEventMap>>, checkedPieceIndex: number | null) {
    this.type = type;
    this.isBlack = isBlack;
    this.index = index;
    this.prevIndex = 0; //Make a dispatch animation from tile 0
    this.selected = selected;
    this.hovered = hovered;
    this.legalMoves = legalMoves;
    this.models = models;
    this.checkedPieceIndex = checkedPieceIndex;
  }

  moveToNewIndex(newIndex:number){
    this.prevIndex = this.index;
    this.index = newIndex;
  }

  captured(){
    if (this.isBlack) {
      this.moveToNewIndex(Piece.capturedBlackPieceNextIndex);
      Piece.capturedBlackPieceNextIndex = Piece.capturedBlackPieceNextIndex-1;
    }
    else{
      this.moveToNewIndex(Piece.capturedWhitePieceNextIndex);
      Piece.capturedWhitePieceNextIndex = Piece.capturedWhitePieceNextIndex+1;
    }
  }

  promote(newType:string){
    this.type = newType;
  }
}

export const PieceComponent: React.FC<{ piece: Piece }> = ({ piece }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const model = piece.models[piece.type];
  const [index, setIndex] = useState<number>(piece.index);
  const [prevIndex, setPrevIndex] = useState<number>(piece.prevIndex);

  useEffect(() => {
    if (piece.index !== index) {
      setPrevIndex(index);
      setIndex(piece.index);
    }
  }, [piece.index]);

  const clonedModel = React.useMemo(() => {
    const clone = model.clone();
    clone.scale.set(0.008, 0.008, 0.008);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = child.material.clone();
      }
    });
    return clone;
  }, [model]);

  const initialPositionX = -3 * 0.6;
  const initialPositionY = 0.09;
  const initialPositionZ = 0.1;
  const actualHorizontalPosition =
    piece.index >= 0 ? Math.abs(piece.index) % 8 : (Math.abs(index) - 1) % 8;
  const actualVerticalPosition = Math.floor(piece.index / 8);

  const previousVerticalPosition = Math.abs(prevIndex) % 8;
  const previousHorizontalPosition = Math.floor(prevIndex / 8);

  const squareSize = 0.6;

  useFrame(() => {
    const shouldRaise =
      piece.selected === piece.index ||
      piece.hovered === piece.index ||
      piece.legalMoves.includes(piece.index);

    if (meshRef.current) {
      gsap.to(meshRef.current.position, {
        x: initialPositionX + actualHorizontalPosition * squareSize,
        y: initialPositionY + actualVerticalPosition * squareSize,
        z: shouldRaise ? initialPositionZ + 0.3 : initialPositionZ,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }); //N.B: UseFrame is essential to sync with Tile Re-Render


  return (
    <mesh
      ref={meshRef}
      rotation={[Math.PI / 2, 0, 0]}
      position={[
        initialPositionX + previousHorizontalPosition * squareSize,
        initialPositionY + previousVerticalPosition * squareSize,
        initialPositionZ,
      ]}
    >
      <ambientLight intensity={0.1} />
      <primitive object={clonedModel} />
    </mesh>
  );
};
