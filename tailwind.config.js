/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
      extend: {
          colors: {
              'yt-black': '#121212',
              'yt-light-gray': '#282828',
          },
      },
  },
  plugins: [],
}