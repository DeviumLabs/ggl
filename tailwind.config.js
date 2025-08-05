/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw-",

  content: [
    "./pages/**/*.js",
    "./pages/*.js",
    "./components/**/*.js",
    "./components/*.js",
  ],

  safelist: [
    {
      pattern: /before:tw-content-.+/,
    },
  ],

  theme: {
    extend: {
      colors: {
        white: "#fff",
        lightBackground: "#F2F2F2",
        blue: "#0058C2",
        darkBlue: "#073998",
        black: "#474747",
      },
    },
  },
  plugins: [],
};
