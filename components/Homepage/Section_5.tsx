"use client";
import { useEffect, useRef, useState } from "react";
import "../../styles/Pages/Homepage/Section_5.css";
import Card from "./Card";
import card_image_placeholder from "@/assets/HomePage/card_image_placeholder.png";

export default function Section_5() {
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
      className={`section5-container ${isVisible ? "visible" : ""}`}
    >
      <h1 className="section5-title">Our Updates:</h1>
      <Card
        title="New Website"
        date="15 Jan"
        description="We're announcing that we just released our new website with more to come"
        image="/assets/HomePage/card_image_placeholder.png"
      />
    </div>
  );
}
