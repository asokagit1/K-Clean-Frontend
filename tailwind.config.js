/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F4C42", // Dark Green from logo/design
        secondary: "#F2C94C", // Gold/Yellow from logo/design
      },
    },
  },
  plugins: [],
}
