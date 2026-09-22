import { useEffect, useState } from "react";
import { fmt } from "../utils/format";

export default function BudgetSummary({ budget, setBudget, total, onError }) {
  const [budgetInput, setBudgetInput] = useState(budget || "");

  // Keep input in sync if budget changes externally (e.g. reset)
  useEffect(() => {
    setBudgetInput(budget || "");
  }, [budget]);

  const remaining = Number(budget || 0) - total;
  const usedPct = budget ? Math.min((total / Number(budget)) * 100, 100) : 0;
  const progressClass =
    usedPct >= 100 ? "over" : usedPct >= 80 ? "warn" : "ok";

  const handleSet = () => {
    const value = Number(budgetInput);
    if (isNaN(value) || value <= 0) {
      onError("Enter a valid budget greater than 0.");
      return;
    }
    setBudget(value);
  };

  const handleClear = () => {
    setBudget("");
    setBudgetInput("");
  };

  return (
    <div className="budget-container">
      <div className="budget-box budget-set">
        <label>Monthly Budget</label>
        <h3>Rs {fmt(budget || 0)}</h3>
        <div className="budget-set-row">
          <input
            className="budget-input"
            type="number"
            min="0"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSet()}
            placeholder="Enter budget"
          />
          <button onClick={handleSet}>Set</button>
          {budget ? (
            <button onClick={handleClear} className="budget-clear">
              Clear
            </button>
          ) : null}
        </div>
      </div>

      <div id="total-spent" className="budget-box">
        <label className="spen">Total Spent</label>
        <h3>Rs {fmt(total)}</h3>
        {budget ? (
          <div
            className="progress-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(usedPct)}
          >
            <div
              className={`progress-fill ${progressClass}`}
              style={{ width: `${usedPct}%` }}
            />
          </div>
        ) : null}
      </div>

      <div
        id="remaining"
        className={"budget-box" + (remaining < 0 ? " neg" : "")}
      >
        <label className="rem">Remaining</label>
        <h3>Rs {fmt(remaining)}</h3>
      </div>
    </div>
  );
}