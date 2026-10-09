import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { mexicoDay } from "@/lib/mexicoDay";

type Daily = { day: string; views: number; visitors: number };
type Count = { visitors: number; views?: number };
type Money = { total: string | number; donations: number; donors: number };

const usd = (n: number, locale: string) =>
  `$${n.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

/** A row with a proportional bar behind the number (no chart library). */
function Bar({ value, max }: { value: number; max: number }) {
  return (
    <span className="stat-bar">
      <span style={{ inlineSize: `${max ? Math.max(2, (value / max) * 100) : 0}%` }} />
      <b>{value.toLocaleString()}</b>
    </span>
  );
}

export default async function AdminStatsPage() {
  const t = await getTranslations("admin.stats");
  const locale = await getLocale();
  const supabase = await createClient();
  const [daily, countries, pages, referrers, monthly, yearly, recent] = await Promise.all([
    supabase.from("admin_visits_daily").select("*").order("day", { ascending: true }),
    supabase.from("admin_visits_countries_30d").select("*").order("visitors", { ascending: false }),
    supabase.from("admin_visits_pages_30d").select("*").order("visitors", { ascending: false }).limit(10),
    supabase.from("admin_visits_referrers_30d").select("*").order("visitors", { ascending: false }).limit(10),
    supabase.from("admin_donations_monthly").select("*"),
    supabase.from("admin_donations_yearly").select("*").order("year", { ascending: false }),
    supabase.from("donations").select("*").order("occurred_on", { ascending: false }).limit(25),
  ]);

  // ---- visitors ----
  const days = (daily.data ?? []) as Daily[];
  const byDay = new Map(days.map((d) => [d.day, d]));
  const today = mexicoDay();
  const last30 = Array.from({ length: 30 }, (_, i) => {
    // Count back from today's Mexico date (noon UTC avoids daylight-saving edges).
    const day = new Date(Date.parse(`${today}T12:00:00Z`) - (29 - i) * 86400000)
      .toISOString()
      .slice(0, 10);
    return byDay.get(day) ?? { day, views: 0, visitors: 0 };
  });
  const sum = (list: Daily[], k: "views" | "visitors") => list.reduce((n, d) => n + d[k], 0);
  const maxDay = Math.max(0, ...last30.map((d) => d.visitors));
  const regionName = new Intl.DisplayNames([locale], { type: "region" });
  const countryRows = ((countries.data ?? []) as (Count & { country: string })[]).map((c) => ({
    ...c,
    name: c.country ? (regionName.of(c.country) ?? c.country) : t("unknownCountry"),
  }));
  const pageRows = (pages.data ?? []) as (Count & { path: string })[];
  const refRows = (referrers.data ?? []) as (Count & { referrer: string })[];
  const dayLabel = (d: string) =>
    new Date(`${d}T12:00:00`).toLocaleDateString(locale, { day: "numeric", month: "short" });

  // ---- donations ----
  const year = today.slice(0, 4);
  const months = new Map(
    ((monthly.data ?? []) as (Money & { month: string })[]).map((m) => [m.month, m])
  );
  const monthRows = Array.from({ length: 12 }, (_, i) => {
    const key = `${year}-${String(i + 1).padStart(2, "0")}`;
    return { key, m: months.get(key) };
  });
  const years = (yearly.data ?? []) as (Money & { year: number })[];
  const thisYear = years.find((y) => String(y.year) === year);
  const thisMonth = months.get(today.slice(0, 7));
  const allTime = years.reduce((n, y) => n + Number(y.total), 0);
  const maxMonth = Math.max(0, ...monthRows.map((r) => Number(r.m?.total ?? 0)));
  const donations = (recent.data ?? []) as {
    id: string; occurred_on: string; amount: number; donor_name: string | null; donor_email: string | null;
    donor_country: string | null; method: string; frequency: string;
  }[];
  const monthName = (key: string) =>
    new Date(`${key}-15T12:00:00`).toLocaleDateString(locale, { month: "long" });

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="admin-hint">
        {t("intro", { date: days[0] ? new Date(`${days[0].day}T12:00:00`).toLocaleDateString(locale) : dayLabel(today) })}
      </p>

      <h2 className="admin-subheading">{t("visitors")}</h2>
      <div className="admin-cards">
        {[
          [t("today"), byDay.get(today)?.visitors ?? 0],
          [t("last7"), sum(last30.slice(-7), "visitors")],
          [t("last30"), sum(last30, "visitors")],
          [t("views30"), sum(last30, "views")],
        ].map(([label, value]) => (
          <div className="admin-card" key={String(label)}>
            <span className="admin-card-label">{label}</span>
            <span className="admin-card-value">{Number(value).toLocaleString(locale)}</span>
          </div>
        ))}
      </div>

      {days.length === 0 ? (
        <p className="admin-hint">{t("noVisits")}</p>
      ) : (
        <>
          <section className="admin-card">
            <h3 className="admin-card-label">{t("perDay")}</h3>
            <div className="stat-days" role="img" aria-label={t("perDay")}>
              {last30.map((d) => (
                <div key={d.day} className="stat-day" title={`${dayLabel(d.day)}: ${d.visitors}`}>
                  <span style={{ blockSize: `${maxDay ? (d.visitors / maxDay) * 100 : 0}%` }} />
                </div>
              ))}
            </div>
            <div className="stat-days-axis">
              <span>{dayLabel(last30[0].day)}</span>
              <span>{dayLabel(today)}</span>
            </div>
          </section>

          <div className="admin-stat-tables">
            <section className="admin-card">
              <h3 className="admin-card-label">{t("countries")}</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t("colCountry")}</th>
                    <th>{t("colVisitors")}</th>
                  </tr>
                </thead>
                <tbody>
                  {countryRows.map((c) => (
                    <tr key={c.country}>
                      <td>{c.name}</td>
                      <td>
                        <Bar value={c.visitors} max={countryRows[0]?.visitors ?? 0} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
            <section className="admin-card">
              <h3 className="admin-card-label">{t("pages")}</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t("colPage")}</th>
                    <th>{t("colVisitors")}</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((p) => (
                    <tr key={p.path}>
                      <td dir="ltr">{p.path}</td>
                      <td>
                        <Bar value={p.visitors} max={pageRows[0]?.visitors ?? 0} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
            {refRows.length > 0 && (
              <section className="admin-card">
                <h3 className="admin-card-label">{t("referrers")}</h3>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{t("colSite")}</th>
                      <th>{t("colVisitors")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refRows.map((r) => (
                      <tr key={r.referrer}>
                        <td dir="ltr">{r.referrer}</td>
                        <td>
                          <Bar value={r.visitors} max={refRows[0]?.visitors ?? 0} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}
          </div>
        </>
      )}

      <h2 className="admin-subheading">{t("donations")}</h2>
      <div className="admin-cards">
        {[
          [t("thisMonth"), usd(Number(thisMonth?.total ?? 0), locale)],
          [t("thisYear"), usd(Number(thisYear?.total ?? 0), locale)],
          [t("allTime"), usd(allTime, locale)],
          [t("donationsYear"), (thisYear?.donations ?? 0).toLocaleString(locale)],
          [t("donorsYear"), (thisYear?.donors ?? 0).toLocaleString(locale)],
        ].map(([label, value]) => (
          <div className="admin-card" key={label}>
            <span className="admin-card-label">{label}</span>
            <span className="admin-card-value">
              <bdi>{value}</bdi>
            </span>
          </div>
        ))}
      </div>

      <div className="admin-stat-tables">
        <section className="admin-card">
          <h3 className="admin-card-label">{t("monthly", { year })}</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t("colMonth")}</th>
                <th>{t("colTotal")}</th>
                <th>{t("colDonations")}</th>
                <th>{t("colDonors")}</th>
              </tr>
            </thead>
            <tbody>
              {monthRows.map(({ key, m }) => (
                <tr key={key}>
                  <td>{monthName(key)}</td>
                  <td>
                    <span className="stat-bar">
                      <span style={{ inlineSize: `${maxMonth ? (Number(m?.total ?? 0) / maxMonth) * 100 : 0}%` }} />
                      <b>
                        <bdi>{usd(Number(m?.total ?? 0), locale)}</bdi>
                      </b>
                    </span>
                  </td>
                  <td>{m?.donations ?? 0}</td>
                  <td>{m?.donors ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="admin-card">
          <h3 className="admin-card-label">{t("yearly")}</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t("colYear")}</th>
                <th>{t("colTotal")}</th>
                <th>{t("colDonations")}</th>
                <th>{t("colDonors")}</th>
              </tr>
            </thead>
            <tbody>
              {years.map((y) => (
                <tr key={y.year}>
                  <td>{y.year}</td>
                  <td>
                    <bdi>{usd(Number(y.total), locale)}</bdi>
                  </td>
                  <td>{y.donations}</td>
                  <td>{y.donors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <section className="admin-card">
        <h3 className="admin-card-label">{t("recent")}</h3>
        {donations.length === 0 ? (
          <p className="admin-hint">{t("noDonations")}</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t("colDate")}</th>
                <th>{t("colName")}</th>
                <th>{t("colEmail")}</th>
                <th>{t("colCountry")}</th>
                <th>{t("colAmount")}</th>
                <th>{t("colMethod")}</th>
                <th>{t("colFrequency")}</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id}>
                  <td>{new Date(`${d.occurred_on}T12:00:00`).toLocaleDateString(locale)}</td>
                  <td>{d.donor_name ?? t("anonymous")}</td>
                  <td dir="ltr">
                    {d.donor_email ? (
                      <a className="admin-link" href={`mailto:${d.donor_email}`}>
                        {d.donor_email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{d.donor_country ? (regionName.of(d.donor_country) ?? d.donor_country) : "—"}</td>
                  <td>
                    <bdi>{usd(Number(d.amount), locale)}</bdi>
                  </td>
                  <td>{t.has(`methods.${d.method}`) ? t(`methods.${d.method}`) : d.method}</td>
                  <td>{t.has(`frequencies.${d.frequency}`) ? t(`frequencies.${d.frequency}`) : d.frequency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="admin-hint">
          <Link href="/admin/donations">{t("allDonations")}</Link>
        </p>
      </section>
    </div>
  );
}
