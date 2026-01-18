
export function StringifyLog(obj: Record<string, any>): string {
  if (!obj) return '';
  return Object.entries(obj)
    .map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        try {
          return `${key}: ${JSON.stringify(value)}`;
        } catch {
          return `${key}: [Circular]`;
        }
      }
      return `${key}: ${value}`;
    })
    .join(' | ');
}
