"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  LucideProps,
} from "lucide-react";
import Heading from "./shared/Heading";
import Container from "./shared/Container";
import sendMail from "@/services/mailService";
import { useToast } from "@/contexts/ToastContext";

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
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      showToast("Please enter a valid email address.", "error");
      setIsSubmitting(false);
      return;
    }

    try {
      await sendMail({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        type: "contact",
      });

      showToast(
        "Thank you! Your message has been sent successfully.",
        "success"
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      console.error("Error sending email:", error);
      showToast(
        error?.message || "Failed to send message. Please try again later.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-us">
      <section className="relative bg-[#F2F1F2] py-16 sm:py-20">
        <Container className="relative">
          {/* Main Heading */}
          <Heading>Contact Us</Heading>

          {/* Grid Layout for the main content - adjusted proportions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
            {/* Left Column: Contact Form Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg h-fit">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
                Get In Touch
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4 text-black">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Rohan Singh"
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-[#de1448] focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    E-Mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="someone@example.com"
                    required
                    pattern="[^\s@]+@[^\s@]+\.[^\s@]{2,}"
                    title="Please enter a valid email address"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-[#de1448] focus:outline-none"
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
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Startup spotlight"
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-[#de1448] focus:outline-none"
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
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="I want to know about...."
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:border-[#de1448] focus:outline-none"
                  ></textarea>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#de1448] text-white font-bold py-3 rounded-lg text-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Social Media and Map */}
            <div className="flex flex-col gap-6">
              {/* Follow Us Card */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  Follow us on
                </h3>
                <div className="flex items-center justify-between md:justify-around">
                  <a
                    href="#"
                    aria-label="Instagram"
                    className="text-gray-400 hover:text-pink-600 transition-colors"
                  >
                    <Instagram className="h-8 w-8" />
                  </a>
                  <a
                    href="#"
                    aria-label="Twitter"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <Twitter className="h-8 w-8" />
                  </a>
                  <a
                    href="#"
                    aria-label="WhatsApp"
                    className="text-gray-400 hover:text-green-500 transition-colors"
                  >
                    <WhatsappIcon className="h-8 w-8" />
                  </a>
                  <a
                    href="#"
                    aria-label="LinkedIn"
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Linkedin className="h-8 w-8" />
                  </a>
                  <a
                    href="#"
                    aria-label="Facebook"
                    className="text-gray-400 hover:text-blue-800 transition-colors"
                  >
                    <Facebook className="h-8 w-8" />
                  </a>
                </div>
              </div>

              {/* Reach Us Card - Larger map */}
              <div className="flex flex-col bg-white p-6 rounded-2xl shadow-lg flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-4 ">
                  Reach us at
                </h3>
                <div className="rounded-lg overflow-hidden border border-gray-200 flex-1">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d111624.23438812674!2d75.64799984335937!3d29.144415500000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391232d807664687%3A0x7dfe694665457a6!2sHisar%2C%20Haryana!5e0!3m2!1sen!2sin!4v1722953282421!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Red Seal Icon - positioned with consistent margins */}
          <div className="absolute top-[10vh] right-6 hidden md:block">
            <Image
              src="/assets/redseal.svg"
              alt="Red Seal Quality"
              width={80}
              height={100}
            />
          </div>
        </Container>
      </section>

      {/* Bottom Footer Bar */}
      <footer className="bg-[#de1448] text-white py-4">
        <Container className="flex flex-col md:flex-row justify-between items-center text-center sm:text-left">
          <div className="mb-2 sm:mb-0">
            <Image
              src="/assets/logo-white.svg"
              alt="Polygen Logo"
              width={200}
              height={35}
            />
          </div>
          <div className="text-sm md:text-md space-y-1 sm:space-y-0 sm:text-right">
            <p className="hidden md:block">
              Developed by Pallab Kashyap Designed By Rohit Tiwari
            </p>
            <p>All rights reserved by Mataji Agencies</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Footer;
