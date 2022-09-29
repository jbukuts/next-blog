import getConfig from "next/config";

export default async function handler(req, res) {
    const { serverRuntimeConfig } = getConfig();
    const { secret = undefined } = req.query;
    
    if (secret !== process.env.REVALIDATE_TOKEN)
        return res.status(401).json({ message: 'Invalid token' });

    try {
        const { mdLayer } = serverRuntimeConfig;
        const routesToRevalidate = await mdLayer.updateContentData();
        console.log(routesToRevalidate);

        await Promise.all(routesToRevalidate.map(slug => res.revalidate(`/post/${slug}`)));
        await res.revalidate('/');
        await res.json({ revalidate: true })
    }
    catch (err) {
        return res.status(500).send(`Error revalidating: ${err}`);
    }
}