import { useMemo } from "react";

function BarRow({ label, value, max }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="barrow">
      <div className="barrow-left">
        <div className="barrow-label">{label}</div>
        <div className="barrow-value">{value}</div>
      </div>
      <div className="barrow-track">
        <div className="barrow-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Donut({ parts }) {
  // parts: [{ label, value, className }]
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;

  let acc = 0;
  const stops = parts.map((p) => {
    const start = (acc / total) * 360;
    acc += p.value;
    const end = (acc / total) * 360;
    return { ...p, start, end };
  });

  // Use CSS variables for colors via className hooks
  // We build a conic gradient string from CSS vars
  const gradient = stops
    .map((s) => {
      const color = `var(--donut-${s.className})`;
      return `${color} ${s.start}deg ${s.end}deg`;
    })
    .join(", ");

  return (
    <div className="donut-wrap">
      <div className="donut" style={{ background: `conic-gradient(${gradient})` }}>
        <div className="donut-hole">
          <div className="donut-total">{total}</div>
          <div className="donut-sub">Items</div>
        </div>
      </div>

      <div className="donut-legend">
        {parts.map((p) => (
          <div className="legend-row" key={p.label}>
            <span className={`legend-dot ${p.className}`} />
            <span className="legend-label">{p.label}</span>
            <span className="legend-val">{p.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdvancedAnalytics({ items }) {
  const analytics = useMemo(() => {
    const byCategory = items.reduce((acc, it) => {
      const c = it.category || "Chocolate Bars";
      acc[c] = (acc[c] || 0) + Number(it.qty || 0);
      return acc;
    }, {});

    const lowThreshold = 5;
    const lowStockItems = items
      .filter((x) => Number(x.qty || 0) <= lowThreshold)
      .sort((a, b) => Number(a.qty || 0) - Number(b.qty || 0))
      .slice(0, 5);

    const valueSorted = [...items]
      .map((x) => ({
        ...x,
        value: Number(x.qty || 0) * Number(x.price || 0),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const inStock = items.filter((x) => Number(x.qty || 0) > lowThreshold).length;
    const lowStock = items.filter((x) => Number(x.qty || 0) > 0 && Number(x.qty || 0) <= lowThreshold).length;
    const outStock = items.filter((x) => Number(x.qty || 0) === 0).length;

    const catRows = Object.entries(byCategory)
      .map(([k, v]) => ({ k, v }))
      .sort((a, b) => b.v - a.v);

    const maxCat = catRows.reduce((m, r) => Math.max(m, r.v), 0);

    return { catRows, maxCat, lowStockItems, valueSorted, inStock, lowStock, outStock };
  }, [items]);

  return (
    <section className="panel big analytics neon gradient-border glass-streak">
      <div className="panel-title">Advanced Analytics</div>

      <div className="panel-body">
        <div className="analytics-grid">
          {/* Category Breakdown */}
          <div className="panel analytics-card neon gradient-border glass-streak">
            <div className="panel-title sm">Category Breakdown (by Qty)</div>
            <div className="panel-body">
              {analytics.catRows.length === 0 ? (
                <div className="muted">No data.</div>
              ) : (
                analytics.catRows.map((r) => (
                  <BarRow key={r.k} label={r.k} value={r.v} max={analytics.maxCat} />
                ))
              )}
            </div>
          </div>

          {/* Status Mix */}
          <div className="panel analytics-card neon gradient-border glass-streak">
            <div className="panel-title sm">Stock Status Mix</div>
            <div className="panel-body">
              <Donut
                parts={[
                  { label: "In Stock", value: analytics.inStock, className: "ok" },
                  { label: "Low", value: analytics.lowStock, className: "low" },
                  { label: "Out", value: analytics.outStock, className: "out" },
                ]}
              />
            </div>
          </div>

          {/* Watchlists */}
          <div className="panel analytics-card neon gradient-border glass-streak">
            <div className="panel-title sm">Watchlists</div>
            <div className="panel-body">
              <div className="watchlist">
                <div className="watch-title">Low Stock (≤ 5)</div>
                {analytics.lowStockItems.length === 0 ? (
                  <div className="muted">All good. No low stock items.</div>
                ) : (
                  analytics.lowStockItems.map((x) => (
                    <div className="watch-row" key={x.id}>
                      <span className="mono">{x.id}</span>
                      <span className="watch-name">{x.name}</span>
                      <span className="chip chip--magenta chip-inline">{x.qty}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="divider" />

              <div className="watchlist">
                <div className="watch-title">Top Value Items</div>
                {analytics.valueSorted.length === 0 ? (
                  <div className="muted">No items.</div>
                ) : (
                  analytics.valueSorted.map((x) => (
                    <div className="watch-row" key={x.id}>
                      <span className="mono">{x.id}</span>
                      <span className="watch-name">{x.name}</span>
                      <span className="chip chip--purple chip-inline">
                        ₹{Number(x.value || 0).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-note muted">
          *Analytics are based on current inventory (qty/price). We can add real trends when you store dates/history.
        </div>
      </div>
    </section>
  );
}