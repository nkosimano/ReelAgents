/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary & Secondary Colors from "Growth Catalyst" palette
        'primary': {
          DEFAULT: '#065F46', // Verdant Green
        },
        'secondary': {
          DEFAULT: '#6D28D9', // Catalyst Purple
        },

        // Neutral Palette: Stone Gray
        'neutral': {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
          950: '#0C0A09',
        },
        
        // Semantic Accent Colors
        'success': '#22C55E', // Bright Green
        'warning': '#F97316', // Warm Amber
        'danger': '#EF4444',  // Rich Red
        'info': '#3B82F6',    // Muted Blue
      },
    },
  },
  plugins: [],
};