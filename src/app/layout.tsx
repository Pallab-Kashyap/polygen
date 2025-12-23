import Header from "@/components/Header";
import "../styles/globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/contexts/ToastContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Polygen",
  description: "Designed for you",
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ToastProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
