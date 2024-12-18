// src/components/Slideshow.js
import React, { useState } from "react";
import "../../App.css";

export default function Slideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = ["./img/slide1.jpg", "./img/slide2.jpg", "./img/slide3.jpg"];

  const changeSlide = (n) => {
    let newSlide = (currentSlide + n + slides.length) % slides.length;
    setCurrentSlide(newSlide);
  };

  return (
    <div className="slideshow-container mb-4">
      {slides.map((slide, index) => (
        <div
          className="slide"
          key={index}
          style={{ display: index === currentSlide ? "block" : "none" }}
        >
          <img src={slide} alt={`Slide ${index + 1}`} />
        </div>
      ))}
      <button className="prev-button" onClick={() => changeSlide(-1)}>
        &#10094;
      </button>
      <button className="next-button" onClick={() => changeSlide(1)}>
        &#10095;
      </button>
    </div>
  );
}
