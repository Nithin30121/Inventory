import { useMemo } from "react";

function buildSeriesPath(values, width, height, padding) {
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const stepX = values.length > 1 ? innerWidth / (values.length - 1) : 0;
  const max = Math.max(...values, 100);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);

  return values
    .map((value, index) => {
      const x = padding + stepX * index;
      const y = height - padding - ((value - min) / range) * innerHeight;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function buildPoints(values, width, height, padding) {
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const stepX = values.length > 1 ? innerWidth / (values.length - 1) : 0;
  const max = Math.max(...values, 100);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);

  return values.map((value, index) => ({
    x: padding + stepX * index,
    y: height - padding - ((value - min) / range) * innerHeight,
    value,
  }));
}

export default function GraphPanel({ items }) {
  const chart = useMemo(() => {
    const labels = ["Jan 11", "Jan 12", "Jan 13", "Jan 14", "Jan 15", "Jan 16", "Jan 17"];
    const inventoryTotal = items.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    const inventoryValue = items.reduce(
      (sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0),
      0
    );
    const lowStock = items.filter((item) => Number(item.qty || 0) <= 5).length;

    const stockSeries = labels.map((_, index) => {
      const baseline = 58 + ((inventoryTotal + index * 7) % 28);
      return Math.min(96, baseline + (index % 3) * 4);
    });

    const demandSeries = labels.map((_, index) => {
      const baseline = 52 + ((Math.round(inventoryValue) + index * 11) % 34);
      return Math.min(94, baseline + (lowStock % 4) * 3 - (index % 2) * 5);
    });

    return {
      labels,
      stockSeries,
      demandSeries,
      stockAvg: Math.round(stockSeries.reduce((sum, value) => sum + value, 0) / stockSeries.length),
      demandPeak: Math.max(...demandSeries),
      lowStock,
    };
  }, [items]);

  const width = 880;
  const height = 360;
  const padding = 36;
  const stockPath = buildSeriesPath(chart.stockSeries, width, height, padding);
  const demandPath = buildSeriesPath(chart.demandSeries, width, height, padding);
  const stockPoints = buildPoints(chart.stockSeries, width, height, padding);
  const demandPoints = buildPoints(chart.demandSeries, width, height, padding);

  return (
    <section className="graph-tab">
      <section className="panel big neon graph-hero">
        <div className="panel-title">Graph Overview</div>
        <div className="panel-body graph-hero__body">
          <div>
            <h2 className="h2 graph-title">Inventory Performance Graph</h2>
            <p className="muted graph-subtitle">
              Trend view for stock strength and demand pressure across the current week.
            </p>
          </div>

          <div className="graph-badge">Weekly</div>
        </div>
      </section>

      <section className="graph-stats">
        <div className="stat-card">
          <div className="stat-value">{chart.stockAvg}%</div>
          <div className="stat-label">Average stock health</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{chart.demandPeak}%</div>
          <div className="stat-label">Demand peak this week</div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-value">{chart.lowStock}</div>
          <div className="stat-label">Items under low-stock threshold</div>
        </div>
      </section>

      <section className="panel big neon graph-panel">
        <div className="panel-title">Activity Statistics</div>
        <div className="panel-body">
          <div className="graph-panel__legend">
            <div className="graph-legend-item">
              <span className="graph-legend-swatch graph-legend-swatch--blue" />
              Stock strength
            </div>
            <div className="graph-legend-item">
              <span className="graph-legend-swatch graph-legend-swatch--pink" />
              Demand pressure
            </div>
          </div>

          <div className="graph-chart-wrap">
            <svg
              className="graph-chart"
              viewBox={`0 0 ${width} ${height}`}
              role="img"
              aria-label="Inventory graph"
            >
              {[0, 1, 2, 3].map((line) => {
                const y = padding + ((height - padding * 2) / 4) * line;
                return (
                  <line
                    key={`h-${line}`}
                    x1={padding}
                    y1={y}
                    x2={width - padding}
                    y2={y}
                    className="graph-grid-line"
                  />
                );
              })}

              {chart.labels.map((_, index) => {
                const x =
                  padding + ((width - padding * 2) / (chart.labels.length - 1 || 1)) * index;
                return (
                  <line
                    key={`v-${index}`}
                    x1={x}
                    y1={padding}
                    x2={x}
                    y2={height - padding}
                    className="graph-grid-line graph-grid-line--vertical"
                  />
                );
              })}

              <path d={stockPath} className="graph-line graph-line--blue" />
              <path d={demandPath} className="graph-line graph-line--pink" />

              {stockPoints.map((point, index) => (
                <circle
                  key={`stock-${chart.labels[index]}`}
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  className="graph-point graph-point--blue"
                />
              ))}

              {demandPoints.map((point, index) => (
                <circle
                  key={`demand-${chart.labels[index]}`}
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  className="graph-point graph-point--pink"
                />
              ))}
            </svg>

            <div className="graph-xaxis">
              {chart.labels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
