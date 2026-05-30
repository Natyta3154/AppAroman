/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        primario: {
          DEFAULT: '#ffc400',
          50: '#fff7e0',
          100: '#fff0c2',
          200: '#ffe28a',
          300: '#ffd64d',
          400: '#ffc400',
          500: '#ffb400',
        },
        secundario: {
          DEFAULT: '#6c757d',
          50: '#f3f4f5',
          100: '#e6e7e8',
          200: '#cfd2d4',
          300: '#b8bbbf',
        },
        brand: {
          light: '#E9D8FD',
          primary: '#775c92',
          dark: '#a06b9a',
        }
      },
    },
  },
  plugins: [],
};
