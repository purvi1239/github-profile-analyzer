import { useState } from "react";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import ProfileCard from "../components/ProfileCard";

const API = import.meta.env.VITE_API_URL;

export default function Compare() {
  const [user1Input, setUser1Input] = useState("");
  const [user2Input, setUser2Input] = useState("");
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [repos1, setRepos1] = useState([]);
  const [repos2, setRepos2] = useState([]);
  const [loading, setLoading] = useState(false);

  const getToken = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Not authenticated");
    return currentUser.getIdToken();
  };

  const handleCompare = async () => {
    if (!user1Input.trim() || !user2Input.trim()) {
      toast.error("Please enter both usernames");
      return;
    }
    setLoading(true);
    setData1(null);
    setData2(null);
    setRepos1([]);
    setRepos2([]);

    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [u1Res, u2Res, r1Res, r2Res] = await Promise.all([
        fetch(`${API}/github/user/${user1Input}`, { headers }),
        fetch(`${API}/github/user/${user2Input}`, { headers }),
        fetch(`${API}/github/user/${user1Input}/repos`, { headers }),
        fetch(`${API}/github/user/${user2Input}/repos`, { headers }),
      ]);

      if (!u1Res.ok) throw new Error(`User "${user1Input}" not found`);
      if (!u2Res.ok) throw new Error(`User "${user2Input}" not found`);

      const [u1, u2, r1, r2] = await Promise.all([
        u1Res.json(), u2Res.json(), r1Res.json(), r2Res.json(),
      ]);

      setData1(u1);
      setData2(u2);
      setRepos1(r1);
      setRepos2(r2);
      toast.success("Comparison loaded!");
    } catch (err) {
      toast.error(err.message || "Comparison failed");
    } finally {
      setLoading(false);
    }
  };

  const totalStars = (repos) =>
    (repos || []).reduce((s, r) => s + (r.stargazers_count || 0), 0);

  const trophy = (a, b) => {
    if (a > b) return ["🏆", ""];
    if (b > a) return ["", "🏆"];
    return ["🤝", "🤝"];
  };

  const categories = data1 && data2
    ? [
        { label: "Public Repos", v1: data1.public_repos, v2: data2.public_repos },
        { label: "Followers", v1: data1.followers, v2: data2.followers },
        { label: "Following", v1: data1.following, v2: data2.following },
        { label: "Total Stars", v1: totalStars(repos1), v2: totalStars(repos2) },
      ]
    : [];

  return (
    <div className="page-container">
      <h1 className="page-title">⚔️ Compare Profiles</h1>
      <p className="page-subtitle">Put two GitHub users head to head</p>

      {/* Inputs */}
      <div className="compare-inputs">
        <input
          type="text"
          className="search-input"
          placeholder="Username 1"
          value={user1Input}
          onChange={(e) => setUser1Input(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCompare()}
          style={{ width: "220px" }}
        />
        <span className="compare-vs">⚔️ VS</span>
        <input
          type="text"
          className="search-input"
          placeholder="Username 2"
          value={user2Input}
          onChange={(e) => setUser2Input(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCompare()}
          style={{ width: "220px" }}
        />
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          className="compare-btn"
          onClick={handleCompare}
          disabled={loading}
        >
          {loading ? "Loading..." : "Compare ⚔️"}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="spinner-container">
          <div className="spinner" />
        </div>
      )}

      {/* Profiles side by side */}
      {data1 && data2 && !loading && (
        <div className="fade-in" style={{ marginTop: "32px" }}>
          <div className="compare-profiles">
            <ProfileCard user={data1} />
            <ProfileCard user={data2} />
          </div>

          {/* Head to Head */}
          <div className="h2h-container">
            <h3>🏆 Head to Head</h3>
            <table className="h2h-table">
              <thead>
                <tr>
                  <th>{data1.login}</th>
                  <th>Category</th>
                  <th>{data2.login}</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => {
                  const [t1, t2] = trophy(cat.v1, cat.v2);
                  return (
                    <tr key={cat.label}>
                      <td className={t1 === "🏆" ? "h2h-winner" : ""}>
                        {cat.v1} {t1 && <span className="h2h-trophy">{t1}</span>}
                      </td>
                      <td className="h2h-category">{cat.label}</td>
                      <td className={t2 === "🏆" ? "h2h-winner" : ""}>
                        {t2 && <span className="h2h-trophy">{t2}</span>} {cat.v2}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
