/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
  primario: {
    DEFAULT: '#ffc400c5',
    50: '#e7f0ff',
    100: '#d5e6ff',
    // ...
  },
  secundario: {
    DEFAULT: '#6c757d',
  },
},
    },
  },
  plugins: [],
};
