import React, { useRef, useEffect, useState, type Dispatch, type SetStateAction} from "react";
import { useFrame } from "@react-three/fiber";
import { Edges, Box } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

export class Tile {
  selected: number | null;
  hovered: number | null;
  legalMoves: Array<number>;
  index: number;
  isBlack: boolean;
  tileSize: number;
  position: THREE.Vector3;
  checkedPieceIndex: number | null;
  setSelected: Dispatch<SetStateAction<number | null>>;
  setHovered: Dispatch<SetStateAction<number | null>>;

  constructor(
    selected: number | null,
    hovered: number | null,
    legalMoves: Array<number>,
    index: number,
    isBlack: boolean,
    tileSize: number,
    position: THREE.Vector3,
    setSelected: Dispatch<SetStateAction<number | null>>,
    setHovered: Dispatch<SetStateAction<number | null>>,
    checkedPieceIndex: number | null
  ) {
    this.selected = selected;
    this.hovered = hovered;
    this.legalMoves = legalMoves;
    this.index = index;
    this.tileSize = tileSize;
    this.position = position;
    this.isBlack = isBlack;
    this.setSelected = setSelected;
    this.setHovered = setHovered;
    this.checkedPieceIndex = checkedPieceIndex;
  }
}

export const TileComponent: React.FC<{ tile: Tile }> = ({ tile }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const blackColor = "#2b2b2b";
  const whiteColor = "#ffffffff";
  const [currentEdgeColor, setCurrentEdgeColor] = useState("");
  const [currentEdgeLineWidth, setCurrentEdgeLineWidth] = useState(0);
  const [refresh,setRefresh] = useState(0);
  const edgeColorHoveredOrSelected = "#83ff6e";
  const edgeColorLegalMove = "#3258a8";
  const edgeColorChecked = "#ff0000";
  const defaultLineWidth = 3;
  tile.position.z = tile.selected === tile.index || tile.legalMoves.includes(tile.index)? 0.3:0; // TODO: Fix overlapping animations

  useEffect(() => {
        if (meshRef.current) {
          meshRef.current.position.z =
            tile.selected === tile.index || tile.hovered === tile.index ? 0.3 : 0;
        }
      }, []); // Initial mount only
  
  //Tile 
  useEffect(() => {
    if (meshRef.current) {
      const shouldRaise = tile.selected === tile.index || tile.hovered === tile.index || tile.legalMoves.includes(tile.index);
      const targetZ = tile.selected === tile.index ? 0.3 : shouldRaise ? 0.3 : 0; // Prevent z reset if already selected

      gsap.to(meshRef.current.position, {
        z: targetZ,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }, [tile.selected, tile.hovered]);

  useFrame(() => {
    //Animations
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  });

  useEffect(() => {
    //edge color
    if(tile.index == tile.checkedPieceIndex){
      setCurrentEdgeColor(edgeColorChecked);
      setCurrentEdgeLineWidth(defaultLineWidth);
    }
    else if(tile.legalMoves.includes(tile.index)){
      setCurrentEdgeColor(edgeColorLegalMove);
      setCurrentEdgeLineWidth(defaultLineWidth);
    }
    else if(tile.selected == tile.index || tile.hovered == tile.index){
      setCurrentEdgeColor(edgeColorHoveredOrSelected);
      setCurrentEdgeLineWidth(defaultLineWidth);
    }
    else{
      setCurrentEdgeColor("#8b3636ff");
      setCurrentEdgeLineWidth(0);
    }

  }, [tile.legalMoves,tile.selected, tile.hovered,tile.checkedPieceIndex]);

  return (
    <mesh
      scale={[0, 0, 0]}
      ref={meshRef}
      onPointerOver={() => tile.setHovered(tile.index)}
      onClick={() => tile.setSelected(tile.index)}
      position={tile.position}
    >
      <Box args={[tile.tileSize, tile.tileSize, 0.2]}>
        <meshToonMaterial color={tile.isBlack ? blackColor : whiteColor} />
        <Edges color={currentEdgeColor} lineWidth={currentEdgeLineWidth} threshold={15} />
      </Box>
    </mesh>
  );
};