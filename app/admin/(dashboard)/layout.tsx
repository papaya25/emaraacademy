import Link from "next/link";
import { getTranslations } from "next-intl/server";
import SignOutButton from "@/components/admin/SignOutButton";
import AdminLangSwitcher from "@/components/admin/AdminLangSwitcher";

const NAV = [
  { href: "/admin", key: "overview" },
  { href: "/admin/programs", key: "programs" },
  { href: "/admin/events", key: "events" },
  { href: "/admin/classes", key: "classes" },
  { href: "/admin/donations", key: "donations" },
  { href: "/admin/messages", key: "messages" },
  { href: "/admin/newsletter", key: "newsletter" },
  { href: "/admin/settings", key: "settings" },
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("admin.nav");
  return (
    <div className="admin-shell">
      <aside className="admin-nav">
        <div className="admin-nav-title">
          <Link href="/admin">{t("title")}</Link>
        </div>
        <nav>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {t(item.key)}
            </Link>
          ))}
        </nav>
        <AdminLangSwitcher />
        <SignOutButton />
      </aside>
      <main className="admin-content">{children}</main>
    </div>
  );
}
