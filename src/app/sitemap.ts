import type { MetadataRoute } from "next";
import { servicePages, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    ...Object.values(servicePages).map((p) => ({
      url: `${site.url}/servicios/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
