import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { deleteCoranRequest, updateCoranRequest } from "@/app/admin/actions";
import { whatsappUrl } from "@/lib/contactInfo";
import {
  HEARD_FROM,
  MX_STATES,
  RELATIONS,
  REQUEST_STATUSES,
  type CoranRequest,
} from "@/lib/coranCampaign";

type Row = { label: string; requests: number; copies: number };

/** Count requests and copies per key, biggest first. */
function breakdown(list: CoranRequest[], key: (r: CoranRequest) => string): Row[] {
  const m = new Map<string, Row>();
  for (const r of list) {
    const label = key(r);
    const row = m.get(label) ?? { label, requests: 0, copies: 0 };
    row.requests += 1;
    row.copies += r.quantity;
    m.set(label, row);
  }
  return [...m.values()].sort((a, b) => b.requests - a.requests);
}

export default async function AdminCoranPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; state?: string }>;
}) {
  const t = await getTranslations("admin.coran");
  const locale = await getLocale();
  const { status = "", state = "" } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("coran_requests")
    .select("*")
    .order("created_at", { ascending: false });
  const all = (data ?? []) as CoranRequest[];
  // Cancelled requests don't count toward demand.
  const live = all.filter((r) => r.status !== "cancelled");
  const shown = all.filter((r) => (!status || r.status === status) && (!state || r.state === state));

  const count = (s: string) => all.filter((r) => r.status === s).length;
  const ages = live.map((r) => r.age);
  const cards = [
    { label: t("stats.requests"), value: live.length },
    { label: t("stats.copies"), value: live.reduce((n, r) => n + r.quantity, 0) },
    { label: t("stats.pending"), value: count("pending") },
    { label: t("stats.sent"), value: count("sent") },
    { label: t("stats.delivered"), value: count("delivered") },
    {
      label: t("stats.copiesShipped"),
      value: all.filter((r) => r.status === "sent" || r.status === "delivered").reduce((n, r) => n + r.quantity, 0),
    },
    { label: t("stats.avgAge"), value: ages.length ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : "—" },
  ];
  const tables: { title: string; rows: Row[] }[] = [
    { title: t("byState"), rows: breakdown(live, (r) => r.state) },
    { title: t("byRelation"), rows: breakdown(live, (r) => (r.relation ? t(`relations.${r.relation}`) : t("unknown"))) },
    { title: t("byHeard"), rows: breakdown(live, (r) => (r.heard_from ? t(`heard.${r.heard_from}`) : t("unknown"))) },
    {
      title: t("byFirst"),
      rows: breakdown(live, (r) => (r.first_quran === null ? t("unknown") : r.first_quran ? t("yes") : t("no"))),
    },
    {
      title: t("byMonth"),
      rows: breakdown(live, (r) => r.created_at.slice(0, 7)).sort((a, b) => b.label.localeCompare(a.label)),
    },
  ];
  const exportHref = `/admin/coran/export?${new URLSearchParams({ ...(status && { status }), ...(state && { state }) })}`;

  return (
    <div>
      <h1>{t("title")}</h1>
      <p className="admin-hint">{t("intro")}</p>

      <div className="admin-cards">
        {cards.map((c) => (
          <div className="admin-card" key={c.label}>
            <span className="admin-card-label">{c.label}</span>
            <span className="admin-card-value">{c.value}</span>
          </div>
        ))}
      </div>

      {live.length > 0 && (
        <div className="admin-stat-tables">
          {tables.map((tb) => (
            <section className="admin-card" key={tb.title}>
              <h3 className="admin-card-label">{tb.title}</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>{t("colRequests")}</th>
                    <th>{t("colCopies")}</th>
                  </tr>
                </thead>
                <tbody>
                  {tb.rows.map((r) => (
                    <tr key={r.label}>
                      <td>{r.label}</td>
                      <td>{r.requests}</td>
                      <td>{r.copies}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}
        </div>
      )}

      <form className="admin-form admin-filter-row" method="get">
        <div className="admin-form-row">
          <label>
            {t("filterStatus")}
            <select name="status" defaultValue={status}>
              <option value="">{t("all")}</option>
              {REQUEST_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {t(`statuses.${s}`)}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t("filterState")}
            <select name="state" defaultValue={state}>
              <option value="">{t("all")}</option>
              {MX_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <button className="btn btn-ghost" type="submit">
            {t("apply")}
          </button>
          <a className="btn btn-green" href={exportHref}>
            {t("export")}
          </a>
        </div>
      </form>

      {shown.length === 0 && <p className="admin-hint">{all.length ? t("emptyFiltered") : t("empty")}</p>}

      {shown.map((r) => (
        <section className={`admin-card coran-request-card s-${r.status}`} key={r.id}>
          <div className="admin-message-head">
            <div>
              <strong>{r.name}</strong> · {t("card.age", { age: r.age })} ·{" "}
              <strong>{t("card.copies", { count: r.quantity })}</strong>
            </div>
            <span className="admin-hint">
              {t("card.received", { date: new Date(r.created_at).toLocaleDateString(locale) })}
            </span>
          </div>

          <div className="coran-request-grid">
            <div>
              <span className="admin-card-label">{t("card.shipTo")}</span>
              <address className="coran-address" dir="ltr">
                {r.name}
                <br />
                {r.street} {r.ext_int_number}
                <br />
                Col. {r.colonia}, C.P. {r.postal_code}
                <br />
                {r.city}, {r.state}
              </address>
              <p className="admin-hint">
                {t("card.refs")}: {r.address_refs}
              </p>
              <p>
                <a className="admin-link" href={whatsappUrl(r.phone, "")} target="_blank" rel="noopener noreferrer" dir="ltr">
                  {r.phone}
                </a>{" "}
                ·{" "}
                <a className="admin-link" href={`mailto:${r.email}`} dir="ltr">
                  {r.email}
                </a>
              </p>
            </div>
            <dl className="coran-request-facts">
              <div>
                <dt>{t("card.firstQuran")}</dt>
                <dd>{r.first_quran === null ? t("unknown") : r.first_quran ? t("yes") : t("no")}</dd>
              </div>
              <div>
                <dt>{t("card.relation")}</dt>
                <dd>{r.relation ? t(`relations.${r.relation}`) : t("unknown")}</dd>
              </div>
              <div>
                <dt>{t("card.heard")}</dt>
                <dd>{r.heard_from ? t(`heard.${r.heard_from}`) : t("unknown")}</dd>
              </div>
              {r.reason && (
                <div>
                  <dt>{t("card.reason")}</dt>
                  <dd>{r.reason}</dd>
                </div>
              )}
              {r.comments && (
                <div>
                  <dt>{t("card.comments")}</dt>
                  <dd>{r.comments}</dd>
                </div>
              )}
            </dl>
          </div>

          <form action={updateCoranRequest} className="admin-form">
            <input type="hidden" name="id" value={r.id} />
            <div className="admin-form-row">
              <label>
                {t("card.status")}
                <select name="status" defaultValue={r.status}>
                  {REQUEST_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {t(`statuses.${s}`)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t("card.tracking")}
                <input name="tracking" defaultValue={r.tracking ?? ""} maxLength={500} />
              </label>
              <button className="btn btn-green" type="submit">
                {t("card.save")}
              </button>
            </div>
          </form>
          <form action={deleteCoranRequest} className="admin-delete-row">
            <input type="hidden" name="id" value={r.id} />
            <button type="submit" className="admin-link admin-link-danger">
              {t("card.delete")}
            </button>
          </form>
        </section>
      ))}
    </div>
  );
}
