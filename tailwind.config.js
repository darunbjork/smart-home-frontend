/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "var(--brand)",
        surface: "var(--bg-surface)",
        border: "var(--border)",
      },
    },
  },
  plugins: [],
}