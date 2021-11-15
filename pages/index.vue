<template>
<div class="w-full md:max-w-lg md:mx-auto">
    <div class="flex flex-col items-center justify-center p-6 space-y-8 text-center bg-white shadow">
        <div class="flex items-center justify-center text-4xl">
            🙋‍♂️
        </div>

        <header class="max-w-xs space-y-4 text-gray-700">
            <h2 class="text-4xl font-bold tracking-tight">Hello, I'm Alex</h2>

            <p class="text-lg font-medium text-gray-600">
                I'm a web developer and enterprise architect at MassMutual, I also do freelance web development and projects on the side.
            </p>
        </header>

        <div class="max-w-sm p-4 text-sm font-medium text-gray-600 bg-gray-200">
            <p>
                If you're looking for my <span class="font-bold">Laravel CI/CD pipeline using Lasso and GitHub Actions</span> you can <a href="https://lasso-ci-cd.alexjustesen.com/" rel="nofollow" target="_blank" class="font-bold text-blue-500 hover:text-blue-400 whitespace-nowrap">click here</a>.
            </p>
        </div>

        <div class="flex items-center justify-center space-x-3">
            <a href="https://github.com/alexjustesen" ref="noopener" target="_blank" class="flex items-center px-3 py-2 text-gray-700 transition duration-300 ease-in-out bg-white border border-gray-600 hover:bg-gray-700 hover:border-gray-800 hover:text-white focus:outline-none focus:shadow-outline-gray">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
                </svg>
            </a>

            <a href="https://twitter.com/alexjustesen" ref="noopener" target="_blank" class="flex items-center px-3 py-2 text-gray-700 transition duration-300 ease-in-out bg-white border border-gray-600 hover:bg-blue-500 hover:border-blue-600 hover:text-white focus:outline-none focus:shadow-outline-blue">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z" />
                </svg>
            </a>

            <a href="https://dev.to/alexjustesen" ref="noopener" target="_blank" class="flex items-center px-3 py-2 font-semibold tracking-tighter text-gray-700 transition duration-300 ease-in-out bg-white border border-gray-600 hover:bg-black hover:border-black hover:text-white focus:outline-none focus:shadow-outline-blue">
                DEV
            </a>
        </div>
    </div>
</div>
</template>

<script>
export default {
    layout: 'page',
}
</script>
