import { useState, useEffect, useRef, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { ShieldCheck, Star, CalendarRange } from "lucide-react";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";

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

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function ScoreRing({ value }: { value: number }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative size-[72px]">
      <svg viewBox="0 0 72 72" className="size-full -rotate-90">
        <circle cx="36" cy="36" r={r} stroke="var(--muted)" strokeWidth="7" fill="none" />
        <motion.circle
          cx="36"
          cy="36"
          r={r}
          stroke="var(--primary)"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center font-display text-lg font-bold tabular-nums">{value}</div>
    </div>
  );
}

function FloatingCard({
  children, initial, className = "",
}: {
  children: React.ReactNode;
  initial: { x: number; y: number };
  className?: string;
}) {
  return (
    <motion.div
      drag
      dragConstraints={{ left: -45, right: 45, top: -35, bottom: 35 }}
      dragElastic={0.2}
      dragSnapToOrigin={true}
      dragMomentum={false}
      whileDrag={{ scale: 1.04, zIndex: 50, boxShadow: "0 30px 80px -20px color-mix(in oklab, var(--primary) 40%, transparent)" }}
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, scale: 0.9, ...initial }}
      animate={{ opacity: 1, scale: 1, ...initial }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className={`glass absolute cursor-grab touch-none rounded-2xl p-4 shadow-card active:cursor-grabbing ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function DraggablePlayground() {
  const constraints = useRef<HTMLDivElement>(null);
  const [activity, setActivity] = useState(() =>
    Array.from({ length: 16 }, (_, i) => ({ d: `W${i + 1}`, commits: 8 + Math.round(Math.sin(i / 2) * 6 + Math.random() * 10) })),
  );
  const [score, setScore] = useState(72);

  useEffect(() => {
    const t = setInterval(() => {
      setActivity((prev) => {
        const next = prev.slice(1);
        next.push({ d: `W${parseInt(prev[prev.length - 1].d.slice(1)) + 1}`, commits: 10 + Math.round(Math.random() * 8) });
        return next;
      });
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const repos = useMemo(
    () => [
      { name: "next-auth-kit", health: 94, color: "var(--chart-1)" },
      { name: "fast-cache", health: 88, color: "var(--chart-3)" },
      { name: "vector-db", health: 81, color: "var(--chart-5)" },
      { name: "ml-pipeline", health: 72, color: "var(--chart-2)" },
      { name: "edge-router", health: 66, color: "var(--chart-4)" },
    ],
    [],
  );

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 py-16">
      <SectionHeader
        eyebrow="Interactive"
        title="Drag the cards. Watch the data move."
        subtitle="A tiny playground that mirrors how your real report behaves — live charts, hover states, draggable widgets."
      />

      <div
        ref={constraints}
        className="relative mt-10 h-[390px] overflow-hidden rounded-3xl border bg-card/40 p-4"
      >
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />

        {/* Activity chart card */}
        <FloatingCard
          initial={{ x: 20, y: 20 }}
          className="w-[310px] h-[240px]"
        >
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Commit activity</p>
              <p className="font-display text-2xl font-bold mt-1">
                <Counter to={activity.reduce((a, b) => a + b.commits, 0)} /> <span className="text-xs font-normal text-muted-foreground">commits / 16w</span>
              </p>
            </div>
            <div className="h-32 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activity}>
                  <defs>
                    <linearGradient id="lp-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="d" hide />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                    cursor={{ stroke: "var(--primary)", strokeOpacity: 0.3 }}
                  />
                  <Area type="monotone" dataKey="commits" stroke="var(--chart-1)" strokeWidth={2} fill="url(#lp-area)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </FloatingCard>

        {/* Score ring card */}
        <FloatingCard
          initial={{ x: 350, y: 20 }}
          className="w-[310px] h-[240px]"
        >
          <div className="flex flex-col h-full justify-between pb-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">ATS score</p>
            <div className="flex flex-col items-center justify-center flex-1 my-2">
              <ScoreRing value={score} />
            </div>
            <div className="space-y-1.5">
              <input
                type="range"
                min={20}
                max={100}
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value))}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-full accent-[var(--primary)] cursor-pointer"
              />
              <p className="text-center text-[10px] uppercase tracking-wider text-muted-foreground">drag to simulate</p>
            </div>
          </div>
        </FloatingCard>

        {/* Repo bars card */}
        <FloatingCard
          initial={{ x: 680, y: 20 }}
          className="w-[310px] h-[240px]"
        >
          <div className="flex flex-col h-full justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Top repos · health</p>
            <div className="h-40 mt-2 flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={repos} layout="vertical" margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" width={88} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                    cursor={{ fill: "var(--muted)", fillOpacity: 0.4 }}
                    formatter={(v: number) => `${v}%`}
                  />
                  <Bar dataKey="health" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                    {repos.map((r) => (
                      <Cell key={r.name} fill={r.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </FloatingCard>

        {/* Mini badge cards */}
        <FloatingCard
          initial={{ x: 20, y: 280 }}
          className="w-[310px] h-[80px]"
        >
          <div className="flex items-center gap-3 h-full">
            <div className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground shrink-0"><ShieldCheck className="size-5" aria-hidden="true" /></div>
            <div>
              <p className="font-display text-2xl font-bold leading-none"><Counter to={12} /></p>
              <p className="text-xs text-muted-foreground mt-1">Signals scored</p>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard
          initial={{ x: 350, y: 280 }}
          className="w-[310px] h-[80px]"
        >
          <div className="flex items-center gap-3 h-full">
            <div className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground shrink-0"><Star className="size-5" aria-hidden="true" /></div>
            <div>
              <p className="font-display text-2xl font-bold leading-none"><Counter to={1240} /></p>
              <p className="text-xs text-muted-foreground mt-1">Stars aggregated</p>
            </div>
          </div>
        </FloatingCard>

        <FloatingCard
          initial={{ x: 680, y: 280 }}
          className="w-[310px] h-[80px]"
        >
          <div className="flex items-center gap-3 h-full">
            <div className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground shrink-0"><CalendarRange className="size-5" aria-hidden="true" /></div>
            <div>
              <p className="font-display text-lg font-semibold leading-none">30/60/90 plan</p>
              <p className="text-xs text-muted-foreground mt-1">Generated from real gaps</p>
            </div>
          </div>
        </FloatingCard>
      </div>
    </section>
  );
}
