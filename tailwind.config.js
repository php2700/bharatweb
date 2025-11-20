/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
        sf: ['"SF Pro Display"', "sans-serif"], // ✅ add SF Pro Display
      },
    },
  },
  plugins: [],
};

