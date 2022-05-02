const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
	content: [
		'./src/**/*.{astro,html,js,jsx,svelte,ts,tsx,vue}'
	],

	theme: {
        extend: {
            fontFamily: {
                sans: ['Work Sans', ...fontFamily.sans],
            },
        },
    },

    plugins: [],
};
