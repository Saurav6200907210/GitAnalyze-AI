import type {
  AuditResult,
  CareerRole,
  CompanyFit,
  GhRepo,
  GhUser,
  RepoAnalysis,
  RoadmapWeek,
} from "./types";

const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;

const HEALTH_WEIGHTS = {
  readme: 15,
  license: 10,
  topics: 10,
  description: 5,
  releases: 10,
  deployment: 15,
  ci: 15,
  contributors: 10,
  issueTemplates: 5,
  recent: 5,
} as const;

export function analyzeRepo(
  repo: GhRepo,
  extras: {
    hasReadme: boolean;
    releasesCount: number;
    contributorsCount: number;
    workflowFiles: string[];
    hasIssueTemplates: boolean;
  },
): RepoAnalysis {
  const recentlyActive = Date.now() - new Date(repo.pushed_at).getTime() < NINETY_DAYS;
  const hasReleases = extras.releasesCount > 0;
  const hasCI = extras.workflowFiles.length > 0;
  const hasMultipleContributors = extras.contributorsCount > 1;
  const hasDeployment = !!repo.homepage && repo.homepage.trim().length > 0;

  const checks = [
    { key: "readme", label: "README present", passed: extras.hasReadme, max: HEALTH_WEIGHTS.readme },
    { key: "license", label: "License declared", passed: !!repo.license, max: HEALTH_WEIGHTS.license },
    { key: "topics", label: "Topics configured", passed: repo.topics.length >= 3, max: HEALTH_WEIGHTS.topics },
    { key: "description", label: "Description set", passed: !!repo.description, max: HEALTH_WEIGHTS.description },
    { key: "releases", label: "Has releases", passed: hasReleases, max: HEALTH_WEIGHTS.releases },
    { key: "deployment", label: "Deployment URL", passed: hasDeployment, max: HEALTH_WEIGHTS.deployment },
    { key: "ci", label: "CI/CD workflows", passed: hasCI, max: HEALTH_WEIGHTS.ci },
    {
      key: "contributors",
      label: "Multiple contributors",
      passed: hasMultipleContributors,
      max: HEALTH_WEIGHTS.contributors,
    },
    {
      key: "issueTemplates",
      label: "Issue templates",
      passed: extras.hasIssueTemplates,
      max: HEALTH_WEIGHTS.issueTemplates,
    },
    { key: "recent", label: "Active < 90d", passed: recentlyActive, max: HEALTH_WEIGHTS.recent },
  ];

  const breakdown = checks.map((c) => ({
    label: c.label,
    points: c.passed ? c.max : 0,
    max: c.max,
    passed: c.passed,
  }));

  const healthScore = breakdown.reduce((a, b) => a + b.points, 0);

  const suggestions: RepoAnalysis["suggestions"] = checks
    .filter((c) => !c.passed)
    .map((c) => ({
      title: suggestionTitle(c.key),
      impact: c.max,
      reason: suggestionReason(c.key),
    }));

  return {
    repo,
    hasReadme: extras.hasReadme,
    hasLicense: !!repo.license,
    hasTopics: repo.topics.length >= 3,
    hasDescription: !!repo.description,
    hasReleases,
    hasDeployment,
    hasCI,
    hasMultipleContributors,
    hasIssueTemplates: extras.hasIssueTemplates,
    recentlyActive,
    contributorsCount: extras.contributorsCount,
    releasesCount: extras.releasesCount,
    workflowFiles: extras.workflowFiles,
    healthScore,
    breakdown,
    suggestions,
  };
}

function suggestionTitle(key: string): string {
  return {
    readme: "Add a README.md",
    license: "Add an open-source license",
    topics: "Add GitHub topics (min. 3)",
    description: "Write a one-line description",
    releases: "Cut a tagged release",
    deployment: "Add a live deployment URL",
    ci: "Add a GitHub Actions workflow",
    contributors: "Invite contributors / open to PRs",
    issueTemplates: "Add issue templates",
    recent: "Push a recent commit",
  }[key] ?? key;
}

