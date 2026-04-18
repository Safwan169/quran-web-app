import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./contexts/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0D0D0D",
        card: "#141414",
        border: "#2A2A2A",
        primary: "#C9A84C",
        secondary: "#8B5E3C",
        textPrimary: "#F5F0E8",
        textMuted: "#888888",
        arabic: "#E8D5A3",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 420ms ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
