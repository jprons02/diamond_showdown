import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: "#0ED3CF",
          "teal-dark": "#099E9B",
          "teal-light": "#5EEAE6",
          dark: "#1A1A2E",
          surface: "#16162A",
          charcoal: "#2D2D3D",
        },
      },
      fontFamily: {
        heading: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        body: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      defaultTheme: "dark",
      themes: {
        dark: {
          colors: {
            background: "#0F0F1A",
            foreground: "#ECEDEE",
            primary: {
              50: "#E6FFFE",
              100: "#B3FFFC",
              200: "#80FFF9",
              300: "#4DFFF7",
              400: "#1AFFF4",
              500: "#0ED3CF",
              600: "#0AA8A5",
              700: "#077D7B",
              800: "#055352",
              900: "#022828",
              DEFAULT: "#0ED3CF",
              foreground: "#FFFFFF",
            },
            focus: "#0ED3CF",
          },
        },
      },
    }),
  ],
};

export default config;
