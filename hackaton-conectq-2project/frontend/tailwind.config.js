/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#009056',
          dark: '#05794A',
          light: '#E5F4EE',
        },
        secondary: {
          DEFAULT: '#FFE16F',
        },
        bolivar: {
          text: '#282828',
          muted: '#5B5B5B',
          border: '#E1E1E1',
          bg: '#FAFAFA',
        },
      },
    },
  },
  plugins: [],
};
