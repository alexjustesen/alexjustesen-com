const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
    mode: 'jit',

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
                sans: ['Inter', ...fontFamily.sans],
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
