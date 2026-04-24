// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";

export default defineConfig({
    site: "https://antoine.kahlouche.com",
    build: {
        inlineStylesheets: "always",
    },
    integrations: [mdx(), sitemap()],
    markdown: {
        rehypePlugins: [
            [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }],
        ],
    },
    vite: {
        plugins: [tailwindcss()],
    },
});
