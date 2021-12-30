const { fontFamily } = require('tailwindcss/defaultTheme')

module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        // "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Work Sans', ...fontFamily.sans],
            },
        },
    },

    plugins: [],
}
