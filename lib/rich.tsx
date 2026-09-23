import type { ReactNode } from "react";

/** Tags allowed inside translated strings, for `t.rich(key, rich)`. */
export const rich = {
  em: (chunks: ReactNode) => <em>{chunks}</em>,
};
