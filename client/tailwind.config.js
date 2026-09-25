/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03'
        },
        surface: {
          dark: '#0F1117',
          card: '#1A1D27',
          cardHover: '#222634',
          border: 'rgba(255, 255, 255, 0.08)'
        },
        accent: {
          emerald: '#10B981',
          rose: '#EF4444',
          amber: '#F59E0B'
        }
      }
    },
  },
  plugins: [],
}
