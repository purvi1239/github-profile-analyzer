import { useMemo, useState } from "react";
import { calculateRoleFitScores, getBestMatch } from "../utils/roleFitScoring";

export default function RoleFitAnalysis({ repos }) {
  const [hoveredRole, setHoveredRole] = useState(null);

  const roleScores = useMemo(() => calculateRoleFitScores(repos), [repos]);
  const bestMatch = useMemo(() => getBestMatch(roleScores), [roleScores]);

  if (!repos || repos.length === 0) return null;

  const getBarColor = (score) => {
    if (score >= 70) return "var(--green)";
    if (score >= 40) return "#e3b341";
    return "var(--red)";
  };

  const getBarClass = (score) => {
    if (score >= 70) return "role-bar-green";
    if (score >= 40) return "role-bar-yellow";
    return "role-bar-red";
  };

  return (
    <div className="role-fit-container fade-in">
      <div className="role-fit-header">
        <h3>🎯 Role Fit Analysis</h3>
        <p className="role-fit-subtitle">
          How well does this profile match different developer roles?
        </p>
      </div>

      <div className="role-fit-grid">
        {roleScores.map((role) => {
          const isBest = bestMatch && bestMatch.id === role.id && role.score > 0;
          const isHovered = hoveredRole === role.id;

          return (
            <div
              key={role.id}
              className={`role-fit-card ${isBest ? "role-fit-best" : ""} ${isHovered ? "role-fit-hovered" : ""}`}
              onMouseEnter={() => setHoveredRole(role.id)}
              onMouseLeave={() => setHoveredRole(null)}
              style={{ "--role-color": role.color }}
            >
              {isBest && (
                <div className="role-fit-badge">Best Match ✨</div>
              )}

              <div className="role-fit-icon">{role.icon}</div>
              <div className="role-fit-label">{role.label}</div>

              <div className="role-fit-score-ring">
                <svg viewBox="0 0 80 80" className="role-ring-svg">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke={getBarColor(role.score)}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${(role.score / 100) * 213.6} 213.6`}
                    transform="rotate(-90 40 40)"
                    className="role-ring-progress"
                    style={{ "--target-dash": `${(role.score / 100) * 213.6}` }}
                  />
                </svg>
                <span className="role-ring-text" style={{ color: getBarColor(role.score) }}>
                  {role.score}%
                </span>
              </div>

              <div className="role-fit-bar-container">
                <div
                  className={`role-fit-bar ${getBarClass(role.score)}`}
                  style={{ "--bar-width": `${role.score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
