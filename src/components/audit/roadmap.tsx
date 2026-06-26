import type { RoadmapWeek } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export function Roadmap({
  weeks,
  ats,
}: {
  weeks: RoadmapWeek[];
  ats: { score: number; potential: number };
}) {
  const phases = ["30-day", "60-day", "90-day"] as const;

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold">AI Improvement Roadmap</h3>
            <p className="text-sm text-muted-foreground">
              Generated from the gaps detected in your audit. Each task is mapped to a measurable score lift.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Current ATS:{" "}
            <span className="font-display text-xl font-bold tabular-nums text-foreground">
              {ats.score}
            </span>{" "}
            → Target:{" "}
            <span className="font-display text-xl font-bold tabular-nums text-primary">
              {ats.potential}
            </span>
          </div>
        </div>
      </Card>

      {phases.map((p) => (
        <div key={p}>
          <div className="mb-3 flex items-center gap-2">
            <Badge className="font-display">{p} plan</Badge>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {weeks
              .filter((w) => w.phase === p)
              .map((w) => (
                <Card key={w.week} className="p-5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-semibold">{w.title}</h4>
                    <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-xs">
                      Week {w.week}
                    </span>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {w.tasks.map((t) => (
                      <li key={t} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
