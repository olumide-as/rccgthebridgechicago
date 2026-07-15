export function normaliseName(value: string, maxLength = 60): string { return value.replace(/\s+/g, ' ').trim().slice(0, maxLength).trim(); }
export function slugifyFilenamePart(value: string, fallback = 'guest'): string { const slug = value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''); return slug || fallback; }
export function flyerFilename(prefix: string, name: string): string { return `${slugifyFilenamePart(prefix, 'flyer')}-${slugifyFilenamePart(name)}-im-attending.png`; }
