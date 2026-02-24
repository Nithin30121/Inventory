export default function Topbar({ active, query, setQuery, onLogout }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
      <div className="crumb">
  {active === "dashboard"
    ? "Dashboard"
    : active === "items"
    ? "Items"
    : active === "analytics"
    ? "Analytics"
    : active === "guidelines"
    ? "Guidelines"
    : "Contact Info"}
</div>
      </div>

      <div className="topbar-center">
        <div className="search">
          <span className="search-icon">🔎</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
          />
        </div>
      </div>

     <div className="topbar-right">
  <div className="user">
    <div className="avatar" />
    <div className="user-text">
      <div className="user-name">Alex</div>
      <div className="user-role">Manager</div>
    </div>
  </div>

  <button className="btn btn-dark" onClick={onLogout} type="button">
    Logout
  </button>
</div>
    </header>
  );
}