function suggestionReason(key: string): string {
  return {
    readme: "READMEs drive ~3x more clicks from recruiters and search.",
    license: "Repos without a license are legally unusable by others.",
    topics: "Topics improve discoverability in GitHub search by ~40%.",
    description: "Descriptions appear in profile cards and search results.",
    releases: "Releases signal project maturity and versioning discipline.",
    deployment: "A live URL converts viewers into demo users.",
    ci: "CI badges signal engineering maturity.",
    contributors: "Multi-contributor repos show collaboration skills.",
    issueTemplates: "Templates show open-source readiness.",
    recent: "Recency signals an active developer.",
  }[key] ?? "Improves repo health.";
}

// ---------------- Profile-level scoring ----------------

export function computeAtsScore(user: GhUser, repos: RepoAnalysis[], profileReadme: string | null) {
  const topRepos = [...repos]
    .filter((r) => !r.repo.fork && !r.repo.archived)
    .sort((a, b) => b.repo.stargazers_count - a.repo.stargazers_count)
    .slice(0, 6);

  const repoAvg = topRepos.length
    ? topRepos.reduce((a, b) => a + b.healthScore, 0) / topRepos.length
    : 0;
  const repoComponent = (repoAvg / 100) * 60;

  const profileChecks = [
    { label: "Bio", points: user.bio ? 4 : 0, max: 4 },
    { label: "Avatar", points: user.avatar_url ? 2 : 0, max: 2 },
    { label: "Profile README", points: profileReadme ? 6 : 0, max: 6 },
    { label: "Location", points: user.location ? 2 : 0, max: 2 },
    { label: "Public repos ≥ 10", points: user.public_repos >= 10 ? 3 : 0, max: 3 },
    { label: "Followers ≥ 25", points: user.followers >= 25 ? 3 : 0, max: 3 },
  ];
  const profileComponent = profileChecks.reduce((a, b) => a + b.points, 0);

  const activeCount = repos.filter((r) => r.recentlyActive).length;
  const activityRatio = repos.length ? activeCount / repos.length : 0;
  const activityComponent = Math.round(activityRatio * 20);

  const score = Math.round(repoComponent + profileComponent + activityComponent);

  // Potential: assume repo avg goes to 90
  const potentialRepo = (90 / 100) * 60;
  const potentialProfile = 20;
  const potentialActivity = 20;
  const potential = Math.round(potentialRepo + potentialProfile + potentialActivity);

  return {
    score: Math.min(100, score),
    potential: Math.min(100, potential),
    breakdown: [
      { label: "Top-6 repo health", points: Math.round(repoComponent), max: 60 },
      { label: "Profile completeness", points: profileComponent, max: 20 },
      { label: "Activity consistency", points: activityComponent, max: 20 },
    ],
  };
}

// ---------------- Career role signatures ----------------

const ROLE_SIGNATURES: { role: string; langs: string[]; topics: string[] }[] = [
  {
    role: "Frontend Developer",
    langs: ["TypeScript", "JavaScript", "CSS", "HTML", "Vue", "Svelte"],
    topics: ["react", "next", "nextjs", "vue", "svelte", "tailwindcss", "frontend", "ui"],
  },
  {
    role: "Backend Developer",
    langs: ["Go", "Java", "Python", "Ruby", "PHP", "C#", "Rust", "TypeScript"],
    topics: ["api", "rest", "graphql", "express", "fastify", "django", "fastapi", "spring", "nestjs"],
  },
  {
    role: "Full Stack Developer",
    langs: ["TypeScript", "JavaScript", "Python"],
    topics: ["fullstack", "nextjs", "remix", "supabase", "prisma", "trpc", "mern", "mean"],
  },
  {
    role: "DevOps / Platform Engineer",
    langs: ["Shell", "HCL", "Go", "Python", "Dockerfile"],
    topics: ["docker", "kubernetes", "terraform", "ansible", "ci", "cd", "devops", "helm"],
  },
  {
    role: "Cloud Engineer",
    langs: ["Python", "Go", "TypeScript", "HCL"],
    topics: ["aws", "gcp", "azure", "cloudflare", "serverless", "lambda", "cdk"],
  },
  {
    role: "Mobile Developer",
    langs: ["Swift", "Kotlin", "Dart", "Java", "Objective-C"],
    topics: ["ios", "android", "flutter", "react-native", "swiftui", "jetpack-compose"],
  },
  {
    role: "Data / ML Engineer",
    langs: ["Python", "Jupyter Notebook", "R"],
    topics: ["machine-learning", "ml", "pytorch", "tensorflow", "data-science", "llm", "rag", "nlp"],
  },
  {
    role: "Open Source Contributor",
    langs: [],
    topics: ["oss", "hacktoberfest"],
  },
];

