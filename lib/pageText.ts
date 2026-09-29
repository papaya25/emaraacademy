/**
 * Page texts the admin can edit (admin → Page texts). Saved edits live in the
 * `site_settings` row `page_text` and are laid over messages/*.json when a
 * page is built (i18n/request.ts). A path is a message key with array indexes,
 * e.g. "about.values.items.0.title". An empty string hides that text.
 */

export const LOCALES = ["ar", "en", "es"] as const; // Arabic leads
export type Locale = (typeof LOCALES)[number];

/** Editable pages → the message keys (prefixes) whose text shows on them. */
export const EDITABLE_PAGES = {
  home: ["home", "shared.seeOurWork", "impact", "newsletter.note", "newsletter.subscribe"],
  "new-muslims": ["newMuslims"],
  about: ["about"],
} as const;
export type EditablePage = keyof typeof EDITABLE_PAGES;

export type PageTextStore = {
  /** locale → path → text */
  text: Partial<Record<Locale, Record<string, string>>>;
  /** path → locale → ISO time that language's text last changed */
  updated: Record<string, Partial<Record<Locale, string>>>;
};

export const EMPTY_STORE: PageTextStore = { text: {}, updated: {} };

type Tree = { [k: string]: unknown };

/** Every string in `messages` under the page's prefixes, as path → text. */
export function flattenPage(messages: Tree, page: EditablePage): Record<string, string> {
  const out: Record<string, string> = {};
  const walk = (node: unknown, path: string) => {
    if (typeof node === "string") out[path] = node;
    else if (node && typeof node === "object")
      for (const [k, v] of Object.entries(node)) walk(v, `${path}.${k}`);
  };
  for (const prefix of EDITABLE_PAGES[page]) {
    const node = prefix.split(".").reduce<unknown>((n, k) => (n as Tree)?.[k], messages);
    if (node !== undefined) walk(node, prefix);
  }
  return out;
}

/** A copy of `messages` with the saved texts written in. Paths that no longer
 *  exist in the messages are ignored, so an edit can't create stray keys. */
export function applyPageText(messages: Tree, saved: Record<string, string>): Tree {
  const copy = structuredClone(messages);
  for (const [path, text] of Object.entries(saved)) {
    const keys = path.split(".");
    const last = keys.pop()!;
    const parent = keys.reduce<unknown>((n, k) => (n as Tree)?.[k], copy) as Tree | undefined;
    if (parent && typeof parent[last] === "string") parent[last] = text;
  }
  return copy;
}

/** True when the key exists in this language and isn't empty — pages show a
 *  text (or a whole section, by its title) only then. */
export function hasText(t: { has(key: string): boolean; raw(key: string): unknown }, key: string) {
  return t.has(key) && t.raw(key) !== "";
}
