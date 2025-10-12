import Heading from "@/components/shared/Heading";
import Container from "@/components/shared/Container";
import Image from "next/image";
import React from "react";

function page() {
  return (
    <div className="min-h-screen bg-white mt-20">
      <div className="h-full w-full">
        <img
          src="/assets/About/about-banner.png"
          alt="Background"
          className="w-full h-[20vh] md:h-full"
        />
      </div>

      {/* Header Section */}
      <section className="relative bg-white py-6 sm:py-10 overflow-hidden">
        <Container className="relative flex flex-col items-center text-center z-10">
          <Heading className="">
            The Reliability Your Irrigation System Needs
          </Heading>
          <p className="text-lg md:text-2xl text-gray-700 leading-relaxed">
            Founded in 2023, Polygen brings precision and reliability to
            irrigation systems through a curated range of essential products —
            from wires and multistrand cables to DOL starters, Kitkat fuses, and
            spares. With an eye on the future, we're also expanding into MCBs,
            ammeters, and voltmeters, all driven by a simple vision: to deliver
            quality that keeps farms running and fields thriving.
          </p>
        </Container>
      </section>

      {/* Red Seal Quality Section */}
      <section className="relative bg-white py-6 sm:py-10 overflow-hidden">
        <Container className="relative flex flex-col items-center text-center z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#de1448] mb-6">
            RED SEAL QUALITY
          </h2>

          <div className="flex flex-col lg:flex-row items-center gap-8  mx-auto">
            <div className="flex-1 text-lg md:text-2xl text-gray-700 leading-relaxed space-y-6">
              <p>
                At Polygen, quality isn't left to chance — it's built in from
                the start. Red Seal Quality is our signature mark, symbolizing a
                rigorous process where every product is tested, inspected, and
                approved to meet real-world field conditions. From the copper in
                our multistrand cables to the durability of our DOL starters and
                fuses, each part carries this seal as a promise of reliability,
                safety, and long service life.
              </p>
              <p>
                More than a label, Red Seal Quality is our commitment to
                farmers, technicians, and businesses: to deliver products that
                perform when it matters most — season after season, year after
                year.
              </p>
            </div>

            {/* Red Seal Logo */}
            <div className=" hidden md:block flex-shrink-0 self-start">
              <Image
                src="/assets/redseal.svg"
                alt="Red Seal Quality Logo"
                width={144}
                height={144}
                className="w-40 h-40"
              />
            </div>
          </div>
        </Container>
        {/* <div className="absolute -bottom-40 -right-40 h-[60vh] w-[68vh] shadow-red-500 sh blur-3xl opacity-20 bg-red-500 rounded-full"></div> */}
      </section>

      {/* Certified Section */}
      <section className="relative  py-6 sm:py-10 overflow-hidden">
        <Container className="relative flex flex-col items-center text-center z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
            Certified for a Higher Standard
          </h2>
          <p className="text-lg md:text-2xl text-gray-700 leading-relaxed mb-10 max-w-6xl mx-auto">
            We believe quality results come from quality processes. By using
            superior materials and a zero-tolerance approach to flaws, we ensure
            every cable and wire outlasts industry standards. Our official
            certifications verify this commitment to you.
          </p>

          {/* Certification Images Grid */}
          <div className="flex justify-center items-center gap-6 flex-wrap">
            <div className="w-24 h-32 md:w-40 md:h-52 relative">
              <Image
                src="/assets/About/certificate-01.png"
                alt="Certificate 1"
                fill
                className="object-contain"
              />
            </div>
            <div className="w-24 h-32 md:w-40 md:h-52 relative">
              <Image
                src="/assets/About/certificate-02.png"
                alt="ISI Certificate"
                fill
                className="object-contain"
              />
            </div>
            <div className="w-24 h-32 md:w-40 md:h-52 relative">
              <Image
                src="/assets/About/certificate-03.png"
                alt="ISO Certificate"
                fill
                className="object-contain"
              />
            </div>
            <div className="w-24 h-32 md:w-40 md:h-52 relative">
              <Image
                src="/assets/About/certificate-04.png"
                alt="ISO Certificate"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </Container>
        <div className="absolute -bottom-40 -left-40 h-[60vh] w-[68vh] shadow-red-500 sh blur-3xl opacity-20 bg-red-500 rounded-full"></div>
      </section>

      {/* Quality Priority Section with Dark Background */}
      <section className="relative py-16 overflow-hidden">
        <Container className="relative z-10">
          <div className="flex flex-col lg:flex-row mx-[4vw] md:mx-auto md:items-center justify-between gap-8">
            <div className="text-white text-left md:text-center lg:text-left">
              <h2 className="text-xl md:text-5xl lg:text-6xl font-black mb-2">
                Quality is No.1
              </h2>
              <h2 className="text-xl md:text-5xl lg:text-6xl font-black">
                Priority
              </h2>
            </div>
          </div>
        </Container>
        {/* Product Image */}
        <div className="w-full h-full absolute inset-0 flex items-center justify-center">
          <Image
            src="/assets/About/mid-banner-about-us.jpeg"
            alt="Quality Priority - Cable/Wire Product"
            fill
            className="w-full h-full "
          />
        </div>
      </section>

      {/* Our Family of Brands Section */}
      <section className="relative bg-white py-10 sm:py-24 overflow-hidden">
        <Container className="relative flex flex-col items-center text-center z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
            Our Family of Brands
          </h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
            Explore our range of trusted brands, each committed to quality and
            performance.
          </p>

          {/* Brand Logos Grid */}
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {/* Polygen Logo 1 */}
            <div className="w-12 h-10 md:w-36 md:h-20 relative">
              <Image
                src="/assets/logo.svg"
                alt="Polygen Logo"
                fill
                className="object-contain"
              />
            </div>

            {/* Polygen Logo 2 */}
            <div className="w-12 h-10 md:w-36 md:h-20 relative">
              <Image
                src="/assets/logo.svg"
                alt="Polygen Logo"
                fill
                className="object-contain"
              />
            </div>

            {/* Yogyata Logo 1 */}
            <div className="w-12 h-10 md:w-36 md:h-20 relative">
              <Image
                src="/assets/About/yogyata.png"
                alt="Yogyata Logo"
                fill
                className="object-contain"
              />
            </div>

            {/* Yogyata Logo 2 */}
            <div className="w-12 h-10 md:w-36 md:h-20 relative">
              <Image
                src="/assets/About/yogyata.png"
                alt="Yogyata Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default page;
