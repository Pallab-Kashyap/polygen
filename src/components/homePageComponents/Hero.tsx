"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Container from "../shared/Container";

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
    <section className="relative flex md:block justify-evenly flex-col bg-black h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="md:absolute  inset-0 w-full md:h-full object-cover z-0 order-2"
        muted
        autoPlay
        playsInline
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-50 z-10" />

      {/* Red Overlay */}
      <div
        className="absolute z-10 md:hidden bg-black h- w-full"
        // style={{
        //   top: 0,
        //   left: 0,
        //   width: "1000px",
        //   height: "1500px",
        //   background:
        //     "radial-gradient(circle at top left, rgba(0, 0, 0), transparent 70%)",
        //   pointerEvents: "none",
        // }}
      />

      {/* Content */}
      <div className="relative z-20 md:h-full flex md:items-center order-1">
        <Container className="relative w-full h-full flex items-center pt-20">
          <div className="relative w-full space-y-8 ">
            <h1 className="text-4xl md:text-7xl font-bold">Designed For You</h1>
            <div>
              <p className="text-sm md:text-2xl max-w-[40rem] whitespace-pre-wrap md:whitespace-normal">
                Step into the world of innovative electrical equipment, designed
                to explore new possibilities
              </p>
              {/* <p className="md:text-2xl inline">
              designed toexplore new possibilities
            </p> */}
            </div>
            <button className="w-full md:w-max bg-white text-xl md:text-2xl text-black  px-4 md:px-8 py-3 md:py-5 rounded-2xl font-medium hover:bg-red-700 hover:text-white transition-all duration-500  cursor-pointer">
              Explore to upgrade
            </button>


            {/* Red Seal Badge - positioned within container margins */}
            <div className="absolute botto-56 -right-3 md:-top-[16vh] h-[80px] w-[80px] md:h-[140px] md:w-[140px] transform md:-translate-y-1/2">
              <Image
                src="/assets/redseal.svg"
                alt="Red Seal"
                fill
                className="object-contain"
                />
            </div>
          </div>

      {/* WIRES & CABLES text - positioned within container margins */}
          <div className="absolute bottom-4">
            <p className="hidden md:block font-bold text-lg text-white">
              WIRES & CABLES
            </p>
          </div>
        </Container>
      </div>
    </section>
  );
}
