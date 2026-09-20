/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        friction: {
          low: '#10b981',
          medium: '#f59e0b',
          high: '#f97316',
          critical: '#ef4444',
        },
        // Light mode surfaces
        light: {
          bg: '#F5F7FA',
          surface: '#FFFFFF',
          surfaceAlt: '#F1F5F9',
          border: '#E2E8F0',
          borderStrong: '#CBD5E1',
          text: '#0F172A',
          textMuted: '#64748B',
          textSubtle: '#94A3B8',
        },
        // Dark mode surfaces
        dark: {
          bg: '#15181D',
          surface: '#1C2128',
          surfaceAlt: '#252B33',
          border: '#303741',
          borderStrong: '#46505C',
          text: '#F8FAFC',
          textMuted: '#94A3B8',
          textSubtle: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(99, 102, 241, 0.3)',
        'glow-danger': '0 0 25px -5px rgba(239, 68, 68, 0.3)',
        'glow-success': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'card-light': '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.07)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.10)',
      }
    },
  },
  plugins: [],
}
