export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompact(value: number | null | undefined): string {
  if (value == null) return '—';
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return formatCurrency(value);
}

export function formatPercentage(value: number | null | undefined): string {
  if (value == null) return '—';
  return `${value.toFixed(1)}%`;
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-US').format(value);
}

export function parseCurrencyInput(value: string): number | undefined {
  const cleaned = value.replace(/[$,\s]/g, '');
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? undefined : num;
}

export function formatCurrencyInput(value: number | undefined): string {
  if (value == null) return '';
  return new Intl.NumberFormat('en-US').format(value);
}

export function getRoleName(slug: string): string {
  const names: Record<string, string> = {
    ceo: 'CEO',
    'president-ceo': 'President & CEO',
    president: 'President',
    coo: 'COO',
    cfo: 'CFO',
    cmo: 'CMO',
    cno: 'CNO',
    cio: 'CIO',
    chro: 'CHRO',
    cso: 'CSO',
  };
  return names[slug] || slug.toUpperCase();
}

export function getRoleFullName(slug: string): string {
  const names: Record<string, string> = {
    ceo: 'Chief Executive Officer',
    'president-ceo': 'President & Chief Executive Officer',
    president: 'President',
    coo: 'Chief Operating Officer',
    cfo: 'Chief Financial Officer',
    cmo: 'Chief Medical Officer',
    cno: 'Chief Nursing Officer',
    cio: 'Chief Information Officer',
    chro: 'Chief Human Resources Officer',
    cso: 'Chief Strategy Officer',
  };
  return names[slug] || slug;
}
