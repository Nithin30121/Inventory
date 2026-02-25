export default function ItemsTable({ items, onDelete, compact, onAddToCart }) {
  return (
    <div className={`table-wrap ${compact ? "compact" : ""}`}>
      <table className="table">
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Status</th>
            <th className="right">Action</th>
          </tr>
        </thead>

        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="7" className="empty">
                No items found.
              </td>
            </tr>
          ) : (
            items.map((it) => (
              <tr key={it.id}>
                <td className="mono">{it.id}</td>
                <td>{it.name}</td>
                <td>{it.category}</td>
                <td>{it.qty}</td>
                <td>₹{Number(it.price).toFixed(2)}</td>
                <td>
                  <span className={`status ${String(it.status).toLowerCase().includes("low") ? "low" : "ok"}`}>
                    {it.status}
                  </span>
                </td>
                <td className="right">
                  <button className="link danger" onClick={() => onDelete?.(it.id)} type="button">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}