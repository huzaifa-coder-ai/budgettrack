import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CATEGORIES, CATEGORY_COLORS } from "../constants";
import { fmt } from "../utils/format";

export default function CategoryChart({ expenses }) {
  const [open, setOpen] = useState(true);

  const chartData = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        name: cat,
        value: expenses
          .filter((e) => e.category === cat)
          .reduce((s, e) => s + Number(e.amount || 0), 0),
      })).filter((d) => d.value > 0),
    [expenses]
  );

  if (chartData.length === 0) return null;

  return (
    <div className="chart-section">
      <div className="chart-header">
        <label>Spending by Category</label>
        <button className="chart-toggle" onClick={() => setOpen((o) => !o)}>
          {open ? "Hide" : "Show"}
        </button>
      </div>
      {open && (
        <div className="chart-body">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={CATEGORY_COLORS[entry.name] || "#495057"}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `Rs ${fmt(value)}`}
                contentStyle={{ borderRadius: 10 }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}