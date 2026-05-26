import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#071018",
        panel: "#101a24",
        line: "#233242",
        court: "#f97316",
        rim: "#38bdf8",
        mint: "#2dd4bf"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(56, 189, 248, 0.12), 0 18px 50px rgba(0, 0, 0, 0.32)"
      }
    }
  },
  plugins: []
} satisfies Config;
