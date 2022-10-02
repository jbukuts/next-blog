import matter from 'gray-matter';
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import rehypeSlug from 'rehype-slug';
import remarkBreaks from 'remark-breaks'

const CHARS_PER_MINUTE = 1150;

async function buildHTML(stringContent, remarkPlugins = [], rehypePlugins = []) {
    return String(await unified()
        .use([
            remarkParse,
            ...remarkPlugins,
            remarkRehype,
            rehypeFormat,
            ...rehypePlugins,
            rehypeStringify,
        ])
        .process(stringContent)
    )
}

async function getRepoData(apiKey) {
    console.log('get repo data');
    return await Promise.all(
        (await fetch(' https://api.github.com/repos/jbukuts/blog-cms/contents/test', {
            headers: {
                authorization: `Bearer ${apiKey}`,
                contentType: 'application/vnd.github.v3+json'
            }
        })
        .then(r => r.json()))
        .map(async article => {
            const { download_url, sha, name, size } = article;
            if (!download_url) return undefined;

            const rawText = await fetch(download_url).then(r => r.text());

            const data = matter(rawText, { excerpt: true, excerpt_separator: '<!--- end preview -->' });
            const { data: frontmatter, excerpt, content } = data;
            
            return {
                content: await buildHTML(content, [remarkBreaks], [rehypeSlug]),
                excerpt: await buildHTML(excerpt, [remarkBreaks]),
                slug: name.replace('.md', ''),
                sha,
                time_to_read: Math.ceil(size / CHARS_PER_MINUTE),
                date: new Date('Sept 9, 2022').toUTCString(),
                ...frontmatter
            }
        })
        .filter(gist => gist !== undefined)
    );
}

class MarkdownLayer {
    allGistData = [];
    static apiKey;

    updateContentData = async () => {
        const updatedGistData = await getRepoData(MarkdownLayer.apiKey);
        const postToUpdate = updatedGistData.filter(({slug, sha}) => {
            const gist = this.allGistData.find(gist => gist.slug === slug);
  	        return !gist || gist.sha !== sha;
        });
    
        this.allGistData = updatedGistData;
        return postToUpdate.map(({slug}) => slug);
    }
}

const withMarkdownLayer = async (config, apiKey) => {
    MarkdownLayer.apiKey = apiKey
    const mdLayer = new MarkdownLayer();
    await mdLayer.updateContentData();

    return {
        serverRuntimeConfig: { mdLayer },
        ...config
    }
}

export default withMarkdownLayer;