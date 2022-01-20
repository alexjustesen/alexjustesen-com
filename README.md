# 🙋‍♂️ Alex Justesen
Hello, I'm Alex. I'm a web developer and data engineer at MassMutual by day and a keeper of too many projects by night.

This repo is the open sourced code for [alexjustesen.com](https://alexjustesen.com). Feel free to clone it, fork it and make it yours.

## Development
1. Clone or fork the repo
2. Run `npm install` then `npm run dev` to start the development server

## Deployment
1. Sign up for [Cloudflare Pages](https://pages.cloudflare.com/)
2. Create a new site and link it to the repo
3. The `main` branch is for production, all other branches will be deployed to preview environments
4. Set the framework to `Astro` under build configurations
5. Add environment variables for production and preview to set the node version
    - `NODE_VERSION` => `v16.13.2`
    - Version used needs to be `> v14.15.0` or `v16.0.0` per the [Astro docs](https://docs.astro.build/en/installation/)
    - If you don't know your local node version run `node -v`

## Open Source
- [Astro](https://astro.build/)
- [Tailwindcss](https://tailwindcss.com/)
