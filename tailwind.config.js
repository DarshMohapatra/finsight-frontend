/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:      "#020408",
        surface: "#0a0e1a",
        border:  "#1a1f2e",
        green:   "#00f5a0",
        blue:    "#00d4ff",
        purple:  "#7b61ff",
        red:     "#ff3c64",
        amber:   "#f59e0b",
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
    },
  },
  plugins: [],
}