"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images: string[] = [
  "slider/slider1.jpg",
  "slider/slider2.jpeg",
  "slider/slider3.webp",
  "slider/slider4.webp",
];

export default function ImageSlider() {
  const [current, setCurrent] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const startX = useRef<number>(0);
  const diff = useRef<number>(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    diff.current = e.touches[0].clientX - startX.current;
  };

  const handleTouchEnd = () => {
    if (diff.current > 50) prevSlide();
    if (diff.current < -50) nextSlide();
    diff.current = 0;
  };

  return (
    <div
      className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${current * 100}%)`,
          width: `${images.length * 100}%`,
        }}
      >
        {images.map((img, index) => (
          <div key={index} className="shrink-0 w-full h-full">
            <img src={img} alt={`Slide ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
      >
        <ChevronRight />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === current ? "bg-white scale-125" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
