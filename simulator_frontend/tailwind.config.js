/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0f1116',
          sidebar: '#16182a',
          card: '#1a1d2e',
          border: '#2d3250',
          text: '#ffffff',
        },
        accent: {
          blue: '#5eb3f6',
          red: '#ff6b6b',
        },
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '0.6',
          },
          '50%': {
            transform: 'scale(1.1)',
            opacity: '0.8',
          },
        },
      },
    },
  },
  plugins: [],
}
