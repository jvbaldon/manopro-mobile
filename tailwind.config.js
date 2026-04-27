/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Brand — Verde Profissional
        primary: '#2A9D76',
        'primary-light': '#C2E3D8',
        'primary-dark': '#1B7055',
        'primary-bg': '#E8F4F0',

        // Accent — Laranja Energia
        accent: '#F5820D',
        'accent-light': '#FFD9B0',
        'accent-dark': '#C45E00',
        'accent-bg': '#FFF3E8',

        // Superfícies (light mode default)
        background: '#F7F6F3',
        surface: '#FFFFFF',
        border: '#E5E3DC',
        foreground: '#2C2B27',
        muted: '#8C8A82',

        // Semânticos
        success: '#16A34A',
        warning: '#D97706',
        error: '#DC2626',
      },
      borderRadius: {
        DEFAULT: '10px',
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
