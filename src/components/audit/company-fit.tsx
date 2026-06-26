import type { CompanyFit as CF } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function CompanyFit({ fit }: { fit: CF[] }) {
  const service = fit.filter((f) => f.tier === "service");
  const product = fit.filter((f) => f.tier === "product");

  return (
    <div className="space-y-8">
      <Section title="Service-based readiness" items={service} />
      <Section title="Product-based readiness" items={product} />
    </div>
  );
}

function Section({ title, items }: { title: string; items: CF[] }) {
  return (
    <div>
      <h3 className="mb-3 font-display text-base font-semibold">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((c) => (
          <Card key={c.company} className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-display font-semibold">{c.company}</span>
                <Badge variant="outline" className="capitalize">{c.tier}</Badge>
              </div>
              <span className={`font-display text-2xl font-bold tabular-nums ${
                c.score >= 75 ? "text-success" : c.score >= 50 ? "text-warning" : "text-muted-foreground"
              }`}>
                {c.score}%
              </span>
            </div>
            <Progress value={c.score} className="mt-2" />
            <div className="mt-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Why</p>
              <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                {c.reasons.slice(0, 4).map((r) => (
                  <li key={r}>✓ {r}</li>
                ))}
              </ul>
              {c.gaps.length > 0 && (
                <>
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">To improve</p>
                  <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                    {c.gaps.slice(0, 4).map((g) => (
                      <li key={g}>✗ {g}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
