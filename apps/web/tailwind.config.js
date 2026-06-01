/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          top: '#0F1028',
          bottom: '#2A1B4A',
        },
        ivory: '#F5F0E1',
        lavender: '#A89FB8',
        gold: '#D4AF37',
        element: {
          wood: '#4A6FA5',
          fire: '#C84B4B',
          earth: '#E8B84A',
          metal: '#F0EDE5',
          water: '#2C2C3E',
        },
      },
      fontFamily: {
        body: ['Pretendard', 'sans-serif'],
        display: ['"Gowun Batang"', 'serif'],
        numeric: ['"Cormorant Garamond"', 'serif'],
      },
      maxWidth: {
        app: '420px',
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'fade-in': 'fadeIn 1.2s ease-out forwards',
        'scale-in': 'scaleIn 1.2s ease-out forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 60px 20px var(--glow-color, rgba(212,175,55,0.3))' },
          '50%': { boxShadow: '0 0 100px 40px var(--glow-color, rgba(212,175,55,0.5))' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
