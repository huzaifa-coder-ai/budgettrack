import ExpenseItem from "./ExpenseItem";
import EmptyState from "./EmptyState";

export default function ExpenseList({ expenses, totalCount, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="my-expense">
        <EmptyState hasExpenses={totalCount > 0} />
      </div>
    );
  }

  return (
    <div className="my-expense">
      {expenses.map((e) => (
        <ExpenseItem key={e.id} expense={e} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}