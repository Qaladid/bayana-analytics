import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-manrope)", "Manrope", "sans-serif"],
      },
      colors: {
        clario: {
          bg: "#050505",
          dark: "#0d0d0d",
          accent: "#8cff2e",
          white: "#ffffff",
          offwhite: "#f8f8fa",
          surface: "#f5f5f2",
          muted: "#2f2f2f",
          gray: "#c8c8c0",
          border: "#171717",
        },
      },
      borderRadius: {
        "23px": "23px",
        "30px": "30px",
      },
    },
  },
  plugins: [],
};

export default config;
