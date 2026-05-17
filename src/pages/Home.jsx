import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import ProfileCard from "../components/ProfileCard";
import StatCard from "../components/StatCard";
import LanguageChart from "../components/LanguageChart";
import ContributionHeatmap from "../components/ContributionHeatmap";
import RepoList from "../components/RepoList";

const API = import.meta.env.VITE_API_URL;

export default function Home() {
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalStars, setTotalStars] = useState(0);

  // If navigated from History with ?search=username
  useEffect(() => {
    const q = searchParams.get("search");
    if (q) {
      setUsername(q);
      fetchProfile(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const getToken = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Not authenticated");
    return currentUser.getIdToken();
  };

  const fetchProfile = async (name) => {
    const target = name || username;
    if (!target.trim()) {
      toast.error("Please enter a GitHub username");
      return;
    }
    setLoading(true);
    setUser(null);
    setRepos([]);
    setEvents([]);
    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [userRes, repoRes, eventsRes] = await Promise.all([
        fetch(`${API}/github/user/${target}`, { headers }),
        fetch(`${API}/github/user/${target}/repos`, { headers }),
        fetch(`${API}/github/user/${target}/events`, { headers }),
      ]);

      if (!userRes.ok) throw new Error("User not found");

      const userData = await userRes.json();
      const repoData = await repoRes.json();
      const eventsData = eventsRes.ok ? await eventsRes.json() : [];

      setUser(userData);
      setRepos(repoData);
      setEvents(eventsData);
      setTotalStars(
        repoData.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
      );
      toast.success(`Loaded ${userData.login}'s profile`);
    } catch (err) {
      toast.error(err.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") fetchProfile();
  };

  return (
    <div className="page-container">
      <h1 className="page-title">🔍 GitHub Profile Analyser</h1>
      <p className="page-subtitle">Enter a username to explore their GitHub presence</p>

      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          className="search-input"
          placeholder="Enter GitHub username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="search-btn" onClick={() => fetchProfile()}>
          🔎 ANALYZE
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="spinner-container">
          <div className="spinner" />
        </div>
      )}

      {/* Results */}
      {user && !loading && (
        <div className="fade-in">
          <ProfileCard user={user} />

          <div className="stats-grid">
            <StatCard icon="📦" value={user.public_repos} label="Repositories" />
            <StatCard icon="👥" value={user.followers} label="Followers" />
            <StatCard icon="⭐" value={totalStars} label="Total Stars" />
          </div>

          <ContributionHeatmap events={events} />

          <LanguageChart repos={repos} />

          <RepoList repos={repos} />
        </div>
      )}
    </div>
  );
}
