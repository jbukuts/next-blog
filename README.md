# blog @ me

Personal blog written in Next.js

## Design

The blog is written using Next.js 13 and React 18. For styling, Sass and CSS modules were using to keep the theming sizes to a minumim on client load.

All blog pages are created as static pages at build time. Each blog post is pulled from a Github repo as a Markdown file using the Github contents REST API.

The raw Markdown is then converted and transformed into JSX through the use of `remark`, `rehype`, and `next-mdx-remote`. In order to add extra functionailty various custom plugins for `remark` and `rehype` were written (take a look at `src/helpers/*`).

## Getting started locally

A couple of environment variables are needed in a `.env.local` file:

- `GIT_API_KEY`: Personal access token generated via Github
- `GIT_USER_NAME`: Github usename of owner of CMS repository
- `GIT_REPO`: Repo name of CMS repository
- `GIT_FOLDER`: Folder within repository for Markdown files to be sourced
- `SKIP_BUILD_STATIC_GENERATION` (optional): Will cause static blog pages to be built on-demand and cached during runtime rather than at build

Then install dependences via:

```bash
npm ci
```

After that you can run this start the dev server locally:

```bash
npm run dev
```

Server is now running locally at [http://localhost:3000](http://localhost:3000).

## Creating a local build

Simply run this to create a local production build:

```bash
npm run build
```

Then to start run:

```bash
npm start
```

Local prod build is then ready at [http://localhost:3000](http://localhost:3000).

## Deployment

Deployment of the site is automated via Vercel
