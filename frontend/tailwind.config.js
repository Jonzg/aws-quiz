/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        aws: {
          orange: '#FF9900',
          dark: '#0D1117',
          card: '#161B22',
          border: '#21262D',
          muted: '#8B949E',
        },
        brand: {
          50:  '#fff8eb',
          100: '#ffefc7',
          200: '#ffdc89',
          300: '#ffc33d',
          400: '#ffaa14',
          500: '#FF9900',
          600: '#e07b00',
          700: '#b55b00',
          800: '#924500',
          900: '#783a00',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'glow-orange': '0 0 20px rgba(255, 153, 0, 0.3)',
        'glow-green':  '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-red':    '0 0 20px rgba(239, 68, 68, 0.3)',
        'card':        '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.6)',
        'card-hover':  '0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,153,0,0.2)',
      },
      animation: {
        'fade-in':        'fadeIn 0.4s ease-out',
        'slide-up':       'slideUp 0.35s ease-out',
        'slide-in-right': 'slideInRight 0.35s ease-out',
        'pulse-correct':  'pulseCorrect 0.6s ease-in-out',
        'pulse-wrong':    'pulseWrong 0.6s ease-in-out',
        'shimmer':        'shimmer 2s infinite',
        'spin-slow':      'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseCorrect: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.4)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(16, 185, 129, 0)' },
        },
        pulseWrong: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.4)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(239, 68, 68, 0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
