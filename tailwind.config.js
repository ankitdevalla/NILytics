/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lando: {
          blue: "#4169E1",
          darkblue: "#3251B8",
          lightblue: "#6381F9",
          yellow: "#FFCB45",
          gray: {
            50: "#F8FAFC",
            100: "#F1F5F9", 
            900: "#0F172A",
          }
        },
        ncaa: {
          blue: "#005EB8",         // NCAA Primary Blue
          lightblue: "#0092D0",    // NCAA Light Blue
          darkblue: "#00447C",     // NCAA Dark Blue
          gold: "#D9B26A",         // NCAA Gold
          gray: {
            50: "#F5F7FA",
            100: "#E4E8ED",
            900: "#22293B", 
          }
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'bounce-slow': 'bounce-slow 3s infinite ease-in-out',
        'float': 'float 5s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.8s ease forwards',
      },
      keyframes: {
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'float': {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        'fadeIn': {
          'from': { opacity: 0, transform: 'translateY(20px)' },
          'to': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      zIndex: {
        '-10': '-10',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
} 