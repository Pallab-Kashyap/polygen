import React from "react";
import Image from "next/image";
import {
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  LucideProps,
} from "lucide-react";

// A simple Whatsapp icon component as it's not in lucide-react by default
const WhatsappIcon = (props: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const Footer: React.FC = () => {
  return (
    <>
      <section className="relative bg-gray-50 py-20 sm:py-24">
        <div className="container mx-auto max-w-5xl px-4">
          {/* Main Heading */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Contact Us
            </h1>
            <div className="w-24 h-1 bg-[#de1448] mt-4 mx-auto rounded-full" />
          </div>

          {/* Grid Layout for the main content */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left Column: Contact Form Card */}
            <div className="lg:col-span-3 bg-white p-8 sm:p-12 rounded-2xl shadow-lg">
              <h2 className="text-4xl font-bold text-black mb-8">
                Get In Touch
              </h2>
              <form action="#" method="POST" className="space-y-6">
                <div>
                  <label
                    htmlFor="full-name"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full-name"
                    id="full-name"
                    placeholder="Rohan Singh"
                    className="w-full px-4 py-3 border border-black rounded-lg"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    E Mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="someone@some.com"
                    className="w-full px-4 py-3 border border-black rounded-lg"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    placeholder="Startup spotlight"
                    className="w-full px-4 py-3 border border-black rounded-lg"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    placeholder="I want to know about...."
                    className="w-full px-4 py-3 border border-black rounded-lg"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full bg-[#de1448] text-white font-bold py-4 rounded-lg text-xl hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Social Media and Map */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* Follow Us Card */}
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Follow us on
                </h3>
                <div className="flex items-center justify-around">
                  <a
                    href="#"
                    aria-label="Instagram"
                    className="text-gray-500 hover:text-black transition-colors"
                  >
                    <Instagram className="h-8 w-8" />
                  </a>
                  <a
                    href="#"
                    aria-label="Twitter"
                    className="text-gray-500 hover:text-black transition-colors"
                  >
                    <Twitter className="h-8 w-8" />
                  </a>
                  <a
                    href="#"
                    aria-label="WhatsApp"
                    className="text-gray-500 hover:text-green-500 transition-colors"
                  >
                    <WhatsappIcon className="h-8 w-8" />
                  </a>
                  <a
                    href="#"
                    aria-label="LinkedIn"
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Linkedin className="h-8 w-8" />
                  </a>
                  <a
                    href="#"
                    aria-label="Facebook"
                    className="text-gray-500 hover:text-blue-800 transition-colors"
                  >
                    <Facebook className="h-8 w-8" />
                  </a>
                </div>
              </div>

              {/* Reach Us Card */}
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Reach us at
                </h3>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <iframe
                    // NOTE: The src URL has been updated to a valid Google Maps embed link for demonstration.
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d111624.23438812674!2d75.64799984335937!3d29.144415500000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391232d807664687%3A0x7dfe694665457a6!2sHisar%2C%20Haryana!5e0!3m2!1sen!2sin!4v1722953282421!5m2!1sen!2sin"
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Red Seal Icon */}
          <div className="absolute top-16 right-4 sm:right-8 lg:right-16 hidden md:block">
            <Image
              src="/assets/redseal.svg" // Replace with your Red Seal icon path
              alt="Red Seal Quality"
              width={120}
              height={120}
            />
          </div>
        </div>
      </section>

      {/* Bottom Footer Bar */}
      <footer className="bg-[#de1448] text-white py-4">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <div className="mb-4 sm:mb-0">
            <Image
              src="/assets/logo-white.svg" // Replace with your white logo path
              alt="Polygen Logo"
              width={150}
              height={35}
            />
          </div>
          <div className="text-xs sm:text-sm space-y-1 sm:space-y-0">
            <p>Developed by Pallab Kashyap Designed By Rohit Tiwari</p>
            <p>All rights reserved by Mataji Agencies</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
