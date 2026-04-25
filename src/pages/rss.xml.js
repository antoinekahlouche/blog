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
        },
        customData: `<atom:link href="${rssUrl}" rel="self" type="application/rss+xml" /><lastBuildDate>${new Date().toUTCString()}</lastBuildDate><language>en-us</language><image><url>${feedImageUrl}</url><title>Antoine Kahlouche</title><link>${siteUrl}</link></image>`,
        items: orderedPosts.map((post) => {
            const imageUrl = new URL(post.data.image.src, siteUrl).toString();

            return {
                title: post.data.title,
                description: post.data.description,
                pubDate: post.data.date,
                content: `<img src="${imageUrl}" alt="${post.data.title} thumbnail" /><p>${post.data.description}</p>`,
                customData: `<media:thumbnail url="${imageUrl}" />`,
                link: `/blog/${titleToSlug(post.data.title)}/`,
            };
        }),
    });
}
