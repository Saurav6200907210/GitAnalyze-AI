import type { RepoAnalysis } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork, AlertCircle, ExternalLink, ChevronDown, CheckCircle2, XCircle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export function RepoList({ repos }: { repos: RepoAnalysis[] }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"health" | "stars" | "updated">("health");

  const filtered = repos
    .filter(
      (r) =>
        r.repo.name.toLowerCase().includes(q.toLowerCase()) ||
        (r.repo.description ?? "").toLowerCase().includes(q.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "stars"
        ? b.repo.stargazers_count - a.repo.stargazers_count
        : sort === "updated"
          ? new Date(b.repo.pushed_at).getTime() - new Date(a.repo.pushed_at).getTime()
          : b.healthScore - a.healthScore,
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Filter repositories..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Filter repositories"
          className="max-w-sm"
        />
        <div className="flex gap-1" role="group" aria-label="Sort repositories">
          {(["health", "stars", "updated"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              aria-pressed={sort === s}
              aria-label={`Sort by ${s}`}
              className={`rounded-md px-3 py-1.5 text-xs capitalize transition-colors cursor-pointer ${
                sort === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} repositories</span>
      </div>

      <div className="grid gap-3">
        {filtered.map((r, i) => (
          <motion.div
            key={r.repo.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.02, 0.3) }}
          >
            <RepoCard analysis={r} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function healthColor(score: number) {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-destructive";
}

function RepoCard({ analysis }: { analysis: RepoAnalysis }) {
  const [open, setOpen] = useState(false);
  const r = analysis.repo;

  return (
    <Card className="p-0">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={r.html_url}
                target="_blank"
                rel="noreferrer"
                className="font-display text-base font-semibold hover:text-primary"
              >
                {r.name}
              </a>
              {r.language && <Badge variant="secondary">{r.language}</Badge>}
              {r.license && <Badge variant="outline">{r.license.spdx_id || r.license.name}</Badge>}
              {analysis.hasDeployment && (
                <a
                  href={r.homepage!}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-accent px-2 py-0.5 text-xs text-accent-foreground hover:opacity-80"
                >
                  Live <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              )}
            </div>
            {r.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{r.description}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-1">
              {r.topics.slice(0, 5).map((t) => (
                <span key={t} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                  #{t}
                </span>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Star className="size-3" aria-hidden="true" /> {r.stargazers_count}
              </span>
              <span className="inline-flex items-center gap-1">
                <GitFork className="size-3" aria-hidden="true" /> {r.forks_count}
              </span>
              <span className="inline-flex items-center gap-1">
                <AlertCircle className="size-3" aria-hidden="true" /> {r.open_issues_count}
              </span>
              <span>Updated {new Date(r.pushed_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className={`font-display text-3xl font-bold tabular-nums ${healthColor(analysis.healthScore)}`}>
                {analysis.healthScore}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Health</div>
            </div>
            <CollapsibleTrigger className="rounded-md p-2 hover:bg-secondary" aria-label="Toggle repository details">
              <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent>
          <div className="grid gap-6 border-t bg-secondary/30 p-5 md:grid-cols-2">
            <div>
              <h4 className="mb-3 font-semibold">Health breakdown</h4>
              <div className="space-y-2">
                {analysis.breakdown.map((b) => (
                  <div key={b.label} className="flex items-center gap-2 text-sm">
                    {b.passed ? (
                      <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden="true" />
                    ) : (
                      <XCircle className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    )}
                    <span className={b.passed ? "" : "text-muted-foreground"}>{b.label}</span>
                    <span className="ml-auto font-mono text-xs tabular-nums">
                      +{b.points}/{b.max}
                    </span>
                  </div>
                ))}
                <Progress value={analysis.healthScore} className="mt-3" aria-label="Repository health progress" />
              </div>
            </div>
            <div>
              <h4 className="mb-3 font-semibold">Suggestions</h4>
              {analysis.suggestions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No issues. This repo is in great shape.</p>
              ) : (
                <ul className="space-y-2">
                  {analysis.suggestions.map((s) => (
                    <li key={s.title} className="rounded-lg border bg-card p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-medium">{s.title}</div>
                          <div className="text-xs text-muted-foreground">{s.reason}</div>
                        </div>
                        <Badge variant="outline" className="font-mono">+{s.impact}%</Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
