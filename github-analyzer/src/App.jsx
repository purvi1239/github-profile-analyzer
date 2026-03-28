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

      repoData.sort((a, b) => b.stargazers_count - a.stargazers_count);

      setUser(userData);
      setRepos(repoData);

    } catch (error) {
      console.error("Error:", error);
    }
  };



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
  <div style={{ 
    textAlign: "center",
    fontFamily: "Arial",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh"
  }}>
    <h1>GitHub Profile Analyzer</h1>

    <SearchBar onSearch={fetchGitHubUser} />

    {/* 👇 ADD ANALYSIS HERE */}
    {user && <h2>{getAnalysis()}</h2>}

    <div style={{
      background: "white",
      padding: "20px",
      marginTop: "20px",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)"
    }}>
      <ProfileCard user={user} />
      <RepoList repos={repos} />
    </div>
  </div>
);
}
export default App;