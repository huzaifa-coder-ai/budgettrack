import { CATEGORY_COLORS } from "../constants";
import { fmt } from "../utils/format";

export default function ExpenseItem({ expense, onEdit, onDelete }) {
  return (
    <div className="each-exp">
      <div className="cat-dot" style={{ background: CATEGORY_COLORS[expense.category] || "#495057" }} />
      <div className="exp-main">
        <h3>{expense.name}</h3>
        <div className="exp-meta">
          <p className="exp-cat">{expense.category}</p>
          {expense.date && <p className="exp-date">{expense.date}</p>}
          {expense.paymentMethod && <p className="exp-date">{expense.paymentMethod}</p>}
        </div>
        {expense.note && <p className="exp-note">{expense.note}</p>}
      </div>
      <div className="amount-del">
        <p className="ammount">Rs {fmt(expense.amount)}</p>
        <button aria-label={`Edit ${expense.name}`} type="button" onClick={() => onEdit(expense)}><i className="fa-solid fa-pen" /></button>
        <button className="delete-btn" aria-label={`Delete ${expense.name}`} type="button" onClick={() => onDelete(expense.id)}><i className="fa-solid fa-trash" /></button>
      </div>
    </div>
  );
}
