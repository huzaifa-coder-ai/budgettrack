import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { UNDO_TIMEOUT_MS } from "../constants";

export function useExpenses() {
  const [expenses, setExpenses] = useLocalStorage("expenses", []);
  const [lastDeleted, setLastDeleted] = useState(null); // { exp, index }
  const undoTimer = useRef(null);

  useEffect(() => () => clearTimeout(undoTimer.current), []);

  const addExpense = useCallback(
    (data) => {
      setExpenses((prev) => [
        ...prev,
        { ...data, id: Date.now() + Math.random() },
      ]);
    },
    [setExpenses]
  );

  const updateExpense = useCallback(
    (id, data) => {
      setExpenses((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...data } : e))
      );
    },
    [setExpenses]
  );

  const deleteExpense = useCallback(
    (id) => {
      setExpenses((prev) => {
        const index = prev.findIndex((e) => e.id === id);
        if (index === -1) return prev;
        setLastDeleted({ exp: prev[index], index });
        clearTimeout(undoTimer.current);
        undoTimer.current = setTimeout(
          () => setLastDeleted(null),
          UNDO_TIMEOUT_MS
        );
        return prev.filter((e) => e.id !== id);
      });
    },
    [setExpenses]
  );

  const undoDelete = useCallback(() => {
    setLastDeleted((current) => {
      if (!current) return null;
      setExpenses((prev) => {
        const next = [...prev];
        next.splice(current.index, 0, current.exp);
        return next;
      });
      clearTimeout(undoTimer.current);
      return null;
    });
  }, [setExpenses]);

  const clearAll = useCallback(() => setExpenses([]), [setExpenses]);

  const total = useMemo(
    () => expenses.reduce((s, e) => s + Number(e.amount || 0), 0),
    [expenses]
  );

  return {
    expenses,
    total,
    addExpense,
    updateExpense,
    deleteExpense,
    undoDelete,
    lastDeleted,
    clearAll,
  };
}