const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
    purge: [
        './components/**/*.{vue,js}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        // './plugins/**/*.{js,ts}',
        './nuxt.config.{js,ts}',

      ],

    darkMode: false, // or 'media' or 'class'

    theme: {
        extend: {
            fontFamily: {
                sans: ['Work Sans', ...fontFamily.sans],
            },
        },
    },

    variants: {
        extend: {},
    },

    plugins: [
        require('@tailwindcss/aspect-ratio'),
        require('@tailwindcss/forms'),
    ],
}
