import { useMemo } from "react";

function currency(value) {
  return `₹${Number(value || 0).toFixed(2)}`;
}

export default function ReportsPanel({ items }) {
  const report = useMemo(() => {
    const totalUnits = items.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    const totalValue = items.reduce(
      (sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0),
      0
    );
    const lowStockItems = items
      .filter((item) => Number(item.qty || 0) <= 5)
      .sort((a, b) => Number(a.qty || 0) - Number(b.qty || 0));
    const categoryRows = Object.entries(
      items.reduce((acc, item) => {
        const key = item.category || "Uncategorized";
        if (!acc[key]) {
          acc[key] = { qty: 0, value: 0, count: 0 };
        }

        acc[key].qty += Number(item.qty || 0);
        acc[key].value += Number(item.qty || 0) * Number(item.price || 0);
        acc[key].count += 1;
        return acc;
      }, {})
    )
      .map(([name, value]) => ({ name, ...value }))
      .sort((a, b) => b.value - a.value);
    const topValueItems = [...items]
      .map((item) => ({
        ...item,
        stockValue: Number(item.qty || 0) * Number(item.price || 0),
      }))
      .sort((a, b) => b.stockValue - a.stockValue)
      .slice(0, 5);

    return {
      totalUnits,
      totalValue,
      lowStockItems,
      categoryRows,
      topValueItems,
      categoryCount: categoryRows.length,
    };
  }, [items]);

  return (
    <section className="reports-tab">
      <section className="panel big neon reports-hero">
        <div className="panel-title">Report Center</div>
        <div className="panel-body reports-hero__body">
          <div>
            <h2 className="h2 reports-title">Inventory Reports</h2>
            <p className="muted reports-subtitle">
              Category totals, stock value, and replenishment priorities from current inventory.
            </p>
          </div>

          <div className="reports-stamp">Live Summary</div>
        </div>
      </section>

      <section className="reports-metrics">
        <div className="stat-card">
          <div className="stat-value">{currency(report.totalValue)}</div>
          <div className="stat-label">Total stock value</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{report.totalUnits}</div>
          <div className="stat-label">Units currently available</div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-value">{report.lowStockItems.length}</div>
          <div className="stat-label">Items needing attention</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{report.categoryCount}</div>
          <div className="stat-label">Tracked categories</div>
        </div>
      </section>

      <section className="reports-grid">
        <div className="panel neon">
          <div className="panel-title">Category Breakdown</div>
          <div className="panel-body reports-list">
            {report.categoryRows.map((row) => (
              <div className="reports-row" key={row.name}>
                <div>
                  <div className="reports-row__title">{row.name}</div>
                  <div className="muted reports-row__meta">{row.count} items</div>
                </div>
                <div className="reports-row__stats">
                  <span>{row.qty} units</span>
                  <span className="pill">{currency(row.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel neon">
          <div className="panel-title">Top Value Items</div>
          <div className="panel-body reports-list">
            {report.topValueItems.map((item) => (
              <div className="reports-row reports-row--stacked" key={item.id}>
                <div>
                  <div className="reports-row__title">{item.name}</div>
                  <div className="muted reports-row__meta mono">{item.id}</div>
                </div>
                <div className="reports-row__stats">
                  <span>{item.qty} x {currency(item.price)}</span>
                  <span className="pill">{currency(item.stockValue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel big neon">
        <div className="panel-title">Restock Priority Report</div>
        <div className="panel-body">
          {report.lowStockItems.length === 0 ? (
            <div className="muted">No low stock items right now.</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Item ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Qty</th>
                    <th>Value at Risk</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {report.lowStockItems.map((item) => {
                    const qty = Number(item.qty || 0);
                    const priority = qty === 0 ? "Critical" : qty <= 2 ? "High" : "Watch";
                    return (
                      <tr key={item.id}>
                        <td className="mono">{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td>{qty}</td>
                        <td>{currency(qty * Number(item.price || 0))}</td>
                        <td>
                          <span
                            className={`status ${
                              priority === "Watch" ? "ok" : "low"
                            }`}
                          >
                            {priority}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
