const RESEND_API_URL = "https://api.resend.com/emails/batch";
const BATCH_SIZE = 100; // Resend's batch endpoint limit per call

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/**
 * Sends one email per recipient (never exposing the list to each other) via
 * Resend's batch endpoint. Throws if RESEND_API_KEY isn't set or a batch
 * request fails.
 */
export async function sendBroadcast(
  subject: string,
  bodyText: string,
  recipients: string[]
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");

  const from = process.env.RESEND_FROM_EMAIL || "Emara Academy <newsletter@emaraacademy.org>";
  const html = bodyText
    .split("\n")
    .map((line) => `<p>${line || "&nbsp;"}</p>`)
    .join("");

  for (const batch of chunk(recipients, BATCH_SIZE)) {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        batch.map((to) => ({ from, to, subject, html, text: bodyText }))
      ),
    });
    if (!res.ok) {
      const detail = await res.text();
      throw new Error(`Resend batch send failed: ${res.status} ${detail}`);
    }
  }
}
