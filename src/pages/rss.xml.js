import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { titleToSlug } from "./blog/[...slug].astro";

export async function GET(context) {
    const posts = await getCollection("blog");
    const siteUrl = context.site;
    const feedImageUrl = new URL("/favicon-96x96.png", siteUrl).toString();
    const rssUrl = new URL("/rss.xml", siteUrl).toString();
    const orderedPosts = [...posts].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

    return rss({
        title: "Antoine Kahlouche",
        description: "Antoine Kahlouche personal website",
        site: siteUrl,
        xmlns: {
            atom: "http://www.w3.org/2005/Atom",
            media: "http://search.yahoo.com/mrss/",
            dc: "http://purl.org/dc/elements/1.1/",
        },
        customData: `<atom:link href="${rssUrl}" rel="self" type="application/rss+xml" /><lastBuildDate>${new Date().toUTCString()}</lastBuildDate><language>en-us</language><generator>Astro</generator><image><url>${feedImageUrl}</url><title>Antoine Kahlouche</title><link>${siteUrl}</link></image>`,
        items: orderedPosts.map((post) => {
            const imageUrl = new URL(post.data.image.src, siteUrl).toString();
            const imageType = `image/${post.data.image.format === "jpg" ? "jpeg" : post.data.image.format}`;
            const content = post.rendered?.html ?? `<p>${post.data.description}</p>`;

            return {
                title: post.data.title,
                link: `/blog/${titleToSlug(post.data.title)}/`,
                pubDate: post.data.date,
                description: post.data.description,
                content,
                customData: `<dc:creator>Antoine Kahlouche</dc:creator><media:content url="${imageUrl}" medium="image" type="${imageType}" width="${post.data.image.width}" height="${post.data.image.height}" />`,
            };
        }),
    });
}