export function computeCareerRoles(repos: RepoAnalysis[], languages: Map<string, number>): CareerRole[] {
  const allTopics = new Set<string>();
  repos.forEach((r) => r.repo.topics.forEach((t) => allTopics.add(t.toLowerCase())));

  const totalContribs = repos.filter((r) => r.hasMultipleContributors).length;

  return ROLE_SIGNATURES.map((sig) => {
    const matchedLangs = sig.langs.filter((l) => languages.has(l));
    const matchedTopics = sig.topics.filter((t) => allTopics.has(t));
    const missingLangs = sig.langs.filter((l) => !languages.has(l)).slice(0, 4);
    const missingTopics = sig.topics.filter((t) => !allTopics.has(t)).slice(0, 4);

    const langScore = sig.langs.length ? (matchedLangs.length / sig.langs.length) * 50 : 0;
    const topicScore = sig.topics.length ? (matchedTopics.length / sig.topics.length) * 50 : 0;
    let score = Math.round(langScore + topicScore);

    if (sig.role === "Open Source Contributor") {
      score = Math.min(100, Math.round((totalContribs / 5) * 100));
    }

    const strengths: string[] = [];
    if (matchedLangs.length) strengths.push(`Uses ${matchedLangs.slice(0, 3).join(", ")}`);
    if (matchedTopics.length) strengths.push(`Tagged: ${matchedTopics.slice(0, 3).join(", ")}`);
    if (sig.role === "Open Source Contributor" && totalContribs > 0)
      strengths.push(`${totalContribs} multi-contributor repo${totalContribs === 1 ? "" : "s"}`);

    const gaps: string[] = [];
    if (missingLangs.length) gaps.push(`Missing: ${missingLangs.join(", ")}`);
    if (missingTopics.length) gaps.push(`No topics: ${missingTopics.join(", ")}`);

    return { role: sig.role, score, strengths, gaps };
  })
    .sort((a, b) => b.score - a.score);
}

// ---------------- Company fit rubrics ----------------

interface CompanyRubric {
  company: string;
  tier: "service" | "product";
  checks: { label: string; test: (ctx: CompanyCtx) => boolean; weight: number }[];
}

interface CompanyCtx {
  user: GhUser;
  repos: RepoAnalysis[];
  langs: Set<string>;
  topics: Set<string>;
  totalStars: number;
}

const SERVICE_BASE: CompanyRubric["checks"] = [
  { label: "Multiple languages (≥ 3)", test: (c) => c.langs.size >= 3, weight: 12 },
  { label: "Java, Python, or C# present", test: (c) => ["Java", "Python", "C#"].some((l) => c.langs.has(l)), weight: 15 },
  { label: "≥ 5 public repos", test: (c) => c.user.public_repos >= 5, weight: 10 },
  { label: "≥ 1 deployed project", test: (c) => c.repos.some((r) => r.hasDeployment), weight: 12 },
  { label: "Database/SQL experience", test: (c) => has(c.topics, ["sql", "mysql", "postgres", "mongodb", "database"]), weight: 10 },
  { label: "≥ 3 repos with README", test: (c) => c.repos.filter((r) => r.hasReadme).length >= 3, weight: 10 },
  { label: "REST/API project", test: (c) => has(c.topics, ["api", "rest", "graphql"]), weight: 10 },
  { label: "Recent activity (< 90d)", test: (c) => c.repos.some((r) => r.recentlyActive), weight: 11 },
  { label: "Profile bio set", test: (c) => !!c.user.bio, weight: 5 },
  { label: "Profile README", test: (c) => true /* checked outside */, weight: 5 },
];

