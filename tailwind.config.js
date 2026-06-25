/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        muted: "#667085",
        line: "#E4E7EC",
        paper: "#FFFFFF",
        soft: "#F6F7F9"
      },
      boxShadow: {
        panel: "0 10px 30px rgba(16, 24, 40, 0.06)"
      }
    }
  },
  plugins: []
};
