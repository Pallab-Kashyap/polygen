import Header from "@/components/Header";
import "../styles/globals.css";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Polygen",
  description: "Designed for you",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div className="">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
