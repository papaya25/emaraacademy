/**
 * Pass-through root layout (next-intl's recommended setup). The real root
 * layouts are app/[locale]/layout.tsx (public site — owns <html>, language
 * from the URL, so pages can be static) and app/admin/layout.tsx.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
