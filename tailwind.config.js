module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    minHeight: {
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
    }
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-scrollbar"),
  ],
}
