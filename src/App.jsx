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

<div style={headerStyle}>
  GitHub Profile Analyser
</div>

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

  return (
    <div style={{ color: "white", fontFamily: "monospace" }}>
      
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
          <h1 style={{color:"white", fontSize: "48px", letterSpacing: "2px" }}>
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
  onClick={() => signOut(auth)}
  style={{
    position: "absolute",
    top: "20px",
    right: "20px",
    padding: "10px",
    cursor: "pointer",
  }}
>
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

export default App;