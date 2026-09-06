/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#F5F5F7',
          surface1: '#FFFFFF',
          surface2: '#FBFBFD',
          border: '#D2D2D7',
          accent1: '#6E5AE6',
          accent2: '#8B75F5',
          accent3: '#0071E3',
          text: '#1D1D1F',
          muted: '#6E6E73',
          success: '#34C759',
          warning: '#FF9F0A',
          danger: '#FF3B30',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'Avenir Next', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0, 0, 0, 0.05)',
        lift: '0 16px 40px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in': 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.65' },
        },
      },
    },
  },
  plugins: [],
}
