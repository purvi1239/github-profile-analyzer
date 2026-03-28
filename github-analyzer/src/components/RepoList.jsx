function RepoList({ repos }) {
  if (!repos || repos.length === 0) return null;

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Top Repositories</h3>

      <ul>
        {repos.slice(0, 5).map((repo) => (
          <li key={repo.id}>
            <strong>{repo.name}</strong> ⭐ {repo.stargazers_count}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RepoList;