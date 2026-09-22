export default function Navbar({ darkMode, onToggleDark }) {
  return (
    <div className="nav">
      <div className="nav-brand">
        <i className="fa-solid fa-wallet" />
        <h2>Spendly</h2>
      </div>
      <button
        className="theme-toggle"
        onClick={onToggleDark}
        aria-label="Toggle dark mode"
      >
        <i className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`} />
      </button>
    </div>
  );
}