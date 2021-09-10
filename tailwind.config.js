const production = !process.env.ROLLUP_WATCH;
module.exports = {
  purge: {
    content: ['./**/*.svelte'],
    enabled: production,
  },
  darkMode: false,
  theme: {
    extend: {},
    screens: {
      'compact': { 'raw': '(max-height: 720px)' }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
};