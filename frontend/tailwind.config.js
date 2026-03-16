/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}', './styles/**/*.{css}'],
  theme: {
    extend: {
      colors: {
        primary:   {
          50:  '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe',
          300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1',
          600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81',
        },
        secondary: {
          50:  '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0',
          300: '#6ee7b7', 400: '#34d399', 500: '#10b981',
          600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b',
        },
        accent: {
          50:  '#fff7ed', 100: '#ffedd5', 200: '#fed7aa',
          300: '#fdba74', 400: '#fb923c', 500: '#f97316',
          600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial':    'radial-gradient(var(--tw-gradient-stops))',
        'gradient-hero':      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-card':      'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      animation: {
        'float':     'float 6s ease-in-out infinite',
        'pulse-slow':'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        card:  '0 4px 24px rgba(0,0,0,0.06)',
        glow:  '0 0 20px rgba(99,102,241,0.4)',
      },
    },
  },
  plugins: [],
};
