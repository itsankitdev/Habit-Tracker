/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // enables dark: prefix
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        // Light theme surface colors
        surface: {
          DEFAULT: "#ffffff",
          secondary: "#f4f4f5",
          border: "#e4e4e7",
        },
      },
    },
  },
  plugins: [],
};