import { useState } from "react";
console.log("SearchBar loaded");
function SearchBar({onSearch}) {
  const [username, setUsername] = useState("");

  return (
    <div style={{ marginTop: "20px" }}>
  <input
    type="text"
    placeholder="Enter GitHub username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    style={{
      padding: "10px",
      width: "250px",
      borderRadius: "5px",
      border: "1px solid #ccc"
    }}
  />

  <button
    onClick={() => onSearch(username)}
    style={{
      padding: "10px 15px",
      marginLeft: "10px",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#333",
      color: "white",
      cursor: "pointer"
    }}
  >
    Search
  </button>
</div>
  );
}

export default SearchBar;