"use client";
import { useEffect, useRef, useState } from "react";
import "../../styles/Pages/Homepage/Section_3.css";
import adaptable_training from "@/public/assets/HomePage/adaptable_training.jpg";
import online_matchmaking from "@/public/assets/HomePage/online_matchmaking.jpg";
import physical_touch from "@/public/assets/HomePage/physical_touch.jpg";
import Image from "next/image";

export default function Section_3() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting && entry.intersectionRatio > 0.2);
      },
      { threshold: [0, 0.5, 1] }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`section3-container ${isVisible ? "visible" : ""}`}
      id="section3"
    >
      <div className="section3-header">
        <h2 className="section3-heading">Empowering Your Play Style</h2>
        <p className="section3-subheading">
          Explore our unique features designed to enhance your learning and
          connection experience.
        </p>
      </div>

      <div className="section3-features">
        <div className="section3-feature">
          <div className="section3-image-container">
            <Image
              src={adaptable_training}
              alt="Adaptable Training"
              className="section3-feature-image"
            />
          </div>
          <h3 className="section3-feature-heading">Adaptable Training</h3>
          <p className="section3-feature-text">
            Customized learning paths that evolve with each user's goals, pace,
            and progress.
          </p>
        </div>

        <div className="section3-feature">
          <div className="section3-image-container">
            <Image
              src={online_matchmaking}
              alt="Online Matchmaking"
              className="section3-feature-image"
            />
          </div>
          <h3 className="section3-feature-heading">Online Matchmaking</h3>
          <p className="section3-feature-text">
            Smart pairing technology connects users with the right peers,
            mentors, or opportunities—instantly.
          </p>
        </div>

        <div className="section3-feature">
          <div className="section3-image-container">
            <Image
              src={physical_touch}
              alt="Physical Touch"
              className="section3-feature-image"
            />
          </div>
          <h3 className="section3-feature-heading">Physical Touch</h3>
          <p className="section3-feature-text">
            Bridging digital and real-world experiences through hands-on events
            and in-person interactions.
          </p>
        </div>
      </div>
    </section>
  );
}