const PRODUCT_BASE: CompanyRubric["checks"] = [
  { label: "≥ 10 stars across portfolio", test: (c) => c.totalStars >= 10, weight: 10 },
  { label: "TypeScript or Go present", test: (c) => c.langs.has("TypeScript") || c.langs.has("Go"), weight: 10 },
  { label: "≥ 1 CI/CD pipeline", test: (c) => c.repos.some((r) => r.hasCI), weight: 12 },
  { label: "≥ 1 testing topic", test: (c) => has(c.topics, ["testing", "jest", "vitest", "pytest", "rspec", "tdd"]), weight: 10 },
  { label: "System design / architecture topic", test: (c) => has(c.topics, ["system-design", "microservices", "architecture", "distributed-systems"]), weight: 10 },
  { label: "OSS contribution (multi-contrib repo)", test: (c) => c.repos.some((r) => r.hasMultipleContributors), weight: 10 },
  { label: "Deployment / live demo", test: (c) => c.repos.some((r) => r.hasDeployment), weight: 10 },
  { label: "Cloud topic (aws/gcp/azure)", test: (c) => has(c.topics, ["aws", "gcp", "azure", "cloud", "serverless"]), weight: 10 },
  { label: "≥ 2 repos with releases", test: (c) => c.repos.filter((r) => r.hasReleases).length >= 2, weight: 9 },
  { label: "Profile followers ≥ 20", test: (c) => c.user.followers >= 20, weight: 9 },
];

function has(set: Set<string>, items: string[]) {
  return items.some((i) => set.has(i));
}

const COMPANIES: CompanyRubric[] = [
  { company: "TCS", tier: "service", checks: SERVICE_BASE },
  { company: "Infosys", tier: "service", checks: SERVICE_BASE },
  { company: "Wipro", tier: "service", checks: SERVICE_BASE },
  { company: "Cognizant", tier: "service", checks: SERVICE_BASE },
  { company: "Capgemini", tier: "service", checks: SERVICE_BASE },
  { company: "Amazon", tier: "product", checks: PRODUCT_BASE },
  { company: "Microsoft", tier: "product", checks: PRODUCT_BASE },
  { company: "Adobe", tier: "product", checks: PRODUCT_BASE },
  { company: "Atlassian", tier: "product", checks: PRODUCT_BASE },
  { company: "Google", tier: "product", checks: PRODUCT_BASE },
];

export function computeCompanyFit(
  user: GhUser,
  repos: RepoAnalysis[],
  languages: Map<string, number>,
): CompanyFit[] {
  const topics = new Set<string>();
  repos.forEach((r) => r.repo.topics.forEach((t) => topics.add(t.toLowerCase())));
  const langs = new Set(languages.keys());
  const totalStars = repos.reduce((a, b) => a + b.repo.stargazers_count, 0);
  const ctx: CompanyCtx = { user, repos, langs, topics, totalStars };

  return COMPANIES.map((c) => {
    const total = c.checks.reduce((a, b) => a + b.weight, 0);
    const got = c.checks.filter((ch) => ch.test(ctx)).reduce((a, b) => a + b.weight, 0);
    const score = Math.round((got / total) * 100);
    const reasons = c.checks.filter((ch) => ch.test(ctx)).map((ch) => ch.label);
    const gaps = c.checks.filter((ch) => !ch.test(ctx)).map((ch) => ch.label);
    return { company: c.company, tier: c.tier, score, reasons, gaps };
  });
}

// ---------------- Portfolio scores ----------------

export function computePortfolioScores(repos: RepoAnalysis[], languages: Map<string, number>, profileReadme: string | null) {
  const n = Math.max(1, repos.length);
  const avgHealth = repos.reduce((a, b) => a + b.healthScore, 0) / n;
  const docs = (repos.filter((r) => r.hasReadme).length / n) * 100;
  const oss = (repos.filter((r) => r.hasLicense && r.hasIssueTemplates).length / n) * 100;
  const recruiter = profileReadme ? Math.min(100, avgHealth + 10) : avgHealth;
  const diversity = Math.min(100, languages.size * 12);
  const activeRatio = repos.filter((r) => r.recentlyActive).length / n;
  const consistency = Math.round(activeRatio * 100);

  return {
    portfolioStrength: Math.round(avgHealth),
    documentation: Math.round(docs),
    openSource: Math.round(oss),
    recruiter: Math.round(recruiter),
    diversity: Math.round(diversity),
    consistency,
  };
}

// ---------------- Roadmap ----------------

