import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode defaults (you already use these in the UI)
        background: "rgb(255 255 255)",
        foreground: "rgb(17 24 39)",
        primary: "rgb(59 130 246)",
        // Dark mode overrides will be added automatically by Tailwind
      },
    },
  },
  plugins: [],
};

export default config;