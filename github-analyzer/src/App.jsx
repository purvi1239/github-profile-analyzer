import { useState } from "react";
import SearchBar from "./components/searchBar";
import ProfileCard from "./components/ProfileCard";
import RepoList from "./components/RepoList";

function App() {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);

  const fetchGitHubUser = async (username) => {
    try {
      const userRes = await fetch(
        `https://api.github.com/users/${username}`
      );

      const repoRes = await fetch(
        `https://api.github.com/users/${username}/repos`
      );

      const userData = await userRes.json();
      const repoData = await repoRes.json();

      // ⭐ sort repos by stars
      repoData.sort((a, b) => b.stargazers_count - a.stargazers_count);

      setUser(userData);
      setRepos(repoData);

    } catch (error) {
      console.error("Error:", error);
    }
  };

  // 🧠 Analysis logic
  const getAnalysis = () => {
    if (!repos.length) return "";

    const totalStars = repos.reduce(
      (sum, repo) => sum + repo.stargazers_count,
      0
    );

    if (totalStars > 500) return "🔥 Advanced Developer";
    if (totalStars > 100) return "⚡ Intermediate Developer";
    return "🌱 Beginner Developer";
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0d1117 0%, #010409 100%)", // Upgraded to a subtle gradient
        color: "#c9d1d9", // GitHub's standard soft-white text
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "80px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", // Clean, system-native font
        boxSizing: "border-box"
      }}
    >
      {/* Title */}
      <h1
        style={{
          fontSize: "46px",
          marginBottom: "30px",
          color: "#ffffff", // Explicitly set to pure white
          fontWeight: "800",
          letterSpacing: "-0.5px",
          textShadow: "0px 4px 15px rgba(0,0,0,0.6)", // Adds depth to make it pop
          textAlign: "center"
        }}
      >
        GitHub Profile Analyzer
      </h1>

      {/* Search */}
      <SearchBar onSearch={fetchGitHubUser} />

      {/* Analysis Badge */}
      {repos.length > 0 && (
        <div style={{
          marginTop: "30px",
          padding: "10px 24px",
          backgroundColor: "rgba(46, 160, 67, 0.15)", // Translucent green
          border: "1px solid rgba(46, 160, 67, 0.4)",
          borderRadius: "30px", // Pill shape
          color: "#3fb950", // Bright green text
          fontWeight: "bold",
          fontSize: "18px",
          boxShadow: "0 0 20px rgba(46,160,67,0.15)" // Glowing effect
        }}>
          {getAnalysis()}
        </div>
      )}

      {/* Profile + Repo Section */}
      {user && (
        <div
          style={{
            background: "#161b22",
            padding: "35px",
            marginTop: "40px",
            marginBottom: "40px",
            borderRadius: "16px",
            border: "1px solid #30363d", // Classic GitHub subtle border
            width: "90%",
            maxWidth: "750px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)", // Gives a floating "card" effect
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#ffffff" // This cascades white text down to child components
          }}
        >
          <ProfileCard user={user} />
          
          {/* Added a divider to separate Profile and Repos neatly */}
          <div style={{ 
            width: "100%", 
            marginTop: "25px", 
            paddingTop: "25px", 
            borderTop: "1px solid #30363d" 
          }}>
            <RepoList repos={repos} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;