/**
 * The site's public address — used for the sitemap, robots.txt and share
 * previews. On Vercel this is the project's production domain (so it becomes
 * emaraacademy.org by itself once that domain is attached); elsewhere it
 * falls back to the intended domain.
 */
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://emaraacademy.org";
