import type { AuditResult } from "@/lib/types";
import { Card } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PALETTE = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-6)"];

export function ChartsGrid({ audit }: { audit: AuditResult }) {
  const topLangs = audit.languageStats.slice(0, 6);
  const topStars = [...audit.repos]
    .sort((a, b) => b.repo.stargazers_count - a.repo.stargazers_count)
    .slice(0, 8)
    .map((r) => ({ name: r.repo.name, stars: r.repo.stargazers_count }));
  const healthDist = [
    { range: "0-25", count: audit.repos.filter((r) => r.healthScore < 25).length },
    { range: "25-50", count: audit.repos.filter((r) => r.healthScore >= 25 && r.healthScore < 50).length },
    { range: "50-75", count: audit.repos.filter((r) => r.healthScore >= 50 && r.healthScore < 75).length },
    { range: "75-100", count: audit.repos.filter((r) => r.healthScore >= 75).length },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-5">
        <h3 className="font-display text-sm font-semibold">Language distribution</h3>
        <p className="text-xs text-muted-foreground">By bytes of code (top 6)</p>
        <div className="mt-2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={topLangs} dataKey="bytes" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                {topLangs.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${(v / 1024).toFixed(1)} KB`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {topLangs.map((l, i) => (
            <span key={l.name} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-2.5 rounded-sm" style={{ background: PALETTE[i % PALETTE.length] }} />
              {l.name}
            </span>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-display text-sm font-semibold">Top repositories by stars</h3>
        <p className="text-xs text-muted-foreground">Highest signal of community traction</p>
        <div className="mt-2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topStars} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid horizontal={false} stroke="var(--border)" />
              <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis type="category" dataKey="name" width={100} stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="stars" fill="var(--chart-1)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-5 md:col-span-2">
        <h3 className="font-display text-sm font-semibold">Repository health distribution</h3>
        <p className="text-xs text-muted-foreground">How many repos fall into each health band</p>
        <div className="mt-2 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={healthDist}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="range" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

export function HealthRadarCard({
  scores,
}: {
  scores: { portfolioStrength: number; documentation: number; openSource: number; recruiter: number; diversity: number; consistency: number };
}) {
  const data = [
    { axis: "Strength", value: scores.portfolioStrength },
    { axis: "Docs", value: scores.documentation },
    { axis: "OSS", value: scores.openSource },
    { axis: "Recruiter", value: scores.recruiter },
    { axis: "Diversity", value: scores.diversity },
    { axis: "Consistency", value: scores.consistency },
  ];
  return (
    <Card className="p-5">
      <h3 className="font-display text-sm font-semibold">Portfolio radar</h3>
      <p className="text-xs text-muted-foreground">Six dimensions of portfolio quality</p>
      <div className="mt-2 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis dataKey="axis" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Score" dataKey="value" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.35} />
            <Tooltip contentStyle={tooltipStyle} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  color: "var(--popover-foreground)",
  fontSize: 12,
} as const;
