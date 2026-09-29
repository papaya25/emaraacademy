import { redirect } from "@/i18n/routing";

// Enrollment moved into the contact page (owner, 2026-09-28). Old /enroll
// links — including ?class=… from a class card — land on its form.
export default async function EnrollPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ class?: string }>;
}) {
  const [{ locale }, { class: classId }] = await Promise.all([params, searchParams]);
  redirect({ href: { pathname: "/contact", query: classId ? { class: classId } : {} }, locale });
}
