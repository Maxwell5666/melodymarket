/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#5b21b6',
          700: '#4c1d95',
        },
        secondary: {
          500: '#ec4899',
          600: '#db2777',
        },
        accent: {
          500: '#10b981',
          600: '#059669',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}