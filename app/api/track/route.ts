import { createHash } from "node:crypto";
import { getLedgerWriter } from "@/lib/stripe";
import { mexicoDay } from "@/lib/mexicoDay";

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|headless|lighthouse|pingdom|monitor/i;

/**
 * The site's own visit counter (components/VisitTracker.tsx calls it on every
 * page view). No cookies and no IP kept: a visitor is a one-way hash of
 * IP + browser + day + a server secret, so one person counts once a day and
 * can't be identified or followed. Always answers 204 — tracking must never
 * break a page.
 */
export async function POST(request: Request) {
  const ua = request.headers.get("user-agent") ?? "";
  const db = getLedgerWriter();
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!db || !secret || !ua || BOT.test(ua)) return new Response(null, { status: 204 });

  let body: { path?: unknown; locale?: unknown; referrer?: unknown } = {};
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 204 });
  }
  const path = typeof body.path === "string" ? body.path.slice(0, 300) : "";
  if (!path.startsWith("/") || path.startsWith("/admin")) return new Response(null, { status: 204 });

  const day = mexicoDay();
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
  const visitor = createHash("sha256").update(`${ip}|${ua}|${day}|${secret}`).digest("hex");
  const country = request.headers.get("x-vercel-ip-country");

  await db.from("page_views").insert({
    day,
    path,
    locale: typeof body.locale === "string" ? body.locale.slice(0, 5) : null,
    country: country && /^[A-Z]{2}$/.test(country) ? country : null,
    referrer: typeof body.referrer === "string" && body.referrer ? body.referrer.slice(0, 200) : null,
    visitor,
  });
  return new Response(null, { status: 204 });
}
