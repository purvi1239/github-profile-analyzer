import { useState } from "react";
import SearchBar from "./components/SearchBar";
import ProfileCard from "./components/ProfileCard";
import RepoList from "./components/RepoList";
import { useEffect } from "react";
import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "firebase/auth";

import Login from "./Login";
import Signup from "./Signup";

function App() {

  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [searched, setSearched] = useState(false);

  //login state
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });

    return () => unsubscribe();
  }, []);

  const fetchGitHubUser = async (username) => {
    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      const repoRes = await fetch(`https://api.github.com/users/${username}/repos`);

      const userData = await userRes.json();
      const repoData = await repoRes.json();

      repoData.sort((a, b) => b.stargazers_count - a.stargazers_count);

      setUser(userData);
      setRepos(repoData);
      setSearched(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);


  if (!firebaseUser) {
    return isLogin ? (
      <Login switchToSignup={() => setIsLogin(false)} />
    ) : (
      <Signup switchToLogin={() => setIsLogin(true)} />
    );
  }

  return (
    <div style={{ color: "white", fontFamily: "monospace", paddingTop: "60px" }}>
      <div style={headerStyle}>
        <svg
          height="28"
          viewBox="0 0 16 16"
          width="28"
          fill="currentColor"
          style={{ marginRight: "12px" }}
        >
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
        GitHub Profile Analyser
      </div>


      {/* 🟢 LANDING SCREEN */}
      {!searched && (

        <div
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "#0d1117",
          }}
        >
          <img
            src="/github-mark.svg"
            alt="GitHub Logo"
            style={{
              width: "80px",
              height: "80px",
              marginBottom: "20px",
              filter: "invert(1)"
            }}
          />

          <h1 style={{ color: "white", fontSize: "48px", letterSpacing: "2px" }}>
            GitHub Profile Monitor
          </h1>

          <p style={{ color: "#8b949e", marginBottom: "20px" }}>
            Analyze activity patterns, contributions, and coding habits
          </p>

          <SearchBar onSearch={fetchGitHubUser} />
        </div>
      )}

      {/* 🔵 DASHBOARD */}
      {searched && user && (
        <div style={{ padding: "40px", background: "#0d1117", minHeight: "100vh" }}>



          <button
            className="logout-btn"
            onClick={() => signOut(auth)}
          >
            <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>


          {/* Top search */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <SearchBar onSearch={fetchGitHubUser} />
          </div>

          {/* Profile */}
          <div style={cardStyle}>
            <ProfileCard user={user} />
          </div>

          {/* Stats */}
          <div style={statsContainer}>
            <StatCard title="REPOSITORIES" value={user.public_repos} />
            <StatCard title="FOLLOWERS" value={user.followers} />
            <StatCard title="TOTAL STARS" value={totalStars} />
          </div>

          {/* Repos */}
          <div style={cardStyle}>
            <RepoList repos={repos.slice(0, 5)} />
          </div>
        </div>
      )}
    </div>
  );
}

/* 🎨 Styles */
const cardStyle = {
  background: "#161b22",
  padding: "20px",
  borderRadius: "10px",
  marginTop: "20px",
  border: "1px solid #30363d",
};

const statsContainer = {
  display: "flex",
  gap: "20px",
  marginTop: "20px",
  flexWrap: "wrap",
};

function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "#161b22",
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid #30363d",
        minWidth: "180px",
      }}
    >
      <p style={{ color: "#8b949e", fontSize: "12px" }}>{title}</p>
      <h2 style={{ color: "#3fb950" }}>{value}</h2>
    </div>
  );
}

const headerStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  textAlign: "center",
  padding: "15px",
  fontSize: "22px",
  fontWeight: "600",
  background: "#0d1117",
  color: "#58a6ff",
  borderBottom: "1px solid #30363d",
  zIndex: 1000,
  letterSpacing: "1px",
};

export default App;