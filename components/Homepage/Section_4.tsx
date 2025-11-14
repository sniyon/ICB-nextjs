"use client";
import { useEffect, useRef, useState } from "react";
import "../../styles/Pages/Homepage/Section_4.css";
import black_white_board from "../../assets/HomePage/black_white_board.jpg";
import Image from "next/image";

export default function Section_4() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting && entry.intersectionRatio > 0.5);
      },
      {
        threshold: [0, 0.5, 1],
      }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`section4-container ${isVisible ? "visible" : ""}`}
    >
      <div className="section4-image-wrapper">
        <Image
          src={black_white_board}
          alt="Chess board"
          className="section4-image"
        />
      </div>
      <div className="section4-content">
        <h2 className="section4-heading">Follow Our Journey</h2>
        <p className="section4-paragraph">
          Want to be the first to know about our latest progress, new features,
          and exciting milestones? Sign up with your email to receive exclusive
          updates on our project. No spam — just the good stuff.
        </p>
        <form className="section4-form">
          <button type="submit" className="section4-button">
            Submit
          </button>
          <input
            type="email"
            placeholder="type your email"
            className="section4-input"
          />
        </form>
      </div>
    </div>
  );
}
