/**
 * @module config.ts
 * The configuration file for the project. Only can be used with Next.js
 * 
 * Developed bt @NeuroNexul / Arif Sardar
 * @license MIT
 */

import Icon from "./app/favicon.ico"
// Importing All Icons
import Icon48 from "@/assets/logo/maskable/maskable_icon_x48.png";
import Icon72 from "@/assets/logo/maskable/maskable_icon_x72.png";
import Icon96 from "@/assets/logo/maskable/maskable_icon_x96.png";
import Icon128 from "@/assets/logo/maskable/maskable_icon_x128.png";
import Icon192 from "@/assets/logo/maskable/maskable_icon_x192.png";
import Icon384 from "@/assets/logo/maskable/maskable_icon_x384.png";
import Icon512 from "@/assets/logo/maskable/maskable_icon_x512.png";

export default {
    // SEO DATA
    name: "Grow It Rapid",
    title: "Grow It Rapid",
    description: "Welcome to GrowItRapid.com, your premier destination for cutting-edge 360-degree marketing solutions. Our website is dedicated to helping businesses thrive in the ever-changing digital landscape through our innovative approach and unparalleled expertise.",
    author: "Bishal Nandi",
    locale: "en_US",
    type: "website",
    emails: [
        "bishal.nandi@growitrapid.com",
        "growitrapid@gmail.com"
    ],

    theme_key: "theme",

    db: {
        auth_name: "auth",
        root_name: "root",
        blog_name: "blog",
        course_name: "courses",
        static_db_name: "static_db",
        default_document_collection_name: "default_document_collection",
    },

    icons: [
        {
            rel: "icon",
            type: "image/x-icon",
            sizes: "16x16",
            href: `/${(Icon.src.replace(/\//, ""))}`,
        },
        {
            rel: "icon",
            type: "image/png",
            sizes: "48x48",
            href: `/${(Icon48.src.replace(/\//, ""))}`,
        },
        {
            rel: "icon",
            type: "image/png",
            sizes: "72x72",
            href: `/${(Icon72.src.replace(/\//, ""))}`,
        },
        {
            rel: "icon",
            type: "image/png",
            sizes: "96x96",
            href: `/${(Icon96.src.replace(/\//, ""))}`,
        },
        {
            rel: "icon",
            type: "image/png",
            sizes: "128x128",
            href: `/${(Icon128.src.replace(/\//, ""))}`,
        },
        {
            rel: "icon",
            type: "image/png",
            sizes: "192x192",
            href: `/${(Icon192.src.replace(/\//, ""))}`,
        },
        {
            rel: "icon",
            type: "image/png",
            sizes: "384x384",
            href: `/${(Icon384.src.replace(/\//, ""))}`,
        },
        {
            rel: "icon",
            type: "image/png",
            sizes: "512x512",
            href: `/${(Icon512.src.replace(/\//, ""))}`,
        },
    ],
}

