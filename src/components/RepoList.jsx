const LANG_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572a5",
  Java: "#b07219", "C++": "#f34b7d", C: "#555555", Go: "#00add8",
  Rust: "#dea584", Ruby: "#701516", PHP: "#4f5d95", Swift: "#f05138",
  Kotlin: "#a97bff", Dart: "#00b4ab", HTML: "#e34c26", CSS: "#563d7c",
  Shell: "#89e051", Lua: "#000080", Jupyter: "#f37626",
};

export default function RepoList({ repos }) {
  if (!repos || repos.length === 0) return null;

  return (
    <div className="repo-list-container fade-in">
      <h3 className="section-heading">📂 Top Repositories</h3>
      <div className="repo-list">
        {repos.slice(0, 6).map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="repo-item"
          >
            <div className="repo-item-left">
              <span className="repo-name">{repo.name}</span>
              {repo.description && (
                <span className="repo-desc">{repo.description}</span>
              )}
            </div>
            <div className="repo-item-right">
              {repo.language && (
                <span className="repo-lang">
                  <span
                    className="repo-lang-dot"
                    style={{
                      background: LANG_COLORS[repo.language] || "#8b949e",
                    }}
                  />
                  {repo.language}
                </span>
              )}
              <span className="repo-stars">⭐ {repo.stargazers_count}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}