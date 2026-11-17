/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#11101B',
        'secondary-bg': '#171625',
        'card-bg': '#1C1A2B',
        'elevated': '#242137',
        primary: '#7965F5',
        secondary: '#A78BFA',
        highlight: '#C4B5FD',
        success: '#47D7B0',
        'text-primary': '#F5F3FF',
        'text-secondary': '#A6A1B8',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
