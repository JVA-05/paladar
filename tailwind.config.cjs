/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  safelist: ['translate-x-0', 'translate-x-full', '-translate-x-full'],

  theme: {
    extend: {
      colors: {
        amber: { 600: '#D97706', 700: '#B45309' },
      },
    },
  },

  plugins: [], // 👈  ya no necesitas @tailwindcss/line-clamp
};
