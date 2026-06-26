import type { CareerRole } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle } from "lucide-react";

export function CareerRoles({ roles }: { roles: CareerRole[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {roles.map((r) => (
        <Card key={r.role} className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold">{r.role}</h3>
            <span className="font-display text-2xl font-bold tabular-nums">{r.score}%</span>
          </div>
          <Progress value={r.score} className="mt-2" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-success">Strengths</p>
              {r.strengths.length ? (
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {r.strengths.map((s) => (
                    <li key={s} className="flex items-start gap-1.5">
                      <CheckCircle2 className="mt-0.5 size-3 shrink-0 text-success" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">—</p>
              )}
            </div>
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-destructive">Gaps</p>
              {r.gaps.length ? (
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {r.gaps.map((g) => (
                    <li key={g} className="flex items-start gap-1.5">
                      <XCircle className="mt-0.5 size-3 shrink-0 text-destructive" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">No major gaps</p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
