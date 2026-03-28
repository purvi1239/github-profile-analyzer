function ProfileCard({ user }) {
  if (!user) return null;

  return (
    <div style={{ marginTop: "20px" }}>
      <img src={user.avatar_url} width="100" />

      <h2>{user.name || user.login}</h2>

      <p>{user.bio || "No bio available"}</p>

      <p>Followers: {user.followers}</p>

      <p>Public Repos: {user.public_repos}</p>
    </div>
  );
}

export default ProfileCard;