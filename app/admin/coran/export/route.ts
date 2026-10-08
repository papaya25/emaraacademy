import { createClient } from "@/lib/supabase/server";
import type { CoranRequest } from "@/lib/coranCampaign";

/** Spreadsheet of Qur'an requests for shipping (admin only: /admin is behind
 *  the login, and the database only lets the admin read the table). Same
 *  filters as the admin page (?status=…&state=…). Opens directly in Excel. */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const supabase = await createClient();
  let query = supabase.from("coran_requests").select("*").order("created_at", { ascending: true });
  if (params.get("status")) query = query.eq("status", params.get("status")!);
  if (params.get("state")) query = query.eq("state", params.get("state")!);
  const { data, error } = await query;
  if (error) return new Response("Not allowed", { status: 403 });

  const columns: [string, (r: CoranRequest) => unknown][] = [
    ["Fecha", (r) => r.created_at.slice(0, 10)],
    ["Estado del envío", (r) => r.status],
    ["Ejemplares", (r) => r.quantity],
    ["Nombre", (r) => r.name],
    ["Teléfono / WhatsApp", (r) => r.phone],
    ["Correo", (r) => r.email],
    ["Calle", (r) => r.street],
    ["Número ext./int.", (r) => r.ext_int_number],
    ["Colonia", (r) => r.colonia],
    ["Código postal", (r) => r.postal_code],
    ["Ciudad o municipio", (r) => r.city],
    ["Estado", (r) => r.state],
    ["Referencias", (r) => r.address_refs],
    ["Guía / nota", (r) => r.tracking],
    ["Edad", (r) => r.age],
    ["Primer Corán", (r) => (r.first_quran === null ? "" : r.first_quran ? "Sí" : "No")],
    ["Relación con el islam", (r) => r.relation],
    ["Se enteró por", (r) => r.heard_from],
    ["Por qué lo quiere", (r) => r.reason],
    ["Comentarios", (r) => r.comments],
  ];
  const cell = (v: unknown) => {
    const text = v === null || v === undefined ? "" : String(v);
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const csv = [
    columns.map(([h]) => cell(h)).join(","),
    ...((data ?? []) as CoranRequest[]).map((r) => columns.map(([, get]) => cell(get(r))).join(",")),
  ].join("\r\n");

  // The BOM makes Excel read accents (ñ, á…) correctly.
  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="coran-solicitudes-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
