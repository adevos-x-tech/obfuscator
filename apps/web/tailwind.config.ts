import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#0a0b0d",
          900: "#111318",
          800: "#181b21",
          700: "#22262e",
          600: "#2d323c",
          500: "#3a4049"
        },
        neon: {
          500: "#39ff88",
          400: "#5cffa0",
          600: "#22d46e"
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "monospace"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"]
      },
      boxShadow: {
        neon: "0 0 0 1px rgba(57,255,136,0.35), 0 0 24px rgba(57,255,136,0.12)"
      }
    }
  },
  plugins: []
};

export default config;
