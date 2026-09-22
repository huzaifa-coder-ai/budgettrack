import { useEffect, useState } from "react";
import { CATEGORIES, DEFAULT_CATEGORY } from "../constants";
import { todayISO } from "../utils/format";

const PAYMENT_METHODS = ["💵 Cash", "💳 Card", "📱 Mobile Wallet", "🏦 Bank"];

const emptyForm = () => ({
  name: "",
  amount: "",
  category: DEFAULT_CATEGORY,
  date: todayISO(),
  paymentMethod: "💵 Cash",
  note: "",
});

export default function ExpenseForm({ editing, onSubmit, onCancelEdit, onError }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        amount: String(editing.amount),
        category: editing.category,
        date: editing.date || todayISO(),
        paymentMethod: editing.paymentMethod || "💵 Cash",
        note: editing.note || "",
      });
    } else {
      setForm(emptyForm());
    }
  }, [editing]);

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = form.name.trim();
    const amount = Number(form.amount);

    if (!trimmed) return onError("Description can't be empty.");
    if (isNaN(amount) || amount <= 0)
      return onError("Enter a valid amount greater than 0.");

    onSubmit({
      name: trimmed,
      amount,
      category: form.category,
      date: form.date,
      paymentMethod: form.paymentMethod,
      note: form.note.trim(),
    });
    if (!editing) setForm(emptyForm());
  };

  const handleCancel = () => {
    setForm(emptyForm());
    onCancelEdit?.();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="expense-container">
        <label>{editing ? "Edit Expense" : "Add Expense"}</label>

        <span>Description</span>
        <input value={form.name} onChange={update("name")} placeholder="e.g. Coffee" type="text" />

        <span>Amount</span>
        <input value={form.amount} min="0" step="any" onChange={update("amount")} type="number" placeholder="Rs 0.00" />

        <span>Date</span>
        <input value={form.date} onChange={update("date")} type="date" />

        <span>Category</span>
        <div className="category">
          {CATEGORIES.map((item) => (
            <button type="button" key={item} className={form.category === item ? "selected" : ""} onClick={() => setForm((f) => ({ ...f, category: item }))}>
              {item}
            </button>
          ))}
        </div>

        <span>Payment Method</span>
        <div className="category payment-methods">
          {PAYMENT_METHODS.map((item) => (
            <button type="button" key={item} className={form.paymentMethod === item ? "selected" : ""} onClick={() => setForm((f) => ({ ...f, paymentMethod: item }))}>
              {item}
            </button>
          ))}
        </div>

        <span>Note <small>(optional)</small></span>
        <textarea value={form.note} onChange={update("note")} placeholder="Add a short note..." rows="2" />

        <div className="form-actions">
          <button className="addExp" type="submit">{editing ? "Update Expense" : "+ Add Expense"}</button>
          {editing && <button className="cancelEdit" type="button" onClick={handleCancel}>Cancel</button>}
        </div>
      </div>
    </form>
  );
}
