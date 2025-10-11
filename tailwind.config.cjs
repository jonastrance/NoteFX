/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          dark: '#4338CA'
        },
        accent: '#22D3EE'
        primary: '#4f46e5',
        secondary: '#6366f1',
        accent: '#22c55e'
      }
    }
  },
  plugins: []
};
