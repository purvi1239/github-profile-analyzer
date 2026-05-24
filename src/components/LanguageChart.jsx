import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = [
  "#58a6ff", "#3fb950", "#f0883e", "#a371f7",
  "#f85149", "#e3b341", "#79c0ff", "#56d364",
  "#d2a8ff", "#ff7b72", "#ffa657", "#7ee787",
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, percentage } = payload[0].payload;
    return (
      <div style={{
        background: "#161b22",
        border: "1px solid #30363d",
        borderRadius: "8px",
        padding: "10px 14px",
        color: "#e6edf3",
        fontFamily: "var(--font)",
        fontSize: "13px",
      }}>
        <strong>{name}</strong>: {percentage}%
      </div>
    );
  }
  return null;
};

export default function LanguageChart({ repos }) {
  if (!repos || repos.length === 0) return null;

  // Count language occurrences
  const langCounts = {};
  repos.forEach((repo) => {
    if (repo.language) {
      langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
    }
  });

  const total = Object.values(langCounts).reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  // Sort by count descending, take top 8
  const data = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({
      name,
      value,
      percentage: ((value / total) * 100).toFixed(1),
    }));

  return (
    <div className="language-chart-container fade-in">
      <h3>💻 Languages Used</h3>
      <div className="language-chart-wrapper">
        <ResponsiveContainer width={220} height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="language-legend">
          {data.map((entry, i) => (
            <div key={entry.name} className="language-legend-item">
              <span
                className="language-legend-dot"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span>{entry.name}</span>
              <span className="language-legend-pct">
                {((entry.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
