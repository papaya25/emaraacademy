import type { MetadataRoute } from "next";
import { PROGRAMS } from "@/lib/programs";
import { POLICY_LINKS_ENABLED } from "@/lib/policies";

import { SITE_URL } from "@/lib/siteUrl";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/new-muslims",
    "/programs",
    "/events",
    "/classes",
    "/donations",
    "/faq",
    "/contact",
    ...(POLICY_LINKS_ENABLED
      ? ["/privacy-policy", "/donation-policy", "/donation-acceptance-policy"]
      : []),
  ];
  const paths = [...staticRoutes, ...PROGRAMS.map((p) => `/programs/${p.slug}`)];

  // Each page in English (unprefixed) and Arabic (/ar), linked as alternates.
  return paths.flatMap((path) => {
    const languages = { en: `${SITE_URL}${path}`, ar: `${SITE_URL}/ar${path}` };
    return (["en", "ar"] as const).map((lang) => ({
      url: languages[lang],
      lastModified: new Date(),
      alternates: { languages },
    }));
  });
}
