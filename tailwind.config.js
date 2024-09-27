/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // fontSize: {
      //   xxxs: "0.25vw",
      //   xxs: "0.5vw",
      //   ms: "0.75vw",
      //   xs: "1vw",
      //   sm: "1.25vw",
      //   base: "1.3vw",
      //   lg: "1.75vw",
      //   xl: "2vw",
      //   "2xl": "2.5vw",
      //   "3xl": "3vw",
      //   "4xl": "3.5vw",
      //   "5xl": "4vw",
      //   "6xl": "4.5vw",
      //   "7xl": "5vw",
      //   "8xl": "6vw",
      //   "9xl": "7vw",
      //   "10xl": "8vw",
      //   "11xl": "9vw",
      //   "12xl": "10vw",
      //   "13xl": "11vw",
      //   "14xl": "12vw",
      //   "15xl": "13vw",
      //   "16xl": "14vw",
      //   "17xl": "15vw",
      //   "18xl": "16vw",
      //   "19xl": "17vw",
      //   "20xl": "18vw",
      //   "21xl": "19vw",
      //   "22xl": "20vw",
      //   "23xl": "21vw",
      //   "24xl": "22vw",
      //   "25xl": "23vw",
      //   "26xl": "24vw",
      //   "27xl": "25vw",
      //   "28xl": "26vw",
      //   "29xl": "27vw",
      // },
      colors: {
        primary: "#12223D", // Primary color for main actions and highlights
        secondary: "#D9D9D9", // Secondary color for backgrounds and secondary elements
        accent: "#E98508", // Accent color for important highlights and accents
        dark: "#454343", // Dark color for text, navbar, and footer backgrounds
        light: "#ECEAEA", // Light color for backgrounds and light elements
        neutral: "#6b7280", // Neutral color for secondary text and icons
        success: "#15803d", // Success color for success messages and indicators
        warning: "#f59e0b", // Warning color for warning messages and indicators
        danger: "#ef4444", // Danger color for error messages and indicators
      },
      whiteSpace: {
        "pre-line": "pre-line",
      },
    },
  },
  plugins: [],
};
