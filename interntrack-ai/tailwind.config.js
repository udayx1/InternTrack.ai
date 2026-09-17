/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f3ff',
          100: '#ebe8ff',
          200: '#d9d4ff',
          300: '#bcb0ff',
          400: '#9b83ff',
          500: '#7c5cfc',
          600: '#6a3ef0',
          700: '#5c2fd4',
          800: '#4c27ab',
          900: '#3f2388',
          950: '#261354',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f7f7fb',
          page: '#f4f5fa',
        },
        ink: {
          900: '#14152b',
          700: '#33344d',
          500: '#5c5d78',
          400: '#83849c',
          300: '#a9aac0',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 21, 43, 0.04), 0 1px 8px rgba(20, 21, 43, 0.04)',
        popover: '0 8px 30px rgba(20, 21, 43, 0.12)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
