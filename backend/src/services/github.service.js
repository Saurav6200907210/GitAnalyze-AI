import axios from 'axios';
import NodeCache from 'node-cache';
import {
  aggregateLanguages,
  analyzeRepo,
  computeAtsScore,
  computeCareerRoles,
  computeCompanyFit,
  computePortfolioScores,
  generateRoadmap,
} from '../utils/scoring.js';

const CACHE_TTL = process.env.CACHE_TTL_SECONDS ? parseInt(process.env.CACHE_TTL_SECONDS, 10) : 3600;
const cache = new NodeCache({ stdTTL: CACHE_TTL });

const githubApi = axios.create({
  baseURL: 'https://api.github.com'
});

githubApi.interceptors.request.use((config) => {
  if (process.env.GITHUB_TOKEN) {
    config.headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  config.headers.Accept = 'application/vnd.github+json';
  config.headers['X-GitHub-Api-Version'] = '2022-11-28';
  config.headers['User-Agent'] = 'gitport-audit-backend';
  return config;
});

const handleApiError = (error, defaultMessage) => {
  // If we already transformed it to our custom error with a status, preserve it
  if (error.message === 'NOT_FOUND' || error.message === 'RATE_LIMITED') {
    throw error;
  }

  const status = error.response ? error.response.status : error.status;
  
  if (status === 404) {
    const err = new Error('NOT_FOUND');
    err.status = 404;
    throw err;
  }
  
  if (status === 403) {
    const err = new Error('RATE_LIMITED');
    err.status = 403;
    throw err;
  }

  const err = new Error(defaultMessage || 'GitHub API error');
  err.status = 500;
  throw err;
};

export const fetchUserProfile = async (username) => {
  const cacheKey = `profile:${username}`;
  if (cache.has(cacheKey)) {
    return { ...cache.get(cacheKey), cached: true };
  }
  try {
    const response = await githubApi.get(`/users/${username}`);
    const data = response.data;
    cache.set(cacheKey, data);
    return { ...data, cached: false, headers: response.headers };
  } catch (error) {
    handleApiError(error, 'Failed to fetch user profile');
  }
};

export const fetchAllRepos = async (username) => {
  const out = [];
  try {
    for (let page = 1; page <= 4; page++) {
      const response = await githubApi.get(`/users/${username}/repos?per_page=100&page=${page}&sort=updated`);
      out.push(...response.data);
      if (response.data.length < 100) break;
    }
    return out;
  } catch (error) {
    handleApiError(error, 'Failed to fetch user repositories');
  }
};

export const fetchRepoLanguages = async (full) => {
  try {
    const response = await githubApi.get(`/repos/${full}/languages`);
    return response.data;
  } catch {
    return {};
  }
};

export const fetchProfileReadme = async (username) => {
  try {
    const res = await githubApi.get(`/repos/${username}/${username}/readme`);
    if (!res.data || !res.data.content) return null;
    return Buffer.from(res.data.content, 'base64').toString('utf-8');
  } catch {
    return null;
  }
};

export const fetchRepoExtras = async (full) => {
  const [readme, releases, contributors, workflows, issueTpl] = await Promise.all([
    githubApi.get(`/repos/${full}/readme`).then(() => true).catch(() => false),
    githubApi.get(`/repos/${full}/releases?per_page=1`)
      .then((r) => (Array.isArray(r.data) ? r.data.length : 0))
      .catch(() => 0),
    githubApi.get(`/repos/${full}/contributors?per_page=10&anon=1`)
      .then((r) => (Array.isArray(r.data) ? r.data.length : 0))
      .catch(() => 0),
    githubApi.get(`/repos/${full}/contents/.github/workflows`)
      .then((r) => (Array.isArray(r.data) ? r.data.filter((f) => f.type === 'file').map((f) => f.name) : []))
      .catch(() => []),
    githubApi.get(`/repos/${full}/contents/.github/ISSUE_TEMPLATE`)
      .then(() => true)
      .catch(() => false),
  ]);

  return {
    hasReadme: readme,
    releasesCount: releases,
    contributorsCount: contributors,
    workflowFiles: workflows,
    hasIssueTemplates: issueTpl,
  };
};

export const checkRateLimit = async () => {
  try {
    const response = await githubApi.get('/rate_limit');
    return response.data.rate;
  } catch (error) {
    handleApiError(error, 'Failed to fetch rate limit');
  }
};

export const fetchUserAudit = async (username) => {
  const cacheKey = `audit:${username}`;
  if (cache.has(cacheKey)) {
    return { ...cache.get(cacheKey), cached: true };
  }

  try {
    const userRes = await fetchUserProfile(username);
    const user = userRes;

    const [allRepos, profileReadme] = await Promise.all([
      fetchAllRepos(username),
      fetchProfileReadme(username),
    ]);

    const candidates = allRepos
      .filter((r) => !r.fork && !r.archived)
      .sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());
    
    const toAnalyze = candidates.slice(0, 25);

    const concurrency = 5;
    const results = [];
    for (let i = 0; i < toAnalyze.length; i += concurrency) {
      const batch = toAnalyze.slice(i, i + concurrency);
      const batchResults = await Promise.all(
        batch.map(async (repo) => {
          const [langs, extras] = await Promise.all([
            fetchRepoLanguages(repo.full_name),
            fetchRepoExtras(repo.full_name),
          ]);
          return { repo, langs, extras };
        })
      );
      results.push(...batchResults);
    }

    const repoAnalyses = results.map((r) => analyzeRepo(r.repo, r.extras));
    const { langs, map: langMap } = aggregateLanguages(
      results.map((r) => ({ name: r.repo.name, languages: r.langs }))
    );

    const ats = computeAtsScore(user, repoAnalyses, profileReadme);
    const careerRoles = computeCareerRoles(repoAnalyses, langMap);
    const companyFit = computeCompanyFit(user, repoAnalyses, langMap);
    const portfolioScores = computePortfolioScores(repoAnalyses, langMap, profileReadme);
    const roadmap = generateRoadmap(repoAnalyses, ats.score);

    const rateLimitHeaders = userRes.headers || {};
    const rateLimit = {
      remaining: Number(rateLimitHeaders['x-ratelimit-remaining'] || 0),
      limit: Number(rateLimitHeaders['x-ratelimit-limit'] || 60),
    };

    const auditData = {
      user,
      profileReadme,
      repos: repoAnalyses,
      languageStats: langs,
      atsScore: ats,
      careerRoles,
      companyFit,
      portfolioScores,
      roadmap,
      rateLimit,
      fetchedAt: new Date().toISOString(),
    };

    cache.set(cacheKey, auditData);
    return { ...auditData, cached: false };
  } catch (error) {
    console.error('fetchUserAudit error:', error);
    handleApiError(error, 'Failed to generate audit data');
  }
};

export const fetchUserRepos = async (username) => {
  // Simple proxy if frontend requests just repos directly
  const cacheKey = `repos:${username}`;
  if (cache.has(cacheKey)) {
    return { data: cache.get(cacheKey), cached: true };
  }
  const data = await fetchAllRepos(username);
  cache.set(cacheKey, data);
  return { data, cached: false };
}

export const clearUserCache = (username) => {
  cache.del(`profile:${username}`);
  cache.del(`repos:${username}`);
  cache.del(`audit:${username}`);
};
