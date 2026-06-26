export interface GhUser {
  login: string;
  id: number;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GhRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
  license: { name: string; spdx_id: string } | null;
  fork: boolean;
  archived: boolean;
  default_branch: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
}

export interface RepoAnalysis {
  repo: GhRepo;
  hasReadme: boolean;
  hasLicense: boolean;
  hasTopics: boolean;
  hasDescription: boolean;
  hasReleases: boolean;
  hasDeployment: boolean;
  hasCI: boolean;
  hasMultipleContributors: boolean;
  hasIssueTemplates: boolean;
  recentlyActive: boolean;
  contributorsCount: number;
  releasesCount: number;
  workflowFiles: string[];
  healthScore: number;
  breakdown: { label: string; points: number; max: number; passed: boolean }[];
  suggestions: { title: string; impact: number; reason: string }[];
}

export interface AuditResult {
  user: GhUser;
  profileReadme: string | null;
  repos: RepoAnalysis[];
  languageStats: { name: string; bytes: number; repos: number }[];
  atsScore: { score: number; potential: number; breakdown: { label: string; points: number; max: number }[] };
  careerRoles: CareerRole[];
  companyFit: CompanyFit[];
  portfolioScores: {
    portfolioStrength: number;
    documentation: number;
    openSource: number;
    recruiter: number;
    diversity: number;
    consistency: number;
  };
  roadmap: RoadmapWeek[];
  rateLimit: { remaining: number; limit: number };
  fetchedAt: string;
}

export interface CareerRole {
  role: string;
  score: number;
  strengths: string[];
  gaps: string[];
}

export interface CompanyFit {
  company: string;
  tier: "service" | "product";
  score: number;
  reasons: string[];
  gaps: string[];
}

export interface RoadmapWeek {
  week: number;
  phase: "30-day" | "60-day" | "90-day";
  title: string;
  tasks: string[];
}
