import currency from 'currency.js';

export function formatCurrency(value: number): string {
  return currency(value, {
    pattern: '# !',
    separator: ' ',
    decimal: '.',
    symbol: '',
    precision: 0,
  }).format();
}
