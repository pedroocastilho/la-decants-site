// tailwind.config.js
const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', ...fontFamily.sans], // Mantém a fonte padrão para o corpo
        serif: ['"Playfair Display"', ...fontFamily.serif], // Adiciona a nova fonte
      },
    },
  },
  plugins: [],
}