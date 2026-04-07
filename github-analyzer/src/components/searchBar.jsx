import { useState } from "react";
console.log("SearchBar loaded");
function SearchBar({onSearch}) {
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
      width: "250px",
      borderRadius: "6px",
      border: "none",
      outline: "none",
    }}
  />

  <button
    onClick={() => onSearch(username)}
    style={{
      padding: "12px 16px",
      borderRadius: "6px",
      border: "none",
      backgroundColor: "#238636", // GitHub green
      color: "white",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    Search
  </button>
</div>
  );
}

export default SearchBar;