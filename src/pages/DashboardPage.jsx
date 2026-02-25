import { useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import ItemsTable from "../components/ItemsTable";
import seedInventory from "../data/seedInventory";
import catalogChocolates from "../data/catalogChocolates";
import InventoryForm from "../components/InventoryForm";
import AdvancedAnalytics from "../components/AdvancedAnalytics";
import ProductCard from "../components/ProductCard";

export default function DashboardPage({ onLogout }) {
  const [openAdd, setOpenAdd] = useState(false);
  const [active, setActive] = useState("dashboard"); // "dashboard" | "items" | "analytics" | "activity" | "guidelines" | "contact"
  const [items, setItems] = useState(seedInventory);
  const [query, setQuery] = useState("");
  const [activity, setActivity] = useState([
  { id: 1, text: "System initialized", time: new Date().toLocaleString() },
]);
  const [cart, setCart] = useState([]); // { id, cartQty }

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
  const deleted = items.find((x) => x.id === id);
  setItems((prev) => prev.filter((x) => x.id !== id));
  setCart((prev) => prev.filter((c) => c.id !== id));

  // ✅ ADD THIS LOG
  if (deleted) {
    setActivity((prev) => [
      {
        id: Date.now(),
        text: `Item deleted: ${deleted.name} (${deleted.id})`,
        time: new Date().toLocaleString(),
      },
      ...prev,
    ]);
  }
}

function handleAddItem(newItem) {
  const created = {
    id: `ITM-${Math.floor(1000 + Math.random() * 9000)}`,
    ...newItem,
  };

  setItems((prev) => [created, ...prev]);

  // ✅ ADD THIS LOG
  setActivity((prev) => [
    {
      id: Date.now(),
      text: `Item added: ${created.name} (${created.id})`,
      time: new Date().toLocaleString(),
    },
    ...prev,
  ]);
}

function addCatalogItemToInventory(product) {
  const exists = items.some((it) => it.sku === product.sku);

  if (exists) {
    setActive("items"); // route anyway
    return;
  }

  const created = {
    id: `CHOC-${Math.floor(1000 + Math.random() * 9000)}`,
    sku: product.sku, // ✅ link to catalog
    name: product.name,
    category: product.category || "Chocolate",
    qty: product.defaultQty ?? 1,
    price: product.price ?? 0,
    status: (product.defaultQty ?? 1) <= 5 ? "Low Stock" : "In Stock",
    rating: product.rating,
    reviews: product.reviews,
    desc: product.desc,
  };

  setItems((prev) => [created, ...prev]);
  setActive("items"); // ✅ route to Items
}

function addToCart(item) {
  const stock = Number(item.qty || 0);
  if (stock <= 0) return;

  setCart((prev) => {
    const found = prev.find((c) => c.id === item.id);
    if (found) {
      const nextQty = Math.min(found.cartQty + 1, stock);
      return prev.map((c) => (c.id === item.id ? { ...c, cartQty: nextQty } : c));
    }
    return [{ id: item.id, cartQty: 1 }, ...prev];
  });
}

function incCart(id) {
  const item = items.find((x) => x.id === id);
  const stock = Number(item?.qty || 0);

  setCart((prev) =>
    prev.map((c) => (c.id === id ? { ...c, cartQty: Math.min(c.cartQty + 1, stock) } : c))
  );
}

function decCart(id) {
  setCart((prev) =>
    prev
      .map((c) => (c.id === id ? { ...c, cartQty: c.cartQty - 1 } : c))
      .filter((c) => c.cartQty > 0)
  );
}

function removeFromCart(id) {
  setCart((prev) => prev.filter((c) => c.id !== id));
}

const cartItems = useMemo(() => {
  const map = new Map(cart.map((c) => [c.id, c.cartQty]));
  return items.filter((it) => map.has(it.id)).map((it) => ({ ...it, cartQty: map.get(it.id) }));
}, [cart, items]);

const cartTotal = useMemo(
  () => cartItems.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.cartQty || 0), 0),
  [cartItems]
);

  return (
    <div className="dash-app">
      <Sidebar active={active} onChange={setActive} />

      <main className="dash-main">
        <Topbar active={active} query={query} setQuery={setQuery} onLogout={onLogout} />

        {active === "dashboard" ? (
          <>
            {/* DASHBOARD */}
            <section className="cards-row">
              <StatCard label="Total Items" value={stats.totalItems} />
              <StatCard label="Total Quantity" value={stats.totalQty} />
              <StatCard label="Low Stock" value={stats.lowStock} highlight />
              <StatCard
                label="Inventory Value"
                value={`₹${stats.inventoryValue.toFixed(2)}`}
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
                  {["Milk Chocolate", "Dark Chocolate", "Chocolate Bars", "Candy"].map((cat) => {
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
                <ItemsTable items={filtered.slice(0, 5)} onDelete={handleDelete} onAddToCart={addToCart} compact />
              </div>
            </section>
          </>
        ) : active === "items" ? (
          <>
            {/* ITEMS */}
            <section className="items-header">
              <div>
                <h2 className="h2">Items</h2>
                <p className="muted">Search, view, and delete inventory items.</p>
              </div>

              <button className="btn" onClick={() => setOpenAdd(true)} type="button">
                + Add Item
              </button>
            </section>

            <section className="panel big">
              <div className="panel-title">All Items</div>
              <div className="panel-body">
                <ItemsTable items={filtered} onDelete={handleDelete} onAddToCart={addToCart} />
                <InventoryForm
                  open={openAdd}
                  onClose={() => setOpenAdd(false)}
                  onSave={handleAddItem}
                />
              </div>
            </section>
          </>
          
        ) : active === "cart" ? (
          <>
            <section className="items-header">
              <div>
                <h2 className="h2">Chocolate Catalog</h2>
                <p className="muted">Preset items. Click "Add to Items" to add them into inventory.</p>
              </div>
            </section>

            <section className="panel big neon">
              <div className="panel-title">Available Products</div>
              <div className="panel-body">
                <section className="shop-grid">
                  {catalogChocolates.map((p) => {
                const alreadyInInventory = items.some((it) => it.sku === p.sku);

                return (
                  <ProductCard
                    key={p.sku}
                    item={{
                      ...p,
                      qty: alreadyInInventory ? 0 : (p.defaultQty ?? 1),
                    }}
                    mode="catalog"
                    onAdd={() => addCatalogItemToInventory(p)}
                    disabled={alreadyInInventory}
                    ctaText={alreadyInInventory ? "Added" : "Add to Items"}
                  />
                  );
                })}
                </section>
              </div>
            </section>
          </>
        ) : active === "analytics" ? (
          <>
            {/* ANALYTICS */}
            <section className="items-header">
              <div>
                <h2 className="h2">Analytics</h2>
                <p className="muted">Insights based on inventory quantity and value.</p>
              </div>
            </section>

            <AdvancedAnalytics items={items} />
          </>
        ) : active === "activity" ? (
          <>
            <section className="items-header">
              <div>
                <h2 className="h2">Activity Log</h2>
                <p className="muted">Recent actions performed in the system.</p>
              </div>
            </section>

            <section className="panel big neon">
              <div className="panel-title">Recent Activity</div>
              <div className="panel-body">
                {activity.length === 0 ? (
                  <div className="muted">No activity yet.</div>
                ) : (
                  <div className="activity-list">
                    {activity.map((log) => (
                      <div className="activity-row" key={log.id}>
                        <div className="activity-text">{log.text}</div>
                        <div className="activity-time">{log.time}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        ) : active === "guidelines" ? (
          <>
            {/* GUIDELINES */}
            <section className="items-header">
              <div>
                <h2 className="h2">Guidelines</h2>
                <p className="muted">Project rules and usage notes.</p>
              </div>
            </section>

            <section className="panel big neon">
              <div className="panel-title">Inventory Guidelines</div>
              <div className="panel-body">
                 <div className="guidelines-content">

      <h3>1. Purpose of This System</h3>
      <p>
        This Inventory Management Dashboard is designed to help users track, monitor,
        and manage stock levels across multiple product categories. The system provides
        real-time visibility into total items, quantity on hand, low stock alerts, and
        overall inventory value. It is intended to support operational decision-making,
        reduce stock-outs, and improve inventory planning.
      </p>

      <h3>2. Who Should Use This</h3>
      <ul>
        <li><b>Managers:</b> Monitor inventory health, track low stock, and plan restocking.</li>
        <li><b>Operators:</b> Add, update, and remove inventory items.</li>
        <li><b>Auditors:</b> Review stock data for reporting and verification.</li>
      </ul>

      <h3>3. How to Use the Dashboard</h3>
      <ol>
        <li>
          <b>Login:</b> Sign in using your account credentials from the Login page.
        </li>
        <li>
          <b>Dashboard Overview:</b> View key metrics such as Total Items, Total Quantity,
          Low Stock count, and Inventory Value.
        </li>
        <li>
          <b>Navigate to Items:</b> Use the sidebar to open the Items page to view the
          full list of products.
        </li>
        <li>
          <b>Add New Items:</b> Click on “+ Add Item” and fill in Name, Category, Quantity,
          Price, and Status.
        </li>
        <li>
          <b>Search Items:</b> Use the search bar in the top header to quickly find
          specific products.
        </li>
        <li>
          <b>Delete Items:</b> Remove obsolete or discontinued items from the inventory list.
        </li>
        <li>
          <b>Analytics:</b> Review charts and insights in the Analytics tab to understand
          stock distribution and high-value items.
        </li>
      </ol>

      <h3>4. Inventory Status Definitions</h3>
      <ul>
        <li><b>In Stock:</b> Items with sufficient quantity available.</li>
        <li><b>Low Stock:</b> Items with quantity less than or equal to the defined threshold (≤ 5 units).</li>
        <li><b>Out of Stock:</b> Items with zero available quantity.</li>
      </ul>

      <h3>5. Best Practices</h3>
      <ul>
        <li>Always keep item names clear and descriptive.</li>
        <li>Use consistent categories (Milk Chocolate, Dark Chocolate, Chocolate Bars, Candy).</li>
        <li>Regularly review Low Stock items and restock before running out.</li>
        <li>Validate prices and quantities before saving new items.</li>
        <li>Perform periodic reviews of inventory data for accuracy.</li>
      </ul>

      <h3>6. Do’s and Don’ts</h3>
      <div className="guidelines-grid">
        <div className="guidelines-box">
          <h4>Do</h4>
          <ul>
            <li>Use the search feature to quickly locate items.</li>
            <li>Update inventory when stock is received or sold.</li>
            <li>Review analytics to identify fast-moving items.</li>
            <li>Keep the inventory clean by removing outdated items.</li>
          </ul>
        </div>

        <div className="guidelines-box">
          <h4>Don’t</h4>
          <ul>
            <li>Don’t leave quantities empty or incorrect.</li>
            <li>Don’t use random or inconsistent category names.</li>
            <li>Don’t ignore low stock warnings.</li>
            <li>Don’t delete items without proper verification.</li>
          </ul>
        </div>
      </div>

      <h3>7. Common Mistakes to Avoid</h3>
      <ul>
        <li>Forgetting to update quantity after adding new stock.</li>
        <li>Entering incorrect prices which can skew inventory value.</li>
        <li>Ignoring low stock alerts, leading to stock-outs.</li>
        <li>Creating duplicate items instead of updating existing ones.</li>
      </ul>

      <h3>8. Data Responsibility & Accuracy</h3>
      <p>
        All users are responsible for maintaining accurate inventory data. Inaccurate
        or outdated information can lead to operational inefficiencies, stock shortages,
        or financial discrepancies. Ensure that updates are performed promptly and
        verified when possible.
      </p>

      <h3>9. Future Enhancements (Planned)</h3>
      <ul>
        <li>User roles and permissions (Admin, Manager, Viewer).</li>
        <li>Export inventory reports (CSV/PDF).</li>
        <li>Inventory history and audit logs.</li>
        <li>Automated low-stock notifications.</li>
      </ul>

    </div>
                  
              </div>
            </section>
          </>
        ) : (
          <>
            {/* CONTACT */}
            <section className="items-header">
              <div>
                <h2 className="h2">Contact Info</h2>
                <p className="muted">Support and project owner details.</p>
              </div>
            </section>

            <section className="panel big neon">
              <div className="panel-title">Support</div>
              <div className="panel-body">
                <div className="contact-grid">
                  <div className="contact-row">
                    <span className="muted">Owner</span>
                    <span>Alex (Manager)</span>
                  </div>
                  <div className="contact-row">
                    <span className="muted">Email</span>
                    <span>support@inventoryapp.com</span>
                  </div>
                  <div className="contact-row">
                    <span className="muted">Phone</span>
                    <span>+1 (000) 000-0000</span>
                  </div>
                  <div className="contact-row">
                    <span className="muted">Hours</span>
                    <span>Mon–Fri, 9 AM – 5 PM</span>
                  </div>
                </div>
              </div>
            </section>
          </>
          
        )}
        
        
      </main>
    </div>

    
  );
}

