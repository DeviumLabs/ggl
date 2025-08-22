/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw-",

  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
    "./sections/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  safelist: [
    {
      pattern: /(before|after):tw-content-.+/,
    },
  ],

  theme: {
    extend: {
      colors: {
        lightBackground: "#F2F2F2",
        blue: "#0058C2",
        darkBlue: "#073998",
      },
    },
  },

  plugins: [],
};
