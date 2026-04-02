/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      minHeight: {
        '44': '44px',
        '56': '56px',
      },
      minWidth: {
        '44': '44px',
      },
    },
  },
  plugins: [],
};
