import { todayISO } from "./format";

// Prevent CSV formula injection (Excel/Sheets)
const sanitizeForCSV = (str) => {
  const s = String(str ?? "");
  return /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
};

const escapeCSV = (str) => `"${sanitizeForCSV(str).replace(/"/g, '""')}"`;

export function exportExpensesCSV(expenses) {
  if (expenses.length === 0) return false;

  const header = "Name,Amount,Category,Date,Payment Method,Note\n";
  const rows = expenses
    .map(
      (e) =>
        `${escapeCSV(e.name)},${e.amount},${escapeCSV(e.category)},${e.date || ""},${escapeCSV(e.paymentMethod || "")},${escapeCSV(e.note || "")}`
    )
    .join("\n");

  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `spendly-expenses-${todayISO()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}