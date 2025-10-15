import Header from "@/components/Header";
import "../styles/globals.css";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/contexts/ToastContext";

export const metadata = {
  title: "Polygen",
  description: "Designed for you",
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
      </body>
    </html>
  );
}
