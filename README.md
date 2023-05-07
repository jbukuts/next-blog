# blog @ me

Personal blog that's written in Next.js

## Design

The blog is written using Next.js 13 and React 18. For styling, Sass and CSS modules were used to keep the theming sizes to a minimum on the client load.

As a note, this site's main pages are built using the newly stable [App router](https://nextjs.org/docs) within Next.js. If you're not familiar with React Server Components here's some good reading:

- [Next.js rendering fundamentals](https://nextjs.org/docs/app/building-your-application/rendering)
- [React blog on RSC](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023)
- [RFC](https://github.com/reactjs/rfcs/pull/188)

All blog pages are created as static pages at build time. Each blog post is pulled from a GitHub repo as a Markdown file using the GitHub contents REST API.

The raw Markdown is then converted and transformed into static HTML through the use of `remark`, `rehype`, and `next-mdx-remote`. To add extra functionality a couple of custom plugins for `remark` and `rehype` were written (take a look at `src/plugins/*`).

## Getting started locally

A couple of environment variables are needed in a `.env.local` file:

- `GIT_API_KEY`: Personal access token generated via GitHub
- `GIT_USER_NAME`: Github username of the owner of CMS repository
- `GIT_REPO`: Repo name of CMS repository
- `GIT_FOLDER`: Folder within the repository for Markdown files to be sourced
- `SKIP_BUILD_STATIC_GENERATION` (optional): Will cause static blog pages to be built on-demand and cached during runtime rather than at build

Then install dependencies via:

```bash
npm ci
```

After that, you can run this start the dev server locally:

```bash
npm run dev
```

THe server is now running locally at [http://localhost:3000](http://localhost:3000).

## Creating a local build

Simply run this to create a local production build:

```bash
npm run build
```

Then to start run:

```bash
npm start
```

The local prod build is then ready at [http://localhost:3000](http://localhost:3000).

## Deployment

Deployment of the site is automated via Vercel

If you'd like to deploy within a container instead I'd recommend reading the docs on the `output` configuration [here](https://nextjs.org/docs/app/api-reference/next-config-js/output)
