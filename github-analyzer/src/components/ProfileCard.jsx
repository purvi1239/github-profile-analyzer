function ProfileCard({ user }) {
  if (!user) return null;

  return (
    <div style={{ marginTop: "20px", textAlign: "center", width: "100%" }}>
      {/* Made the avatar circular and slightly larger */}
      <img 
        src={user.avatar_url} 
        alt={`${user.login}'s avatar`} 
        width="120" 
        style={{ 
          borderRadius: "50%", 
          border: "3px solid #30363d",
          boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
        }} 
      />
      
      {/* Fixed the h2 syntax error and ensured it is white */}
      <h2 style={{ color: "#ffffff", fontSize: "28px", marginTop: "20px", marginBottom: "5px" }}>
        {user.name || user.login}
      </h2>

      {/* Show the username handle in grey if the user has a display name */}
      {user.name && (
        <h3 style={{ color: "#8b949e", fontSize: "20px", marginTop: "0", fontWeight: "normal" }}>
          {user.login}
        </h3>
      )}

      {/* Bio section */}
      <p style={{ color: "#c9d1d9", fontSize: "16px", marginTop: "15px", maxWidth: "400px", margin: "15px auto" }}>
        {user.bio || "No bio available"}
      </p>

      {/* Grouped followers and repos into a neat flex row */}
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        gap: "20px", 
        marginTop: "20px", 
        color: "#8b949e",
        fontSize: "14px"
      }}>
        <p>
          <strong style={{ color: "#ffffff" }}>{user.followers}</strong> followers
        </p>
        <p>
          <strong style={{ color: "#ffffff" }}>{user.public_repos}</strong> public repos
        </p>
      </div>
    </div>
  );
}

export default ProfileCard;