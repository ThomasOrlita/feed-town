const sveltePreprocess = require("svelte-preprocess");
const makeAttractionsImporter = require('attractions/importer.js');
const path = require('path');

module.exports = {
	preprocess: [
		sveltePreprocess({
			defaults: {
				style: "postcss",
			},
			postcss: true,
			scss: {
				importer: makeAttractionsImporter({
					themeFile: path.resolve('./src/theme.scss'),
				}),
			},
		}),
	],
};