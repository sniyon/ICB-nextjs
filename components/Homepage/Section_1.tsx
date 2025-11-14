import "../../styles/Pages/Homepage/Section_1.css";
import pointsBG from "@/public/assets/HomePage/pointsBG.png";
import chess_piece from "@/public/assets/HomePage/chess_piece.png";
import Image from "next/image";

export default function Section_1() {
  return (
    <div className="section1-container">
      <div className="top-20 section1-subcontainer">
        {/* Background stuff */}
        <div className="section1-glass-overlay" />
        <Image
          src={pointsBG}
          alt="Background Points"
          className="section1-bg-image"
        />

        {/* Title Text */}
        <div className="section1-text-container">
          <h1 className="section1-title">INTERACTIVE</h1>
          <h1 className="section1-subtitle">CHESSBOARD</h1>
        </div>

        {/* Image of the piece */}
        <div className="section1-image-container">
          <Image
            src={chess_piece}
            alt="Chess Piece"
            className="section1-piece-image"
          />
        </div>
      </div>
    </div>
  );
}
