import { useState, useRef } from "react";

// Heatmap intensity colors
const LEVELS = [
  { min: 0, max: 0, color: "var(--heatmap-0)" },
  { min: 1, max: 2, color: "var(--heatmap-1)" },
  { min: 3, max: 5, color: "var(--heatmap-2)" },
  { min: 6, max: 9, color: "var(--heatmap-3)" },
  { min: 10, max: Infinity, color: "var(--heatmap-4)" },
];

function getColor(count) {
  for (const l of LEVELS) {
    if (count >= l.min && count <= l.max) return l.color;
  }
  return LEVELS[0].color;
}

function formatDate(d) {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS = 84; // 12 weeks
const CELL = 12;
const GAP = 2;

export default function ContributionHeatmap({ events }) {
  const [tooltip, setTooltip] = useState(null);
  const containerRef = useRef(null);

  // Build day map for last 84 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayMap = {};
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dayMap[key] = { date: new Date(d), count: 0 };
  }

  // Count events per day
  if (events && events.length > 0) {
    events.forEach((ev) => {
      const key = ev.created_at?.slice(0, 10);
      if (key && dayMap[key]) {
        dayMap[key].count++;
      }
    });
  }

  const days = Object.values(dayMap);
  const hasActivity = days.some((d) => d.count > 0);

  // Build grid (7 rows x 12 cols)
  // days[0] is oldest, days[83] is today
  // First column starts at the day of week of the oldest day
  const startDow = days[0].date.getDay(); // 0=Sun
  const totalCols = 12;

  // Build columns
  const columns = [];
  let idx = 0;
  for (let col = 0; col < totalCols; col++) {
    const cells = [];
    for (let row = 0; row < 7; row++) {
      if (col === 0 && row < startDow) {
        cells.push(null); // empty padding
      } else if (idx < days.length) {
        cells.push(days[idx]);
        idx++;
      } else {
        cells.push(null);
      }
    }
    columns.push(cells);
  }

  // Month labels
  const monthLabels = [];
  let lastMonth = -1;
  for (let col = 0; col < columns.length; col++) {
    for (let row = 0; row < 7; row++) {
      const cell = columns[col][row];
      if (cell) {
        const m = cell.date.getMonth();
        if (m !== lastMonth) {
          monthLabels.push({ label: MONTHS[m], col });
          lastMonth = m;
        }
      }
    }
  }

  const dayLabels = [
    { label: "Mon", row: 1 },
    { label: "Wed", row: 3 },
    { label: "Fri", row: 5 },
  ];

  const labelWidth = 32;
  const gridWidth = totalCols * (CELL + GAP);
  const gridHeight = 7 * (CELL + GAP);

  return (
    <div className="heatmap-container fade-in" ref={containerRef}>
      <h3 className="section-heading">🔥 Contribution Activity</h3>

      {!hasActivity && events && (
        <div className="empty-state" style={{ padding: "24px" }}>
          <div className="empty-state-text">No recent activity found</div>
        </div>
      )}

      {hasActivity && (
        <div className="heatmap-scroll">
          <div
            className="heatmap-grid-wrapper"
            style={{ width: labelWidth + gridWidth + 8 }}
          >
            {/* Month labels */}
            <div
              className="heatmap-months"
              style={{ paddingLeft: labelWidth }}
            >
              {monthLabels.map((m, i) => (
                <span
                  key={i}
                  className="heatmap-month-label"
                  style={{ left: labelWidth + m.col * (CELL + GAP) }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            <div className="heatmap-body">
              {/* Day labels */}
              <div
                className="heatmap-day-labels"
                style={{ width: labelWidth }}
              >
                {dayLabels.map((d) => (
                  <span
                    key={d.label}
                    className="heatmap-day-label"
                    style={{ top: d.row * (CELL + GAP) + 1 }}
                  >
                    {d.label}
                  </span>
                ))}
              </div>

              {/* Grid */}
              <div
                className="heatmap-grid"
                style={{ width: gridWidth, height: gridHeight }}
              >
                {columns.map((col, ci) =>
                  col.map((cell, ri) => {
                    if (!cell) {
                      return (
                        <div
                          key={`${ci}-${ri}`}
                          className="heatmap-cell empty"
                          style={{
                            left: ci * (CELL + GAP),
                            top: ri * (CELL + GAP),
                            width: CELL,
                            height: CELL,
                          }}
                        />
                      );
                    }
                    return (
                      <div
                        key={`${ci}-${ri}`}
                        className="heatmap-cell"
                        style={{
                          left: ci * (CELL + GAP),
                          top: ri * (CELL + GAP),
                          width: CELL,
                          height: CELL,
                          background: getColor(cell.count),
                        }}
                        onMouseEnter={(e) => {
                          const rect = e.target.getBoundingClientRect();
                          const containerRect = containerRef.current.getBoundingClientRect();
                          setTooltip({
                            text: `${cell.count} contribution${cell.count !== 1 ? "s" : ""} on ${formatDate(cell.date)}`,
                            x: rect.left - containerRect.left + CELL / 2,
                            y: rect.top - containerRect.top - 8,
                          });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="heatmap-legend">
            <span className="heatmap-legend-label">Less</span>
            {LEVELS.map((l, i) => (
              <div
                key={i}
                className="heatmap-legend-cell"
                style={{ background: l.color }}
              />
            ))}
            <span className="heatmap-legend-label">More</span>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div
          className="heatmap-tooltip"
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
