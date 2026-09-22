"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { arabicIndicNumeral, chapterHeading } from "@/lib/arabicNumerals";

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}
function strOrNull(fd: FormData, key: string): string | null {
  const v = str(fd, key);
  return v ? v : null;
}
function parseActivities(fd: FormData) {
  return str(fd, "activities")
    .split("\n")
    .map((line) => line.split("|"))
    .filter(([title]) => title?.trim())
    .map(([title, desc]) => ({ title: title.trim(), desc: (desc ?? "").trim() }));
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
