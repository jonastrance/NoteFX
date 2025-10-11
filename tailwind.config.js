/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,jsx,js}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#0EA5E9',
          foreground: '#FFFFFF'
        },
        accent: {
          DEFAULT: '#22C55E',
          foreground: '#052e16'
        }
      }
    }
  },
  plugins: []
};
