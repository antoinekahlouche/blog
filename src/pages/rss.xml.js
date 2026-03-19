import { getCollection } from "astro:content";
import rss from "@astrojs/rss";

export async function GET(context) {
    const posts = await getCollection("blog");
    return rss({
        title: "Antoine Kahlouche",
        description: "Antoine Kahlouche personal website",
        site: context.site,
        items: posts.map((post) => ({
            ...post.data,
            link: `/blog/${post.id}/`,
        })),
    });
}
