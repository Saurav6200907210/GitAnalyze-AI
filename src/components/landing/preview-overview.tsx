import { useState, useEffect, useRef } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { useMotionValue, useSpring, useInView } from "framer-motion";

function Counter({ to, duration = 1.2 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: duration * 1000, bounce: 0 });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (inView) mv.set(to);
    const u = spring.on("change", (v) => setDisplay(Math.round(v)));
    return () => u();
  }, [inView, to, mv, spring]);
  return <span ref={ref}>{display}</span>;
}

function MiniStat({ label, v }: { label: string; v: number }) {
  return (
    <div className="rounded-xl border bg-background/40 p-3">
      <p className="font-display text-lg font-bold"><Counter to={v} /></p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

export default function PreviewOverview() {
  const langs = [
    { name: "TypeScript", value: 42, color: "var(--chart-1)" },
    { name: "Python", value: 24, color: "var(--chart-2)" },
    { name: "Go", value: 16, color: "var(--chart-3)" },
    { name: "Rust", value: 10, color: "var(--chart-4)" },
    { name: "Other", value: 8, color: "var(--chart-5)" },
  ];
  const radar = [
    { axis: "Docs", v: 78 },
    { axis: "CI/CD", v: 65 },
    { axis: "Releases", v: 54 },
    { axis: "Activity", v: 88 },
    { axis: "Diversity", v: 72 },
    { axis: "Community", v: 60 },
  ];
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">ATS Score</p>
        <div className="mt-3 flex items-end gap-2">
          <span className="font-display text-6xl font-bold text-gradient"><Counter to={82} /></span>
          <span className="mb-2 text-sm text-muted-foreground">/ 100</span>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: "82%", transition: "width 1.2s ease-out" }} />
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2 text-center">
          <MiniStat label="Repos" v={48} />
          <MiniStat label="Stars" v={1240} />
          <MiniStat label="Followers" v={312} />
        </div>
      </div>
      <div className="md:col-span-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Language mix</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={langs}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                outerRadius={80}
                paddingAngle={3}
                onMouseEnter={(_, i) => setHovered(langs[i].name)}
                onMouseLeave={() => setHovered(null)}
                isAnimationActive={false}
              >
                {langs.map((l) => (
                  <Cell
                    key={l.name}
                    fill={l.color}
                    stroke="var(--background)"
                    strokeWidth={2}
                    opacity={hovered && hovered !== l.name ? 0.35 : 1}
                    style={{ transition: "opacity .25s, transform .25s", transformOrigin: "center" }}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(v: number) => `${v}%`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          {langs.map((l) => (
            <span key={l.name} className="inline-flex items-center gap-1">
              <span className="size-2 rounded-sm" style={{ background: l.color }} />
              {l.name}
            </span>
          ))}
        </div>
      </div>
      <div className="md:col-span-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Portfolio radar</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radar}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="axis" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
              <Radar dataKey="v" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.35} isAnimationActive={false} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
