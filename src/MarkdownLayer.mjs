import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'

const CHARS_PER_MINUTE = 1150;

export async function buildHTML(stringContent, remarkPlugins = [], rehypePlugins = []) {
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

            // on store the URL in the data
            // can be parsed as HTML during props phase
            return {
                slug: name.replace('.md', ''),
                download_url,
                sha,
                time_to_read: Math.ceil(size / CHARS_PER_MINUTE),
                date: new Date('Sept 9, 2022').toUTCString()
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