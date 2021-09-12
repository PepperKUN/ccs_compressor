const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        turquoise: {
          light: '#25968f',
          dark: '#2a3d48',
        },
        orange: {
          light: '#EA580C',
          dark: '#583428'
        },
        rose: {
          light: '#E11D48',
          dark: '#881337'
        }
      }
    },
    minHeight: {
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-scrollbar"),
  ],
}
