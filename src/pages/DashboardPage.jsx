import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import ItemsTable from "../components/ItemsTable";
import seedInventory from "../data/seedInventory";
import InventoryForm from "../components/InventoryForm";

export default function DashboardPage({ onLogout }) {
  const [openAdd, setOpenAdd] = useState(false);
  const [active, setActive] = useState("dashboard"); // "dashboard" | "items"
  const [items, setItems] = useState(seedInventory);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) =>
      [it.id, it.name, it.category, it.status].some((v) =>
        String(v).toLowerCase().includes(q)
      )
    );
  }, [items, query]);

  const stats = useMemo(() => {
    const totalItems = items.length;
    const totalQty = items.reduce((sum, it) => sum + Number(it.qty || 0), 0);
    const lowStock = items.filter((it) => Number(it.qty || 0) <= 5).length;
    const inventoryValue = items.reduce(
      (sum, it) => sum + Number(it.qty || 0) * Number(it.price || 0),
      0
    );

    return { totalItems, totalQty, lowStock, inventoryValue };
  }, [items]);

  function handleDelete(id) {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  function handleQuickAdd() {
    const newItem = {
      id: `ITM-${Math.floor(1000 + Math.random() * 9000)}`,
      name: "New Item",
      category: "Misc",
      qty: 1,
      price: 1.0,
      status: "In Stock",
    };
    setItems((prev) => [newItem, ...prev]);
    setActive("items");
  }
  function handleAddItem(newItem) {
  const created = {
    id: `ITM-${Math.floor(1000 + Math.random() * 9000)}`,
    ...newItem,
  };
  setItems((prev) => [created, ...prev]);
}

  return (
    <div className="dash-app">
      <Sidebar active={active} onChange={setActive} />

      <main className="dash-main">
        <Topbar
          active={active}
          query={query}
          setQuery={setQuery}
          onLogout={onLogout}
        />

        {active === "dashboard" ? (
          <>
            <section className="cards-row">
              <StatCard label="Total Items" value={stats.totalItems} />
              <StatCard label="Total Quantity" value={stats.totalQty} />
              <StatCard label="Low Stock" value={stats.lowStock} highlight />
              <StatCard
                label="Inventory Value"
                value={`$${stats.inventoryValue.toFixed(2)}`}
              />
            </section>

            <section className="panel-grid">
              <div className="panel">
                <div className="panel-title">Inventory Alert</div>
                <div className="panel-body">
                  <div className="kv">
                    <div className="kv-num danger">{stats.lowStock}</div>
                    <div className="kv-label">Low Stock Items</div>
                  </div>
                  <div className="divider" />
                  <div className="kv">
                    <div className="kv-num">{items.length}</div>
                    <div className="kv-label">Total SKUs</div>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-title">Items Details</div>
                <div className="panel-body list">
                  {["Chocolate", "Electronics", "Stationery", "Misc"].map((cat) => {
                    const count = items.filter((x) => x.category === cat).length;
                    return (
                      <div className="list-row" key={cat}>
                        <span className="muted">{cat}</span>
                        <span className="pill">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="panel side">
                <div className="panel-title">Quick Actions</div>
                <div className="panel-body">
                  <button className="btn" onClick={() => setActive("items")} type="button">
                    Go to Items
                  </button>
                  <button className="btn btn-dark" onClick={() => setOpenAdd(true)} type="button">
                    + Add Item
                  </button>
                </div>
              </div>
            </section>

            <section className="panel big">
              <div className="panel-title">Current Items (Preview)</div>
              <div className="panel-body">
                <ItemsTable items={filtered.slice(0, 5)} onDelete={handleDelete} compact />
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="items-header">
              <div>
                <h2 className="h2">Items</h2>
                <p className="muted">Search, view, and delete inventory items.</p>
              </div>
              <button className="btn" onClick={() => setOpenAdd(true)}type="button">
                + Add Item
              </button>
            </section>

            <section className="panel big">
              <div className="panel-title">All Items</div>
              <div className="panel-body">
                <ItemsTable items={filtered} onDelete={handleDelete} />
                <InventoryForm
  open={openAdd}
  onClose={() => setOpenAdd(false)}
  onSave={handleAddItem}
/>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}