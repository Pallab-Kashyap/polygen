"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const videos = [
  "assets/Laptop/Hero_Section_Video/video1.mp4",
  "assets/Laptop/Hero_Section_Video/video2.mp4",
  "assets/Laptop/Hero_Section_Video/video3.mp4",
];

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoIndex, setVideoIndex] = useState(0);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const handleEnded = () => {
      setVideoIndex((prev) => (prev + 1) % videos.length);
    };

    videoEl.addEventListener("ended", handleEnded);
    return () => videoEl.removeEventListener("ended", handleEnded);
  }, []);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.src = videos[videoIndex];
      videoEl.play();
    }
  }, [videoIndex]);

  return (
    // <section className="relative flex-1 w-full overflow-hidden">
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        muted
        autoPlay
        playsInline
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-10" />

      {/* Red Overlay */}
      <div
        className="absolute z-10"
        style={{
          top: 0,
          left: 0,
          width: "1000px",
          height: "1500px",
          background:
            "radial-gradient(circle at top left, rgba(58,13,18), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div className="relative z-20 h-full flex items-center px-6 md:px-20">
        <div className="w-full md:w-1/2 space-y-8 pt-20">
          <h1 className="text-4xl md:text-7xl font-bold">Designed For You</h1>
          <div>
            <p className="text-2xl ">
              Step into the world of innovative electrical equipment,
            </p>
            <p className="text-2xl">designed toexplore new possibilities</p>
          </div>
          <button className="bg-white text-2xl text-black px-8 py-5 rounded-2xl font-medium hover:bg-red-700 hover:text-white transition-all duration-500 w-max cursor-pointer">
            Explore to upgrade
          </button>
        </div>
        <div className=" absolute z-20 bottom-16">
          <p className="font-bold text-lg">WIRES & CABLES</p>
        </div>
      </div>

      {/* Red Seal Badge */}
      <div className="absolute top-56 right-16 transform -translate-y-1/2 z-20">
        <Image
          src="/assets/redseal.svg"
          alt="Red Seal"
          width={120}
          height={120}
        />
      </div>
    </section>
  );
}
