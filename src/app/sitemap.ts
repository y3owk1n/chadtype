import { siteConfig } from "@/lib";
import { type MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: siteConfig.url,
            lastModified: new Date(),
        },
    ];
}
