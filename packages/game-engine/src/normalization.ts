export function normalizeWord(text: string): string | null {
  const normalized = text
    .trim().toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\-\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 50);
  return normalized.length === 0 ? null : normalized;
}