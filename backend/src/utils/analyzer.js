export const generateAuditData = (profile, repos, languages, rateLimit) => {
  const stats = {
    totalRepos: profile.public_repos || 0,
    totalStars: repos.reduce((acc, repo) => acc + repo.stargazers_count, 0),
    totalForks: repos.reduce((acc, repo) => acc + repo.forks_count, 0),
    followers: profile.followers || 0
  };

  const topRepositories = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10)
    .map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      htmlUrl: repo.html_url,
      stargazersCount: repo.stargazers_count,
      forksCount: repo.forks_count,
      language: repo.language,
      updatedAt: repo.updated_at,
      hasIssues: repo.has_issues,
      topics: repo.topics
    }));

  const mappedRepos = repos.map(repo => ({
    id: repo.id,
    name: repo.name,
    description: repo.description,
    htmlUrl: repo.html_url,
    stargazersCount: repo.stargazers_count,
    forksCount: repo.forks_count,
    language: repo.language,
    updatedAt: repo.updated_at,
    hasIssues: repo.has_issues,
    topics: repo.topics
  }));

  return {
    profile: {
      login: profile.login,
      name: profile.name || profile.login,
      avatarUrl: profile.avatar_url,
      bio: profile.bio || '',
      htmlUrl: profile.html_url,
      createdAt: profile.created_at,
      publicRepos: profile.public_repos,
      followers: profile.followers,
      following: profile.following
    },
    stats,
    repositories: mappedRepos,
    languages: Object.entries(languages)
      .map(([name, size]) => ({ name, size, percentage: 0 })) // Calculate percentage if needed
      .sort((a, b) => b.size - a.size),
    topRepositories,
    portfolioRadar: {
      strength: Math.min(100, (stats.totalStars * 10 + stats.totalRepos * 2)),
      docs: 80, // Mocks based on typical structure
      oss: stats.totalStars > 0 ? 80 : 30,
      diversity: Object.keys(languages).length * 10,
      consistency: 70,
      quality: 85
    },
    health: {},
    ats: {},
    career: {},
    companies: [],
    roadmap: [],
    rateLimit: {
      limit: rateLimit ? parseInt(rateLimit.limit, 10) : 5000,
      remaining: rateLimit ? parseInt(rateLimit.remaining, 10) : 4999,
      resetAt: rateLimit ? new Date(rateLimit.reset * 1000).toISOString() : new Date().toISOString()
    },
    auditedAt: new Date().toISOString()
  };
};
