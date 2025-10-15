import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/pages/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#de1448",
          dark: "#3a0d12",
          light: "#fef2f2",
        },
        primary: "#B91C1C",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
