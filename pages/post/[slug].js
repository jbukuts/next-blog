import React from 'react';
import getConfig from 'next/config';
import Head from 'next/head';
import styles from '../../styles/pages/BlogPost.module.scss';
import matter from 'gray-matter';
import rehypeSlug from 'rehype-slug';
import remarkBreaks from 'remark-breaks';
import { buildHTML } from '../../src/MarkdownLayer.mjs';

const BlogPost = (props) => {
    const { content, previousPost, nextPost } = props;

    return <>
        <Head>
            <title>Jake Bukuts Blog</title>
        </Head>
        {/*<p className={styles['blog-post__links']}>
            <small>home</small>
            <small>docker</small>
            <small>{slug}.md</small>
        </p>*/}
        <article className={styles['blog-post__article']} dangerouslySetInnerHTML={{__html: content}}/>
    </>
}

export async function getStaticPaths() {
    const { serverRuntimeConfig } = getConfig();
    const { mdLayer } = serverRuntimeConfig;

    return {
        paths: mdLayer.allGistData.map(({slug}) => ({params: { slug }})),
        fallback: 'blocking',
    }
}

export async function getStaticProps(context) {
    const { serverRuntimeConfig } = getConfig();
    const { mdLayer } = serverRuntimeConfig;
    const allGists = mdLayer.allGistData;

    const { params } = context;
    const postIndex = allGists.findIndex(gist=> gist.slug === params.slug);

    const { download_url } = allGists[postIndex];

    const rawText = await fetch(download_url).then(r => r.text());

    const data = matter(rawText);
    const { data: frontmatter, content } = data;

    return {
        props: {
            slug: params.slug,
            content: await buildHTML(content, [remarkBreaks], [rehypeSlug]),
            ...(postIndex - 1 > -1 && { previousPost: allGists[postIndex-1]}),
            ...(postIndex + 1 < allGists.length && { nextPost: allGists[postIndex+1]})
        }
    }
}

export default BlogPost;