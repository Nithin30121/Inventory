export default function Sidebar({ active, onChange }) {
  return (
    <aside className="sidebar">
      <div className="brand">INVENTORY</div>

      <nav className="nav">
        <button
          className={`nav-item ${active === "dashboard" ? "active" : ""}`}
          onClick={() => onChange("dashboard")}
          type="button"
        >
          <span className="dot" />
          Dashboard
        </button>

        <button
          className={`nav-item ${active === "items" ? "active" : ""}`}
          onClick={() => onChange("items")}
          type="button"
        >
          <span className="dot" />
          Items
        </button>
      </nav>
    </aside>
  );
}