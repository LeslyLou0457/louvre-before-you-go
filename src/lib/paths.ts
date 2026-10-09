// next/link and the router add the basePath themselves; plain <img src> and
// <a href> to files in public/ do not, so they go through withBase().
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBase(p: string): string {
  return `${BASE_PATH}${p.startsWith("/") ? p : `/${p}`}`;
}
