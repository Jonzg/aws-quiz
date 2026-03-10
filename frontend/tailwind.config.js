/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        aws: {
          orange: '#FF9900',
          dark: '#232F3E',
          light: '#F8F9FA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-correct': 'pulseCorrect 0.5s ease-in-out',
        'pulse-wrong': 'pulseWrong 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseCorrect: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(40, 167, 69, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(40, 167, 69, 0)' },
        },
        pulseWrong: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(220, 53, 69, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(220, 53, 69, 0)' },
        },
      },
    },
  },
  plugins: [],
}
