/**
 * Format price in Japanese Yen
 */
export function formatPrice(price: number): string {
  return `¥${price.toLocaleString('ja-JP')}`;
}

/**
 * Format serial number with leading zeros
 */
export function formatSerialNumber(serial: number, totalSupply?: number | null): string {
  const serialStr = String(serial).padStart(3, '0');
  if (totalSupply) {
    return `#${serialStr} / ${totalSupply}`;
  }
  return `#${serialStr}`;
}

/**
 * Format date in Japanese format
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Format member count with abbreviation
 */
export function formatMemberCount(count: number): string {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return String(count);
}
