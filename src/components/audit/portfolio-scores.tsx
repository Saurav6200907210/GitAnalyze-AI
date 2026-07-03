import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const LABELS: Record<string, string> = {
  portfolioStrength: "Portfolio Strength",
  documentation: "Documentation Quality",
  openSource: "Open Source Readiness",
  recruiter: "Recruiter Readiness",
  diversity: "Project Diversity",
  consistency: "Activity Consistency",
};

export function PortfolioScores({ scores }: { scores: Record<string, number> }) {
  return (
    <Card className="p-6">
      <h3 className="font-display text-base font-semibold">Portfolio quality dashboard</h3>
      <p className="text-xs text-muted-foreground">
        Each metric is computed from real repository signals (READMEs, licenses, activity, etc.).
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(scores).map(([k, v]) => (
          <div key={k} className="rounded-xl border bg-card/50 p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">{LABELS[k] ?? k}</span>
              <span className="font-display text-2xl font-bold tabular-nums">{v}</span>
            </div>
            <Progress value={v} className="mt-2" aria-label={`${LABELS[k] ?? k} progress`} />
          </div>
        ))}
      </div>
    </Card>
  );
}
