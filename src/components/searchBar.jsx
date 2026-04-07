import { useState } from "react";

function SearchBar({ onSearch }) {
  const [username, setUsername] = useState("");

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          padding: "12px",
          width: "320px",
          background: "#0d1117",
          border: "1px solid #30363d",
          color: "white",
          borderRadius: "6px",
          outline: "none",
        }}
      />

      <button
        onClick={() => onSearch(username)}
        style={{
          padding: "12px 20px",
          backgroundColor: "#3fb950",
          border: "none",
          borderRadius: "6px",
          color: "black",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        ANALYZE
      </button>
    </div>
  );
}

export default SearchBar;