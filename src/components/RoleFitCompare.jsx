import { useMemo, useState } from "react";
import { calculateRoleFitScores, ROLE_DEFINITIONS } from "../utils/roleFitScoring";

export default function RoleFitCompare({ repos1, repos2, user1, user2 }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const scores1 = useMemo(() => calculateRoleFitScores(repos1), [repos1]);
  const scores2 = useMemo(() => calculateRoleFitScores(repos2), [repos2]);

  if (!repos1?.length && !repos2?.length) return null;

  const getBarColor = (score) => {
    if (score >= 70) return "var(--green)";
    if (score >= 40) return "#e3b341";
    return "var(--red)";
  };

  const name1 = user1?.login || "User 1";
  const name2 = user2?.login || "User 2";

  // Find who's better for each role
  const getWinner = (roleId) => {
    const s1 = scores1.find((r) => r.id === roleId)?.score || 0;
    const s2 = scores2.find((r) => r.id === roleId)?.score || 0;
    if (s1 > s2) return "user1";
    if (s2 > s1) return "user2";
    return "tie";
  };

  const selectedRoleData = selectedRole
    ? ROLE_DEFINITIONS.find((r) => r.id === selectedRole)
    : null;

  const selectedScore1 = selectedRole
    ? scores1.find((r) => r.id === selectedRole)?.score || 0
    : 0;
  const selectedScore2 = selectedRole
    ? scores2.find((r) => r.id === selectedRole)?.score || 0
    : 0;

  return (
    <div className="role-compare-container fade-in">
      <div className="role-fit-header">
        <h3>🎯 Role Fit Comparison</h3>
        <p className="role-fit-subtitle">
          Click a role to see who fits better
        </p>
      </div>

      {/* Role selector pills */}
      <div className="role-compare-pills">
        {ROLE_DEFINITIONS.map((role) => {
          const winner = getWinner(role.id);
          return (
            <button
              key={role.id}
              className={`role-compare-pill ${selectedRole === role.id ? "active" : ""}`}
              onClick={() =>
                setSelectedRole(selectedRole === role.id ? null : role.id)
              }
              style={{ "--role-color": role.color }}
            >
              <span className="role-pill-icon">{role.icon}</span>
              <span className="role-pill-label">{role.label}</span>
              {winner !== "tie" && (
                <span className="role-pill-winner">
                  {winner === "user1" ? "👈" : "👉"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Detail comparison card when a role is selected */}
      {selectedRoleData && (
        <div className="role-compare-detail fade-in">
          <div className="role-compare-detail-header">
            <span className="role-compare-detail-icon">
              {selectedRoleData.icon}
            </span>
            <span>
              For a <strong>{selectedRoleData.label}</strong> role:
            </span>
          </div>

          <div className="role-compare-matchup">
            {/* User 1 */}
            <div
              className={`role-compare-user ${selectedScore1 >= selectedScore2 && selectedScore1 > 0 ? "role-compare-leading" : ""}`}
            >
              <img
                src={user1?.avatar_url}
                alt={name1}
                className="role-compare-avatar"
              />
              <div className="role-compare-user-name">{name1}</div>
              <div
                className="role-compare-user-score"
                style={{ color: getBarColor(selectedScore1) }}
              >
                {selectedScore1}%
              </div>
              <div className="role-compare-user-bar-wrap">
                <div
                  className="role-compare-user-bar"
                  style={{
                    "--bar-width": `${selectedScore1}%`,
                    background: getBarColor(selectedScore1),
                  }}
                />
              </div>
              {selectedScore1 > selectedScore2 && selectedScore1 > 0 && (
                <div className="role-compare-crown">👑 Better Fit</div>
              )}
            </div>

            {/* VS */}
            <div className="role-compare-vs">VS</div>

            {/* User 2 */}
            <div
              className={`role-compare-user ${selectedScore2 > selectedScore1 ? "role-compare-leading" : ""}`}
            >
              <img
                src={user2?.avatar_url}
                alt={name2}
                className="role-compare-avatar"
              />
              <div className="role-compare-user-name">{name2}</div>
              <div
                className="role-compare-user-score"
                style={{ color: getBarColor(selectedScore2) }}
              >
                {selectedScore2}%
              </div>
              <div className="role-compare-user-bar-wrap">
                <div
                  className="role-compare-user-bar"
                  style={{
                    "--bar-width": `${selectedScore2}%`,
                    background: getBarColor(selectedScore2),
                  }}
                />
              </div>
              {selectedScore2 > selectedScore1 && (
                <div className="role-compare-crown">👑 Better Fit</div>
              )}
            </div>
          </div>

          {selectedScore1 === selectedScore2 && (
            <div className="role-compare-tie">🤝 It's a tie!</div>
          )}
        </div>
      )}

      {/* Side-by-side overview table */}
      <div className="role-compare-table-wrap">
        <table className="role-compare-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>{name1}</th>
              <th>{name2}</th>
              <th>Better Fit</th>
            </tr>
          </thead>
          <tbody>
            {ROLE_DEFINITIONS.map((role) => {
              const s1 = scores1.find((r) => r.id === role.id)?.score || 0;
              const s2 = scores2.find((r) => r.id === role.id)?.score || 0;
              const winner = getWinner(role.id);

              return (
                <tr
                  key={role.id}
                  className={`role-compare-row ${selectedRole === role.id ? "role-compare-row-active" : ""}`}
                  onClick={() =>
                    setSelectedRole(selectedRole === role.id ? null : role.id)
                  }
                >
                  <td className="role-compare-cell-role">
                    {role.icon} {role.label}
                  </td>
                  <td
                    className={
                      winner === "user1" ? "role-compare-cell-winner" : ""
                    }
                  >
                    <span style={{ color: getBarColor(s1) }}>{s1}%</span>
                    {winner === "user1" && " 🏆"}
                  </td>
                  <td
                    className={
                      winner === "user2" ? "role-compare-cell-winner" : ""
                    }
                  >
                    <span style={{ color: getBarColor(s2) }}>{s2}%</span>
                    {winner === "user2" && " 🏆"}
                  </td>
                  <td className="role-compare-cell-fit">
                    {winner === "tie"
                      ? "🤝 Tie"
                      : winner === "user1"
                        ? name1
                        : name2}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
