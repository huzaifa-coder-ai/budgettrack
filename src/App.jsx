import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { TOAST_TIMEOUT_MS } from "./constant";
import "./App.css";

import Navbar from "./components/Navbar";
import Toasts from "./components/Toasts";
import BudgetSummary from "./components/BudgetSummary";
import CategoryChart from "./components/CategoryChart";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseFilters from "./components/ExpenseFilters";
import ExpenseList from "./components/ExpenseList";
import ConfirmDialog from "./components/ConfirmDialog";
import PWAInstallButton from "./PWAInstallButton";

import { useLocalStorage } from "./hooks/useLocalStorage";
import { useExpenses } from "./hooks/useExpenses";
import { useToast } from "./hooks/useToast";
import { exportExpensesCSV } from "./utils/csv";

export default function App() {
  const [budget, setBudget] = useLocalStorage("budget", "");
  const [darkMode, setDarkMode] = useLocalStorage("darkMode", false);

  const {
    expenses,
    total,
    addExpense,
    updateExpense,
    deleteExpense,
    undoDelete,
    lastDeleted,
    clearAll,
  } = useExpenses();

  const { error, showError } = useToast();


  const [editingId, setEditingId] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [month, setMonth] = useState("");

 
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);


  const editingExpense = useMemo(
    () => expenses.find((e) => e.id === editingId) || null,
    [expenses, editingId]
  );

  // If the edited item is deleted elsewhere, exit edit mode
  const prevEditingRef = useRef(editingId);
  useEffect(() => {
    if (prevEditingRef.current && !editingExpense) setEditingId(null);
    prevEditingRef.current = editingId;
  }, [editingExpense, editingId]);

  // ---- handlers ----
  const handleSubmit = useCallback(
    (data) => {
      if (editingId) {
        updateExpense(editingId, data);
        setEditingId(null);
      } else {
        addExpense(data);
      }
    },
    [editingId, addExpense, updateExpense]
  );

  const handleDelete = useCallback(
    (id) => {
      if (editingId === id) setEditingId(null);
      deleteExpense(id);
    },
    [editingId, deleteExpense]
  );

  const handleExport = useCallback(() => {
    const ok = exportExpensesCSV(expenses);
    if (!ok) showError("No expenses to export.");
  }, [expenses, showError]);

  const handleClearAll = useCallback(() => {
    if (expenses.length === 0) return;
    setShowConfirm(true);
  }, [expenses.length]);

  // ---- derived filtered/sorted list ----
  const visibleExpenses = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return expenses
      .filter((e) => filterCategory === "All" || e.category === filterCategory)
      .filter((e) => !term || e.name.toLowerCase().includes(term) || e.note?.toLowerCase().includes(term))
      .filter((e) => !month || e.date?.startsWith(month))
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return b.id - a.id;
          case "oldest":
            return a.id - b.id;
          case "highest":
            return b.amount - a.amount;
          case "lowest":
            return a.amount - b.amount;
          default:
            return 0;
        }
      });
  }, [expenses, filterCategory, searchTerm, sortBy, month]);

  return (
    <>
      <Navbar darkMode={darkMode} onToggleDark={() => setDarkMode((d) => !d)} />

      <div className="pwa-install-wrap">
        <PWAInstallButton />
      </div>

      <Toasts error={error} lastDeleted={lastDeleted} onUndo={undoDelete} />

      <BudgetSummary
        budget={budget}
        setBudget={setBudget}
        total={total}
        onError={showError}
      />

      <CategoryChart expenses={expenses} />

      <div className="rowSec">
        <ExpenseForm
          editing={editingExpense}
          onSubmit={handleSubmit}
          onCancelEdit={() => setEditingId(null)}
          onError={showError}
        />

        <div className="display-page">
          <ExpenseFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            month={month}
            onMonthChange={setMonth}
            filterCategory={filterCategory}
            onFilterChange={setFilterCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onExport={handleExport}
            onClearAll={handleClearAll}
            disableClearAll={expenses.length === 0}
          />

          <ExpenseList
            expenses={visibleExpenses}
            totalCount={expenses.length}
            onEdit={(exp) => {
              setEditingId(exp.id);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        message="Are you sure you want to delete all expenses? This cannot be undone."
        onConfirm={() => {
          clearAll();
          setEditingId(null);
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}