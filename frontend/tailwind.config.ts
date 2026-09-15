import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        border: "hsl(var(--border))",
        notion: {
          canvas: "#fbfbfa",
          paper: "#ffffff",
          hover: "#f1f1ef",
          active: "#eaeae8",
          border: "#e9e9e7",
          text: "#2f3437",
          muted: "#787774",
          subtle: "#9b9a97",
        },
        primary: {
          DEFAULT: "#2f3437",
          hover: "#1f2326",
          light: "#37352f",
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
        pulseFast: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
