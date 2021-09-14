const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/ui/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    colors: {
      ...colors,
      blue: colors.cyan,
    },
    extend: {},
  },
  variants: {
    extend: {},
    display: [
      'children',
      'children-first',
      'children-last',
      'children-odd',
      'children-even',
      'children-not-first',
      'children-not-last',
      'children-hover',
      'hover',
      'children-focus',
      'focus',
      'children-focus-within',
      'focus-within',
      'children-active',
      'active',
      'children-visited',
      'visited',
      'children-disabled',
      'disabled',
      'responsive',
    ],
  },
  plugins: [require('tailwindcss-children'), require('@tailwindcss/forms')],
}
