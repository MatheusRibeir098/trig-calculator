/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: '#8B5CF6',
        'navy': '#001F3F',
      }
    },
  },
  plugins: [],
}
