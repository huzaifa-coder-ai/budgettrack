export default function EmptyState({ hasExpenses }) {
  return (
    <p id="noExp">
      🧾 No expenses found
      <br />
      {hasExpenses
        ? "Try a different search or filter"
        : "Add your first expense to get started"}
    </p>
  );
}