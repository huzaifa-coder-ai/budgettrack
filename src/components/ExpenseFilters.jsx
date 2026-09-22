import { CATEGORIES } from "../constants";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest" },
  { value: "highest", label: "Highest Amount" },
  { value: "lowest", label: "Lowest Amount" },
];

export default function ExpenseFilters({ searchTerm, onSearchChange, filterCategory, onFilterChange, sortBy, onSortChange, month, onMonthChange, onExport, onClearAll, disableClearAll }) {
  return (
    <>
      <div className="search-row">
        <input className="search-input" type="text" placeholder="🔍 Search expenses..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} />
        <input className="month-input" type="month" value={month} onChange={(e) => onMonthChange(e.target.value)} aria-label="Filter by month" />
        <button className="exportBtn" onClick={onExport} type="button"><i className="fa-solid fa-file-export" /> Export CSV</button>
      </div>

      <div className="filter-sort">
        <div className="filtered-values">
          {["All", ...CATEGORIES].map((item) => (
            <button type="button" key={item} className={filterCategory === item ? "selected" : ""} onClick={() => onFilterChange(item)}>{item}</button>
          ))}
        </div>

        <div className="sort">
          <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {month && <button className="clear-filter" onClick={() => onMonthChange("")} type="button">Clear Month</button>}
          <button className="clearAll" onClick={onClearAll} disabled={disableClearAll}>Clear All</button>
        </div>
      </div>
    </>
  );
}
