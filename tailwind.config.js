const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    enabled: process.env.NODE_ENV === 'production',
    content: [
      "./src/App.vue",
      "./src/index.css",
      "./src/components/compress.vue",
      "./src/components/packup.vue",
      "./src/components/search.vue",
    ]
  },
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
          light: '#8800c1',
          dark: '#3e0058'
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
    extend: {}
  },
  plugins: [
    require("tailwindcss-scrollbar"),
  ],
}
