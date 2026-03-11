import { useMemo } from "react";

function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;
  const cells = [];

  for (let index = 0; index < startOffset; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

export default function CalendarPanel({ items, activity }) {
  const calendar = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    const monthLabel = now.toLocaleString("en-US", { month: "long", year: "numeric" });
    const cells = getMonthMatrix(year, month);
    const lowStockItems = items.filter((item) => Number(item.qty || 0) <= 5).slice(0, 4);
    const totalValue = items.reduce(
      (sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0),
      0
    );
    const recentActivity = activity.slice(0, 4);

    const events = [
      { day: 4, title: "Supplier follow-up", type: "accent" },
      { day: 9, title: "Stock audit", type: "info" },
      { day: 15, title: "Low stock review", type: "warning" },
      { day: 21, title: "Report export", type: "accent" },
      { day: 27, title: "Monthly close", type: "info" },
    ];

    return { today, monthLabel, cells, events, lowStockItems, totalValue, recentActivity };
  }, [items, activity]);

  return (
    <section className="calendar-tab">
      <section className="panel big neon calendar-hero">
        <div className="panel-title">Calendar Overview</div>
        <div className="panel-body calendar-hero__body">
          <div>
            <h2 className="h2 calendar-title">{calendar.monthLabel}</h2>
            <p className="muted calendar-subtitle">
              Track stock reviews, reporting dates, and upcoming inventory checkpoints.
            </p>
          </div>

          <div className="calendar-chip">This Month</div>
        </div>
      </section>

      <section className="calendar-grid">
        <div className="panel big neon calendar-panel">
          <div className="panel-title">Schedule</div>
          <div className="panel-body">
            <div className="calendar-weekdays">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="calendar-month">
              {calendar.cells.map((day, index) => {
                const event = calendar.events.find((entry) => entry.day === day);
                return (
                  <div
                    key={`${day ?? "empty"}-${index}`}
                    className={`calendar-day ${day === calendar.today ? "is-today" : ""} ${
                      event ? `has-${event.type}` : ""
                    } ${day ? "" : "is-empty"}`}
                  >
                    {day && (
                      <>
                        <div className="calendar-day__number">{day}</div>
                        {event && <div className="calendar-day__event">{event.title}</div>}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="calendar-side">
          <div className="panel neon">
            <div className="panel-title">Key Notes</div>
            <div className="panel-body calendar-notes">
              <div className="calendar-note">
                <span className="calendar-note__label">Inventory Value</span>
                <strong>₹{calendar.totalValue.toFixed(2)}</strong>
              </div>
              <div className="calendar-note">
                <span className="calendar-note__label">Low Stock Focus</span>
                <strong>{calendar.lowStockItems.length} items</strong>
              </div>
              <div className="calendar-note">
                <span className="calendar-note__label">Recent Actions</span>
                <strong>{calendar.recentActivity.length} logged</strong>
              </div>
            </div>
          </div>

          <div className="panel neon">
            <div className="panel-title">Restock Watch</div>
            <div className="panel-body calendar-watch">
              {calendar.lowStockItems.length === 0 ? (
                <div className="muted">No urgent restock items.</div>
              ) : (
                calendar.lowStockItems.map((item) => (
                  <div className="calendar-watch__row" key={item.id}>
                    <div>
                      <div className="calendar-watch__name">{item.name}</div>
                      <div className="muted mono">{item.id}</div>
                    </div>
                    <span className="pill">{item.qty} left</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="panel neon">
            <div className="panel-title">Recent Activity</div>
            <div className="panel-body calendar-activity">
              {calendar.recentActivity.length === 0 ? (
                <div className="muted">No activity yet.</div>
              ) : (
                calendar.recentActivity.map((entry) => (
                  <div className="calendar-activity__row" key={entry.id}>
                    <div className="calendar-activity__text">{entry.text}</div>
                    <div className="calendar-activity__time">{entry.time}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