export function generateRoadmap(repos: RepoAnalysis[], atsScore: number): RoadmapWeek[] {
  const missingReadme = repos.filter((r) => !r.hasReadme).length;
  const missingLicense = repos.filter((r) => !r.hasLicense).length;
  const missingTopics = repos.filter((r) => !r.hasTopics).length;
  const missingDeploy = repos.filter((r) => !r.hasDeployment).length;
  const missingCI = repos.filter((r) => !r.hasCI).length;
  const missingReleases = repos.filter((r) => !r.hasReleases).length;

  const weeks: RoadmapWeek[] = [];

  weeks.push({
    week: 1,
    phase: "30-day",
    title: "README & Documentation Sprint",
    tasks: [
      `Write or upgrade README.md for the top ${Math.min(5, Math.max(1, missingReadme))} repos.`,
      "Include: tagline, screenshots, install steps, usage, license.",
      "Add a profile README highlighting your top 3 projects.",
    ],
  });

  weeks.push({
    week: 2,
    phase: "30-day",
    title: "Topics, License & Descriptions",
    tasks: [
      `Add ≥3 topics to ${missingTopics} repo${missingTopics === 1 ? "" : "s"} missing them.`,
      `Add MIT or Apache-2.0 license to ${missingLicense} repo${missingLicense === 1 ? "" : "s"}.`,
      "Write a one-line description for every public repo.",
    ],
  });

  weeks.push({
    week: 3,
    phase: "30-day",
    title: "Ship a Deployment",
    tasks: [
      `Deploy ${Math.min(3, Math.max(1, missingDeploy))} project(s) to Vercel / Netlify / Render.`,
      "Set the live URL as the repo Homepage in GitHub settings.",
      "Add a 'Live demo' badge at the top of the README.",
    ],
  });

  weeks.push({
    week: 4,
    phase: "30-day",
    title: "CI/CD Baseline",
    tasks: [
      `Add a basic GitHub Actions workflow (lint + build) to ${Math.min(3, missingCI)} repo${missingCI === 1 ? "" : "s"}.`,
      "Add a status badge to the README.",
      "Enable Dependabot security updates on top repos.",
    ],
  });

  weeks.push({
    week: 6,
    phase: "60-day",
    title: "Releases & Versioning",
    tasks: [
      `Cut a v0.1.0 release on ${Math.min(3, missingReleases)} mature repo${missingReleases === 1 ? "" : "s"}.`,
      "Adopt Conventional Commits and changelogs.",
      "Tag and document breaking changes.",
    ],
  });

  weeks.push({
    week: 8,
    phase: "60-day",
    title: "Open Source Posture",
    tasks: [
      "Add CONTRIBUTING.md and CODE_OF_CONDUCT.md to flagship repos.",
      "Create issue and PR templates under .github/.",
      "Label good-first-issue items to invite contributors.",
    ],
  });

  weeks.push({
    week: 10,
    phase: "90-day",
    title: "Depth Project",
    tasks: [
      "Start one substantial project showing system design (auth, DB, tests, deploy, CI).",
      "Write a README that explains architecture and tradeoffs.",
      "Record a 60-second demo GIF in the README.",
    ],
  });

  weeks.push({
    week: 12,
    phase: "90-day",
    title: "Polish & Pin",
    tasks: [
      "Pin your 6 strongest repos on the profile.",
      "Re-run this audit; aim for ATS score ≥ 85.",
      `Current ATS: ${atsScore}% — measurable progress against the same rubric.`,
    ],
  });

  return weeks;
}

// ---------------- Language aggregation ----------------

export function aggregateLanguages(
  perRepo: { name: string; languages: Record<string, number> }[],
): { langs: { name: string; bytes: number; repos: number }[]; map: Map<string, number> } {
  const bytes = new Map<string, number>();
  const repoCounts = new Map<string, number>();
  for (const r of perRepo) {
    for (const [lang, b] of Object.entries(r.languages)) {
      bytes.set(lang, (bytes.get(lang) || 0) + b);
      repoCounts.set(lang, (repoCounts.get(lang) || 0) + 1);
    }
  }
  const langs = [...bytes.entries()]
    .map(([name, b]) => ({ name, bytes: b, repos: repoCounts.get(name) || 0 }))
    .sort((a, b) => b.bytes - a.bytes);
  return { langs, map: bytes };
}

export function summary(result: AuditResult) {
  return {
    user: result.user.login,
    repos: result.repos.length,
    ats: result.atsScore.score,
  };
}
