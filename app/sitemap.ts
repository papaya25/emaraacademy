import type { MetadataRoute } from "next";
import { PROGRAMS } from "@/lib/programs";

const BASE_URL = "https://emaraacademy.vercel.app";

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
    "/privacy-policy",
    "/donation-policy",
    "/donation-acceptance-policy",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const programRoutes = PROGRAMS.map((p) => ({
    url: `${BASE_URL}/programs/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...programRoutes];
}
