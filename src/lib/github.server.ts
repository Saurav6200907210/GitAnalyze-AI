import type { GhUser, GhRepo } from "./types";

const BASE = "https://api.github.com";

let tokenDisabled = false;

function headers() {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "gitanalyze-ai-audit",
  };
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  if (token && !tokenDisabled) h.Authorization = `Bearer ${token}`;
  return h;
}

async function ghOnce<T>(path: string, init?: RequestInit) {
  return fetch(`${BASE}${path}`, { ...init, headers: { ...headers(), ...(init?.headers || {}) } });
}

async function gh<T>(path: string, init?: RequestInit): Promise<{ data: T; res: Response }> {
  let res = await ghOnce<T>(path, init);
  // If the configured token is bad, disable it and retry unauthenticated.
  if (res.status === 401 && !tokenDisabled) {
    console.warn("[github] GITHUB_TOKEN rejected (401). Falling back to unauthenticated requests.");
    tokenDisabled = true;
    res = await ghOnce<T>(path, init);
  }
  if (res.status === 404) throw new Error("NOT_FOUND");
  if (res.status === 403) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    if (remaining === "0") throw new Error("RATE_LIMITED");
    throw new Error(`GitHub 403: ${await res.text()}`);
  }
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as T;
  return { data, res };
}

export async function fetchUser(username: string) {
  return gh<GhUser>(`/users/${encodeURIComponent(username)}`);
}

export async function fetchAllRepos(username: string): Promise<GhRepo[]> {
  const out: GhRepo[] = [];
  for (let page = 1; page <= 4; page++) {
    const { data } = await gh<GhRepo[]>(
      `/users/${encodeURIComponent(username)}/repos?per_page=100&page=${page}&sort=updated`,
    );
    out.push(...data);
    if (data.length < 100) break;
  }
  return out;
}

export async function fetchRepoLanguages(full: string): Promise<Record<string, number>> {
  try {
    const { data } = await gh<Record<string, number>>(`/repos/${full}/languages`);
    return data;
  } catch {
    return {};
  }
}

export async function fetchProfileReadme(username: string): Promise<string | null> {
  try {
    const res = await fetch(`${BASE}/repos/${username}/${username}/readme`, { headers: headers() });
    if (!res.ok) return null;
    const j = (await res.json()) as { content?: string; encoding?: string };
    if (!j.content) return null;
    return atob(j.content.replace(/\n/g, ""));
  } catch {
    return null;
  }
}

export interface RepoExtras {
  hasReadme: boolean;
  releasesCount: number;
  contributorsCount: number;
  workflowFiles: string[];
  hasIssueTemplates: boolean;
}

export async function fetchRepoExtras(full: string): Promise<RepoExtras> {
  const [readme, releases, contributors, workflows, issueTpl] = await Promise.all([
    fetch(`${BASE}/repos/${full}/readme`, { headers: headers() }).then((r) => r.ok),
    fetch(`${BASE}/repos/${full}/releases?per_page=1`, { headers: headers() })
      .then((r) => (r.ok ? (r.json() as Promise<unknown[]>) : []))
      .then((j) => {
        // Use Link header parsing would be ideal; fallback to length
        return Array.isArray(j) ? j.length : 0;
      })
      .catch(() => 0),
    fetch(`${BASE}/repos/${full}/contributors?per_page=10&anon=1`, { headers: headers() })
      .then((r) => (r.ok ? (r.json() as Promise<unknown[]>) : []))
      .then((j) => (Array.isArray(j) ? j.length : 0))
      .catch(() => 0),
    fetch(`${BASE}/repos/${full}/contents/.github/workflows`, { headers: headers() })
      .then((r) => (r.ok ? (r.json() as Promise<{ name: string; type: string }[]>) : []))
      .then((j) =>
        Array.isArray(j) ? j.filter((f) => f.type === "file").map((f) => f.name) : [],
      )
      .catch(() => []),
    fetch(`${BASE}/repos/${full}/contents/.github/ISSUE_TEMPLATE`, { headers: headers() })
      .then((r) => r.ok)
      .catch(() => false),
  ]);

  return {
    hasReadme: readme,
    releasesCount: releases,
    contributorsCount: contributors,
    workflowFiles: workflows,
    hasIssueTemplates: issueTpl,
  };
}

export function rateLimitFromHeaders(res: Response) {
  return {
    remaining: Number(res.headers.get("x-ratelimit-remaining") || 0),
    limit: Number(res.headers.get("x-ratelimit-limit") || 60),
  };
}
