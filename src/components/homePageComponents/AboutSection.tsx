import React from "react";
import { ChevronRight, MoveRight } from "lucide-react";
import Heading from "../shared/Heading";
import Container from "../shared/Container";
import Link from "next/link";

const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className=" relative bg-white py-10 sm:py-24 overflow-hidden"
    >
      <Container className="relative flex flex-col items-center text-center z-10 space-y-8 md:space-y-12">
        {/* Main Heading */}
        <Heading>About Us</Heading>

        {/* Introductory Paragraph */}
        <p className="text-lg md:text-2xl text-gray-700 leading-relaxed">
          Founded in 2023, Polygen brings precision and reliability to
          irrigation systems through a curated range of essential products —
          from wires and multistrand cables to DOL starters, Kitkat fuses, and
          spares. With an eye on the future, we're also expanding into MCBs,
          ammeters, and voltmeters, all driven by a single vision: to deliver
          quality that keeps farms running and fields thriving.
        </p>

        {/* Red Seal Quality Section */}
        <div className="w-full space-y-6 md:space-y-8">
          <h3 className="text-2xl sm:text-4xl md:text-4xl lg:text-5xl font-black text-[#de1448]">
            RED SEAL QUALITY
          </h3>
          <div className="space-y-6 text-lg md:text-2xl text-gray-700 leading-relaxed mx-auto">
            <p>
              At Polygen, quality isn't left to chance — it's built in from the
              start. Red Seal Quality is our signature mark, symbolizing a
              rigorous process where every product is tested, inspected, and
              approved to meet real-world field conditions. From the copper in
              our multistrand cables to the durability of our DOL starters and
              fuses, each part carries this seal as a promise of reliability,
              safety, and long service life.
            </p>
            <p>
              More than a label, Red Seal Quality is our commitment to farmers,
              technicians, and businesses: to deliver products that perform when
              it matters most — season after season, year after year.
            </p>
          </div>
        </div>

        {/* "Explore to upgrade" Button */}
        <div className="w-full flex justify-around md:justify-end">
          <Link href={"/about"}
            className="group flex items-center gap-2 px-5 py-3 border border-gray-400 rounded-lg text-lg md:text-2xl font-medium text-black
                       hover:bg-[#de1448] hover:text-white  transition-all duration-500"
          >
            <span>Learn more</span>
            <ChevronRight className=" transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
      <div className="absolute -bottom-40 -left-40 h-[60vh] w-[68vh] shadow-red-500 sh blur-3xl opacity-20 bg-red-500 rounded-full"></div>
    </section>
  );
};

export default AboutSection;
