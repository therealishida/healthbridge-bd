import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F8F7F4",
        surface: "#FFFFFF",
        "surface-2": "#E2E8F0",
        line: "#E2E8F0",
        ink: "#0A0A0F",
        "ink-muted": "#5A5A66",
        primary: "#003265",
        accent: "#00B02A",
        alert: {
          orange: "#F26522",
          red: "#ED1C24"
        }
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
};
export default config;
