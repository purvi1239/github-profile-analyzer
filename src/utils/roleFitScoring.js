/**
 * Role Fit Scoring Engine
 * Calculates how well a GitHub user's profile matches various developer roles
 * based on their repository languages and project names.
 */

const ROLE_DEFINITIONS = [
  {
    id: "frontend",
    label: "Frontend Dev",
    icon: "🎨",
    color: "#58a6ff",
    gradient: "linear-gradient(135deg, #58a6ff, #79c0ff)",
  },
  {
    id: "backend",
    label: "Backend Dev",
    icon: "⚙️",
    color: "#a371f7",
    gradient: "linear-gradient(135deg, #a371f7, #d2a8ff)",
  },
  {
    id: "fullstack",
    label: "Full Stack",
    icon: "🔄",
    color: "#3fb950",
    gradient: "linear-gradient(135deg, #3fb950, #7ee787)",
  },
  {
    id: "datascience",
    label: "Data Scientist",
    icon: "📊",
    color: "#f0883e",
    gradient: "linear-gradient(135deg, #f0883e, #ffa657)",
  },
  {
    id: "devops",
    label: "DevOps",
    icon: "🚀",
    color: "#f85149",
    gradient: "linear-gradient(135deg, #f85149, #ff7b72)",
  },
];

/**
 * Extract a set of languages present across all repos.
 * Returns { languageSet: Set<string>, repoNames: string[] }
 */
function extractRepoInfo(repos) {
  const languageSet = new Set();
  const repoNames = [];

  (repos || []).forEach((repo) => {
    if (repo.language) {
      languageSet.add(repo.language.toLowerCase());
    }
    if (repo.name) {
      repoNames.push(repo.name.toLowerCase());
    }
  });

  return { languageSet, repoNames };
}

function calcFrontend(languageSet, repoNames) {
  let score = 0;
  if (languageSet.has("javascript")) score += 25;
  if (languageSet.has("typescript")) score += 25;
  if (languageSet.has("html")) score += 15;
  if (languageSet.has("css")) score += 15;
  // React repos
  const reactRepos = repoNames.filter((n) => n.includes("react"));
  if (reactRepos.length > 0) score += 10;
  // Vue / Angular / Svelte bonus
  const uiFrameworks = repoNames.filter(
    (n) => n.includes("vue") || n.includes("angular") || n.includes("svelte")
  );
  if (uiFrameworks.length > 0) score += 10;
  return Math.min(score, 100);
}

function calcBackend(languageSet, repoNames) {
  let score = 0;
  const backendLangs = ["python", "java", "go", "rust", "php"];
  backendLangs.forEach((lang) => {
    if (languageSet.has(lang)) score += 20;
  });
  // Node/Express repos
  const nodeRepos = repoNames.filter(
    (n) => n.includes("node") || n.includes("express") || n.includes("api")
  );
  if (nodeRepos.length > 0) score += 15;
  // Database repos
  const dbRepos = repoNames.filter(
    (n) =>
      n.includes("database") ||
      n.includes("db") ||
      n.includes("mongo") ||
      n.includes("sql") ||
      n.includes("redis")
  );
  if (dbRepos.length > 0) score += 10;
  return Math.min(score, 100);
}

function calcDataScience(languageSet, repoNames) {
  let score = 0;
  if (languageSet.has("python")) score += 30;
  if (languageSet.has("jupyter notebook")) score += 25;
  if (languageSet.has("r")) score += 20;
  // ML / AI repos
  const mlRepos = repoNames.filter(
    (n) =>
      n.includes("ml") ||
      n.includes("ai") ||
      n.includes("machine") ||
      n.includes("deep") ||
      n.includes("neural") ||
      n.includes("data")
  );
  if (mlRepos.length > 0) score += 25;
  return Math.min(score, 100);
}

function calcDevOps(languageSet, repoNames) {
  let score = 0;
  if (languageSet.has("shell")) score += 25;
  if (languageSet.has("dockerfile")) score += 25;
  // DevOps-related repos
  const devopsRepos = repoNames.filter(
    (n) =>
      n.includes("docker") ||
      n.includes("k8s") ||
      n.includes("kubernetes") ||
      n.includes("deploy") ||
      n.includes("ci") ||
      n.includes("terraform") ||
      n.includes("ansible")
  );
  if (devopsRepos.length > 0) score += 20;
  // HCL, YAML awareness (via language)
  if (languageSet.has("hcl")) score += 15;
  if (languageSet.has("makefile")) score += 15;
  return Math.min(score, 100);
}

/**
 * Calculate all role fit scores for a given set of repos.
 * Returns an array of { ...roleDefinition, score: number }
 */
export function calculateRoleFitScores(repos) {
  const { languageSet, repoNames } = extractRepoInfo(repos);

  const frontendScore = calcFrontend(languageSet, repoNames);
  const backendScore = calcBackend(languageSet, repoNames);
  const fullstackScore = Math.round((frontendScore + backendScore) / 2);
  const dataScienceScore = calcDataScience(languageSet, repoNames);
  const devopsScore = calcDevOps(languageSet, repoNames);

  const scores = [
    frontendScore,
    backendScore,
    fullstackScore,
    dataScienceScore,
    devopsScore,
  ];

  return ROLE_DEFINITIONS.map((role, i) => ({
    ...role,
    score: scores[i],
  }));
}

/**
 * Determine which role has the highest score.
 */
export function getBestMatch(roleScores) {
  if (!roleScores || roleScores.length === 0) return null;
  return roleScores.reduce((best, current) =>
    current.score > best.score ? current : best
  );
}

export { ROLE_DEFINITIONS };
