import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import ProfileCard from "../components/ProfileCard";
import StatCard from "../components/StatCard";
import LanguageChart from "../components/LanguageChart";
import ContributionHeatmap from "../components/ContributionHeatmap";
import RepoList from "../components/RepoList";
import RoleFitAnalysis from "../components/RoleFitAnalysis";

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
      {/* 1. INITIAL EMPTY STATE — GORGEOUS HERO SEARCH CARD */}
      {!user && !loading && (
        <div className="glow-background-wrapper">
          <div className="glow-orb glow-orb-1" />
          <div className="glow-orb glow-orb-2" />

          <div className="glass-hero-card">
            <div className="hero-logo-wrapper">
              <svg height="44" width="44" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </div>
            <h1 className="hero-gradient-title">GitHub Profile Intelligence</h1>
            <p className="hero-subtitle">
              Unveil detailed repository metrics, contribution graphs, language distributions, and AI-powered developer role fits in seconds.
            </p>

            {/* Premium Search Box */}
            <div className="premium-search-box">
              <span className="premium-search-icon">🔍</span>
              <input
                type="text"
                className="premium-search-input"
                placeholder="Enter GitHub username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <span className="shortcut-badge">Enter ↵</span>
              <button className="premium-search-btn" onClick={() => fetchProfile()}>
                ANALYZE
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="suggestions-container">
              <span className="suggestions-label">Try popular accounts</span>
              <div className="suggestions-pills">
                {[
                  { name: "torvalds", icon: "🐧", label: "Linux" },
                  { name: "gaearon", icon: "⚛️", label: "React" },
                  { name: "yyx990803", icon: "⚡", label: "Vue" },
                  { name: "tj", icon: "🚀", label: "Apex" },
                ].map((s) => (
                  <button
                    key={s.name}
                    className="suggested-pill"
                    onClick={() => {
                      setUsername(s.name);
                      fetchProfile(s.name);
                    }}
                  >
                    <span>{s.icon}</span>
                    <strong>{s.name}</strong>
                    <small style={{ opacity: 0.7 }}>({s.label})</small>
                  </button>
                ))}
              </div>
            </div>

            {/* Capability cards */}
            <div className="capabilities-grid">
              <div className="capability-card">
                <div className="capability-icon-box">📊</div>
                <div className="capability-content">
                  <h4>Language Analytics</h4>
                  <p>Comprehensive language breakdown and repository overlap metrics.</p>
                </div>
              </div>
              <div className="capability-card">
                <div className="capability-icon-box">🎯</div>
                <div className="capability-content">
                  <h4>AI Role-Fit Scoring</h4>
                  <p>Discover developer alignments for Frontend, Backend, or Full Stack roles.</p>
                </div>
              </div>
              <div className="capability-card">
                <div className="capability-icon-box">🔥</div>
                <div className="capability-content">
                  <h4>Activity Mapping</h4>
                  <p>In-depth inspection of commit timelines and active patterns.</p>
                </div>
              </div>
              <div className="capability-card">
                <div className="capability-icon-box">⭐</div>
                <div className="capability-content">
                  <h4>Star &amp; Repos Audit</h4>
                  <p>Summarize public libraries and engagement profiles instantly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. LOADING STATE */}
      {loading && (
        <div className="spinner-container" style={{ minHeight: "50vh", display: "flex", flexDirection: "column", gap: "24px", alignItems: "center", justifyContent: "center" }}>
          <div className="spinner" />
          <p className="page-subtitle" style={{ animation: "pulse 1.5s infinite", margin: 0 }}>
            Analyzing {username || "profile"}...
          </p>
        </div>
      )}

      {/* 3. ACTIVE STATE — GORGEOUS RESULTS VIEW */}
      {user && !loading && (
        <div className="fade-in">
          {/* Elegant Top Header Search for subsequent lookups */}
          <div className="results-header-container">
            <div className="results-header-left">
              <svg height="28" width="28" viewBox="0 0 16 16" fill="currentColor" style={{ color: "var(--accent)" }}>
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              <h2 className="results-header-title">Developer Intelligence</h2>
            </div>
            
            <div className="premium-search-box results-header-search">
              <span className="premium-search-icon">🔍</span>
              <input
                type="text"
                className="premium-search-input"
                placeholder="Analyze another profile..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="premium-search-btn" onClick={() => fetchProfile()}>
                ANALYZE
              </button>
            </div>
          </div>

          <ProfileCard user={user} />

          <div className="stats-grid">
            <StatCard icon="📦" value={user.public_repos} label="Repositories" />
            <StatCard icon="👥" value={user.followers} label="Followers" />
            <StatCard icon="⭐" value={totalStars} label="Total Stars" />
          </div>

          <ContributionHeatmap events={events} />

          <LanguageChart repos={repos} />

          <RoleFitAnalysis repos={repos} />

          <RepoList repos={repos} />
        </div>
      )}
    </div>
  );
}
