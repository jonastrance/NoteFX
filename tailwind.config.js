import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          foreground: '#ffffff'
        },
        surface: {
          DEFAULT: '#111827',
          muted: '#1f2937',
          border: '#374151'
        }
      }
    }
  },
  plugins: [typography]
};
