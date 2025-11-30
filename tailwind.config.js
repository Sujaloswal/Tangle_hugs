/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F0',
        blush: '#E8C5D8',
        'blush-light': '#F5E6EE',
        'blush-dark': '#D4A5C0',
        sage: '#B8C5B0',
        yarn: '#2D2D2D',
        'yarn-light': '#5A5A5A',
        accent: '#FF6B9D',
      },
      fontFamily: {
        cursive: ['Dancing Script', 'cursive'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(232, 197, 216, 0.15)',
        'soft-lg': '0 10px 40px rgba(232, 197, 216, 0.2)',
      },
    },
  },
  plugins: [],
}
