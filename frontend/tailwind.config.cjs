module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['system-ui', 'sans-serif'],
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'FadeInUp': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'gradient-x': 'gradient-x 12s ease infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'fade-in-up': 'FadeInUp 0.6s ease-out both',
      },
      boxShadow: {
        glow: '0 10px 30px rgba(79, 70, 229, 0.4)',
      },
      backgroundImage: {
        'soft-radial':
          'radial-gradient(circle at top left, rgba(129, 140, 248, 0.35), transparent 55%), radial-gradient(circle at bottom right, rgba(56, 189, 248, 0.35), transparent 55%)',
      },
    },
  },
  plugins: [],
}
