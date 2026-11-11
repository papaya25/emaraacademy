"use client";

import NextError from "next/error";

/** Last-resort 404 for addresses outside the site's language folders (the
 *  styled, translated 404 is app/[locale]/not-found.tsx). */
export default function GlobalNotFound() {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <NextError statusCode={404} />
      </body>
    </html>
  );
}
