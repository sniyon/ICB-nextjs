"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "../../styles/Pages/Homepage/Section_2.css";
import { ChevronDown } from "lucide-react";
import section2image from "../../assets/HomePage/section2_image.jpg";

export default function Section_2() {
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`section2-container ${isVisible ? "visible" : ""}`}
    >
      <div className="section2-right-part">
        <div className="section2-image-container">
          <Image
            src={section2image}
            alt="section image"
            className="section2-image"
          />
        </div>

        <button onClick={() => Onclick()} className="section2-button">
          <ChevronDown className="section2-button-icon" />
        </button>
      </div>

      <div className="section2-left-part">
        <div className="section2-text-container">
          <span className="section2-subheading">Play Smarter.</span>
          <p className="section2-subtitle">
            Master every move with real-time guidance and intuitive insights.
            ICB helps you sharpen your strategy and level up your game, whether
            you're a beginner or a seasoned player.
          </p>
        </div>
      </div>
    </div>
  );
}

function Onclick() {
  var element = document.getElementById("section3");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}
