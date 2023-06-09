/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      padding: {
        '1/2': '0.125rem'
      },
      height: {
        '1/8': '12.5%',
        '7/8': '87.5%',
        '1/12': '8.33%',
        '11/12': '91.67%',
        '1/20': '5%',
        '2/20': '10%',
        '8/20' : '40%',
        '12/20' : '60%',
        '19/20': '95%',
        '18/20' : '90%'
      }
    },
  },
  plugins: [],
}

