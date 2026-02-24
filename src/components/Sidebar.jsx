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

        {/* ✅ NEW: Analytics */}
        <button
          className={`nav-item ${active === "analytics" ? "active" : ""}`}
          onClick={() => onChange("analytics")}
          type="button"
        >
          <span className="dot" />
          
          Analytics
        </button>
        <button
  className={`nav-item ${active === "guidelines" ? "active" : ""}`}
  onClick={() => onChange("guidelines")}
  type="button"
>
  <span className="dot" />
  Guidelines
</button>

<button
  className={`nav-item ${active === "contact" ? "active" : ""}`}
  onClick={() => onChange("contact")}
  type="button"
>
  <span className="dot" />
  Contact Info
</button>
        <button
          className={`nav-item ${active === "cart" ? "active" : ""}`}
          onClick={() => onChange("cart")}
          type="button"
        >
          <span className="dot" />
          Cart
        </button>
<button
  className={`nav-item ${active === "activity" ? "active" : ""}`}
  onClick={() => onChange("activity")}
  type="button"
>
  <span className="dot" />
  Activity
</button>
      </nav>
    </aside>
  );
}