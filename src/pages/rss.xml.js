import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { titleToSlug } from "./blog/[...slug].astro";

function getMimeType(pathname) {
    if (pathname.endsWith(".png")) return "image/png";
    if (pathname.endsWith(".webp")) return "image/webp";
    if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) return "image/jpeg";
    if (pathname.endsWith(".gif")) return "image/gif";
    if (pathname.endsWith(".svg")) return "image/svg+xml";
    if (pathname.endsWith(".ico")) return "image/x-icon";
    return "application/octet-stream";
}

export async function GET(context) {
    const posts = await getCollection("blog");
    const siteUrl = context.site;
    const feedImageUrl = new URL("/favicon-96x96.png", siteUrl).toString();

    return rss({
        title: "Antoine Kahlouche",
        description: "Antoine Kahlouche personal website",
        site: siteUrl,
        xmlns: {
            media: "http://search.yahoo.com/mrss/",
        },
        customData: `<language>en-us</language><image><url>${feedImageUrl}</url><title>Antoine Kahlouche</title><link>${siteUrl}</link></image>`,
        items: posts.map((post) => {
            const imageUrl = new URL(post.data.image.src, siteUrl).toString();

            return {
                title: post.data.title,
                description: post.data.description,
                pubDate: post.data.date,
                content: `<img src="${imageUrl}" alt="" /><p>${post.data.description}</p>`,
                enclosure: {
                    url: imageUrl,
                    type: getMimeType(new URL(imageUrl).pathname),
                    length: 0,
                },
                customData: `<media:thumbnail url="${imageUrl}" />`,
                link: `/blog/${titleToSlug(post.data.title)}/`,
            };
        }),
    });
}
