import type { AuditResult } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function AtsCard({ ats }: { ats: AuditResult["atsScore"] }) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">GitHub ATS Score</p>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-display text-6xl font-bold tabular-nums text-gradient">
              {ats.score}
            </span>
            <span className="text-xl text-muted-foreground">/ 100</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Potential ceiling with roadmap completed:{" "}
            <span className="font-semibold text-foreground">{ats.potential}</span>
          </p>
        </div>
        <div className="w-full max-w-md space-y-3">
          {ats.breakdown.map((b) => (
            <div key={b.label}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-muted-foreground">{b.label}</span>
                <span className="font-mono tabular-nums">{b.points} / {b.max}</span>
              </div>
              <Progress value={(b.points / b.max) * 100} />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
