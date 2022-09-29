import React from 'react';
import getConfig from 'next/config';
import Head from 'next/head';
import styles from '../../styles/BlogPost.module.scss';

const BlogPost = (props) => {
    const { content, previousPost, nextPost, slug } = props;

    return <>
        <Head>
            <title>Jake Bukuts Blog</title>
        </Head>
        <p className={styles['blog-post__links']}>
            <small>home</small>
            <small>docker</small>
            <small>{slug}.md</small>
        </p>
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
    const { content, title, time_to_read } = allGists[postIndex];

    return {
      props: {
        title,
        slug: params.slug,
        content,
        ...(postIndex - 1 > -1 && { previousPost: allGists[postIndex-1]}),
        ...(postIndex + 1 < allGists.length && { nextPost: allGists[postIndex+1]})
      }
    }
}

export default BlogPost;