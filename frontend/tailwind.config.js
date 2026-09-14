/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#082B3A",
        teal: "#087F78",
        forest: "#138A5B",
        gold: "#F5B83D",
        orange: "#F28A16",
        cream: "#FFF9EF",
        sky: "#EAF6F7",
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        sunrise: "linear-gradient(120deg, #FFF4D8 0%, #FFD28A 55%, #F28A16 100%)",
        evening: "linear-gradient(120deg, #082B3A 0%, #0A4F5C 55%, #087F78 100%)",
      },
      borderRadius: {
        card: "20px",
      },
    },
  },
  plugins: [],
};
