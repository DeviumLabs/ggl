/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw-",

  content: [
    "./pages/**/*.js",
    "./pages/*.js",
    "./components/**/*.js",
    "./components/*.js",
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
      screens: {
        notebook: { max: "1440px" },
        // => @media (max-width: 1279px) { ... }

        mobile: { max: "1024px" },
        // => @media (max-width: 1023px) { ... }
      },
    },
  },
  plugins: [],
};
