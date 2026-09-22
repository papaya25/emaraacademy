import Link from "next/link";
import SignOutButton from "@/components/admin/SignOutButton";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/programs", label: "Programs" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/classes", label: "Classes" },
  { href: "/admin/donations", label: "Donations" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-nav">
        <div className="admin-nav-title">
          <Link href="/admin">Emara Admin</Link>
        </div>
        <nav>
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <SignOutButton />
      </aside>
      <main className="admin-content">{children}</main>
    </div>
  );
}
