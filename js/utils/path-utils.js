export function getBasePrefix() {
  const isGh = location.hostname.endsWith('github.io');
  if (!isGh) return '';
  const [, repo] = location.pathname.split('/');
  return repo ? `/${repo}/` : '/';
}
export const BASE = getBasePrefix();
export const pathTo = (p) => `${BASE}${String(p).replace(/^\/+/, '')}`.replace(/\/{2,}/g, '/');
export const clean  = (p) => String(p || '').replace(/^\.?\//, '');