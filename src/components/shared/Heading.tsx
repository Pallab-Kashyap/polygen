import React from "react";

const Heading = ({ children = "", className = "" }) => {
  return (
    <div className="text-center mb-4 md:mb-16">
      <h1
        className={`relative inline-block font-bold text-gray-900
        text-3xl sm:text-4xl md:text-5xl lg:text-6xl
        after:content-[''] after:block after:w-[70%] after:h-1
        after:bg-[#de1448] after:rounded-full after:mx-auto after:mt-2
        ${className}`}
      >
        {children}
      </h1>
    </div>
  );
};

export default Heading;
