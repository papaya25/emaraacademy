"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { arabicIndicNumeral, chapterHeading } from "@/lib/arabicNumerals";
import { isResendConfigured, sendBroadcast } from "@/lib/resend";

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}
function strOrNull(fd: FormData, key: string): string | null {
  const v = str(fd, key);
  return v ? v : null;
}
function parseActivities(fd: FormData, key = "activities") {
  return str(fd, key)
    .split("\n")
    .map((line) => line.split("|"))
    .filter(([title]) => title?.trim())
    .map(([title, desc]) => ({ title: title.trim(), desc: (desc ?? "").trim() }));
}
/** Spanish (_es) and Arabic (_ar) copies of the given text fields — blank
 *  becomes null, which the public site shows as the English text. */
function translated(fd: FormData, fields: string[]) {
  const row: Record<string, string | null> = {};
  for (const suffix of ["_es", "_ar"]) {
    for (const f of fields) row[f + suffix] = strOrNull(fd, f + suffix);
  }
  return row;
}
function translatedProgram(fd: FormData) {
  const activities = (suffix: string) => {
    const list = parseActivities(fd, `activities${suffix}`);
    return list.length ? list : null;
  };
  return {
    ...translated(fd, ["category", "title", "tagline", "what_it_is", "problem"]),
    activities_es: activities("_es"),
    activities_ar: activities("_ar"),
  };
}

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "program"
  );
}

// ---- Programs -------------------------------------------------------------

