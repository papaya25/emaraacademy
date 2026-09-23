import { notFound } from "next/navigation";

// Any unknown URL lands here so it renders app/[locale]/not-found.tsx (the
// site's styled, translated 404) instead of Next's bare default page.
export default function CatchAll() {
  notFound();
}
