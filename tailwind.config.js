/*
// Use preset files to add custom configuration in order to maintain this file as slim as possible
*/
const defaultTheme = require('./tailwind-presets/theme');
module.exports = {
  mode: 'jit',
  theme: {
    colors: defaultTheme.colors,
    extend: {
      colors: defaultTheme.colors,
      fontFamily: defaultTheme.fonts,
      fontSize: defaultTheme.size,
    },
  },
  plugins: [require('@savvywombat/tailwindcss-grid-areas')],
  variants: {
    gridTemplateAreas: ['responsive'],
  },
};