export async function updateProgram(fd: FormData) {
  const supabase = await createClient();
  const slug = str(fd, "slug");

  await supabase
    .from("programs")
    .update({
      category: str(fd, "category"),
      title: str(fd, "title"),
      tagline: str(fd, "tagline"),
      what_it_is: str(fd, "what_it_is"),
      problem: str(fd, "problem"),
      activities: parseActivities(fd),
      ...translatedProgram(fd),
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug);

  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  revalidatePath(`/programs/${slug}`);
  revalidatePath("/");
}

export async function createProgram(fd: FormData) {
  const supabase = await createClient();
  const { data: existing } = await supabase.from("programs").select("slug");
  const existingSlugs = new Set((existing ?? []).map((p) => p.slug));

  let slug = slugify(str(fd, "title"));
  let suffix = 2;
  while (existingSlugs.has(slug)) {
    slug = `${slugify(str(fd, "title"))}-${suffix++}`;
  }

  const position = existingSlugs.size + 1;

  await supabase.from("programs").insert({
    slug,
    sort_order: existingSlugs.size,
    num: arabicIndicNumeral(position),
    chapter: chapterHeading(position),
    category: str(fd, "category"),
    title: str(fd, "title"),
    tagline: str(fd, "tagline"),
    what_it_is: str(fd, "what_it_is"),
    problem: str(fd, "problem"),
    activities: parseActivities(fd),
    ...translatedProgram(fd),
  });

  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  revalidatePath("/");
}

export async function deleteProgram(fd: FormData) {
  const supabase = await createClient();
  const slug = str(fd, "slug");
  await supabase.from("programs").delete().eq("slug", slug);

  // Renumber what's left so chapter numbers/Arabic numerals stay sequential
  // with no gap where the deleted program used to be.
  const { data: remaining } = await supabase
    .from("programs")
    .select("slug")
    .order("sort_order", { ascending: true });
  for (const [i, p] of (remaining ?? []).entries()) {
    await supabase
      .from("programs")
      .update({ sort_order: i, num: arabicIndicNumeral(i + 1), chapter: chapterHeading(i + 1) })
      .eq("slug", p.slug);
  }

  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  revalidatePath("/");
}

// ---- Events -----------------------------------------------------------

export async function upsertEvent(fd: FormData) {
  const supabase = await createClient();
  const id = strOrNull(fd, "id");
  const row = {
    title: str(fd, "title"),
    type: str(fd, "type") || "monthly",
    city: strOrNull(fd, "city"),
    event_date: str(fd, "event_date"),
    time: strOrNull(fd, "time"),
    location: strOrNull(fd, "location"),
    presenter: strOrNull(fd, "presenter"),
    meta: strOrNull(fd, "meta"),
    ...translated(fd, ["title", "meta"]),
  };
  if (id) {
    await supabase.from("events").update(row).eq("id", id);
  } else {
    await supabase.from("events").insert(row);
  }
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

export async function deleteEvent(fd: FormData) {
  const supabase = await createClient();
  await supabase.from("events").delete().eq("id", str(fd, "id"));
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

// ---- Classes ----------------------------------------------------------

export async function upsertClass(fd: FormData) {
  const supabase = await createClient();
  const id = strOrNull(fd, "id");
  const row = {
    subject: str(fd, "subject"),
    blurb: strOrNull(fd, "blurb"),
    track: str(fd, "track") || "Foundations",
    language: str(fd, "language") || "Español",
    city: str(fd, "city"),
    location: strOrNull(fd, "location"),
    day: strOrNull(fd, "day"),
    time: strOrNull(fd, "time"),
    format: str(fd, "format") || "In person",
    status: str(fd, "status") || "Open",
    sort_order: Number(fd.get("sort_order") ?? 0) || 0,
    ...translated(fd, ["subject", "blurb"]),
  };
  if (id) {
    await supabase.from("classes").update(row).eq("id", id);
  } else {
    await supabase.from("classes").insert(row);
  }
  revalidatePath("/admin/classes");
  revalidatePath("/classes");
}

export async function deleteClass(fd: FormData) {
  const supabase = await createClient();
  await supabase.from("classes").delete().eq("id", str(fd, "id"));
  revalidatePath("/admin/classes");
  revalidatePath("/classes");
}

// ---- Donations ----------------------------------------------------------

export async function addDonation(fd: FormData) {
  const supabase = await createClient();
  await supabase.from("donations").insert({
    occurred_on: str(fd, "occurred_on") || new Date().toISOString().slice(0, 10),
    amount: Number(fd.get("amount")),
    donor_name: strOrNull(fd, "donor_name"),
    method: str(fd, "method") || "other",
    frequency: str(fd, "frequency") || "once",
    note: strOrNull(fd, "note"),
  });
  revalidatePath("/admin/donations");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteDonation(fd: FormData) {
  const supabase = await createClient();
  await supabase.from("donations").delete().eq("id", str(fd, "id"));
  revalidatePath("/admin/donations");
  revalidatePath("/admin");
  revalidatePath("/");
}

// ---- Messages -----------------------------------------------------------

export async function deleteMessage(fd: FormData) {
  const supabase = await createClient();
  await supabase.from("contact_messages").delete().eq("id", str(fd, "id"));
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

// ---- Newsletter -----------------------------------------------------------

export type SendNewsletterState = { ok: boolean; message: string } | null;

export async function sendNewsletter(
  _prev: SendNewsletterState,
  fd: FormData
): Promise<SendNewsletterState> {
  const t = await getTranslations("admin.newsletter");
  if (!isResendConfigured()) {
    return { ok: false, message: t("errNotConnected") };
  }

  const subject = str(fd, "subject");
  const body = str(fd, "body");
  if (!subject || !body) {
    return { ok: false, message: t("errEmpty") };
  }

  const supabase = await createClient();
  const { data: subscribers } = await supabase.from("newsletter_subscribers").select("email");
  const emails = (subscribers ?? []).map((s) => s.email).filter(Boolean);
  if (emails.length === 0) {
    return { ok: false, message: t("errNoSubscribers") };
  }

  try {
    await sendBroadcast(subject, body, emails);
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : t("errFailed") };
  }

  await supabase
    .from("email_campaigns")
    .insert({ subject, body, recipient_count: emails.length });

  revalidatePath("/admin/newsletter");
  return { ok: true, message: t("sent", { count: emails.length }) };
}

// ---- Settings -----------------------------------------------------------

export async function updateContactInfo(fd: FormData) {
  const supabase = await createClient();
  await supabase.from("site_settings").upsert({
    key: "contact_info",
    value: { email: str(fd, "email"), phone: str(fd, "phone") },
    updated_at: new Date().toISOString(),
  });
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
}

export async function updateImpactStats(fd: FormData) {
  const supabase = await createClient();
  await supabase.from("site_settings").upsert({
    key: "impact_stats",
    value: {
      new_muslims: Number(fd.get("new_muslims")) || 0,
      students: Number(fd.get("students")) || 0,
      supported: Number(fd.get("supported")) || 0,
    },
    updated_at: new Date().toISOString(),
  });
  revalidatePath("/admin/settings");
  revalidatePath("/");
}

export async function updateDonationGoal(fd: FormData) {
  const supabase = await createClient();
  await supabase.from("site_settings").upsert({
    key: "donation_month",
    value: { goal: Number(fd.get("goal")) || 0 },
    updated_at: new Date().toISOString(),
  });
  revalidatePath("/admin/settings");
  revalidatePath("/");
}
