/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/views/**/*.html.erb",
    "./app/helpers/**/*.rb",
    "./app/javascript/**/*.js",
    "./app/javascript/**/*.jsx"
  ],
  theme: {
    extend: {
      colors: {
        mint: {
          50: "#f4fbf6",
          100: "#e7f7eb",
          200: "#d5f0dc",
          300: "#bce6c8",
          400: "#95d6a8",
          500: "#73c18b"
        },
        rosepastel: {
          50: "#fff6fa",
          100: "#fdebf3",
          200: "#f9d8e8",
          300: "#f2bcd6",
          400: "#e597be",
          500: "#d873a7"
        }
      }
    }
  },
  plugins: []
}
