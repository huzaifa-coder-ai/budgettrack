const formatter = new Intl.NumberFormat("en-PK", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const fmt = (n) => formatter.format(Number(n) || 0);

export const todayISO = () => new Date().toISOString().slice(0, 10);