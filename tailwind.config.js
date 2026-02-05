module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  prefix: "tw-",
  theme: {
    extend: {
      colors: {
        blue: "#0058C2",
        darkBlue: "#0F172A"
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Arial", "sans-serif"],
        serif: ["var(--font-merri)", "ui-serif", "Georgia", "serif"]
      }
    }
  },
  plugins: []
};
