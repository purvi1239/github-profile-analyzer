export default function ProfileCard({ user }) {
  if (!user) return null;

  return (
    <div className="profile-card fade-in">
      <img
        src={user.avatar_url}
        alt={`${user.login}'s avatar`}
        className="avatar"
      />
      <div className="profile-name">{user.name || user.login}</div>
      {user.name && <div className="profile-handle">@{user.login}</div>}
      <p className="profile-bio">{user.bio || "No bio available"}</p>
      <div className="profile-stats-row">
        <span className="profile-stat">
          <strong>{user.followers}</strong> followers
        </span>
        <span className="profile-stat">
          <strong>{user.following}</strong> following
        </span>
        <span className="profile-stat">
          <strong>{user.public_repos}</strong> repos
        </span>
      </div>
    </div>
  );
}