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
      <div className="relative z-20 md:h-full  flex  md:items-center px-6 md:px-20 order-1 ">
        <div className="w-full  space-y-8 pt-20">
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
        </div>
        <div className=" absolute z-20 bottom-16">
          <p className=" hidden md:block font-bold text-lg">WIRES & CABLES</p>
        </div>
      </div>

      {/* Red Seal Badge */}
      <div className="absolute bottom-56 right-4 md:top-56 md:right-16 h-[80px] w-[80px] md:h-[120px] md:w-[120px] transform -translate-y-1/2 z-20">
        <Image
          src="/assets/redseal.svg"
          alt="Red Seal"
          fill
          className="object-contain"
        />
      </div>
    </section>
  );
}
