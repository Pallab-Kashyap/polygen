import React from "react";
import { ChevronRight, MoveRight } from "lucide-react"; // Icon for the button

const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      // Subtle gradient from a light grey to a light pink, as seen in the image
      className=" relative bg-white py-20 sm:py-24 overflow-hidden"
    >
      <div className="relative container mx-auto max-w px-4 flex flex-col items-center text-center z-10">
        {/* Main Heading */}
        <div className="flex flex-col items-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900">
            About Us
          </h2>

          {/* Red Underline */}
          <div className="w-3/4 h-1 bg-[#de1448] mt-3 mb-8 rounded-full" />
        </div>

        {/* Introductory Paragraph */}
        <p className="text-2xl text-gray-700 leading-relaxed ">
          Founded in 2023, Polygen brings precision and reliability to
          irrigation systems through a curated range of essential products —
          from wires and multistrand cables to DOL starters, Kitkat fuses, and
          spares. With an eye on the future, we’re also expanding into MCBs,
          ammeters, and voltmeters, all driven by a single vision: to deliver
          quality that keeps farms running and fields thriving.
        </p>

        {/* Red Seal Quality Section */}
        <div className="mt-16 w-full">
          <h3 className="text-4xl font-black text-[#de1448] ">
            RED SEAL QUALITY
          </h3>
          <div className="mt-8 space-y-6 text-2xl text-gray-700 leading-relaxed  mx-auto">
            <p>
              At Polygen, quality isn’t left to chance — it’s built in from the
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
        <div className="mt-12 w-full flex justify-end ">
          <button
            className="group flex items-center gap-2 px-5 py-3 border border-gray-400 rounded-lg text-2xl font-medium text-black
                       hover:bg-[#de1448]  transition-all duration-500"
          >
            <span>Explore to upgrade</span>
            <ChevronRight className=" transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
      {/* Red Overlay */}
      {/* <div
        className="absolute z-10"
        style={{
          bottom: 0,
          left: 0,
          width: "1000px",
          height: "1500px",
          background:
            "radial-gradient(circle at top left, rgba(58,13,18), transparent 70%)",
          pointerEvents: "none",
        }}
      /> */}
      <div className="absolute -bottom-40 -left-40 h-[60vh] w-[68vh] shadow-red-500 sh blur-3xl opacity-20 bg-red-500 rounded-full"></div>
    </section>
  );
};

export default AboutSection;
