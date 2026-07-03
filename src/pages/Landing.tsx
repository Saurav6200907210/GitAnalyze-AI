import { Link, useNavigate } from "react-router-dom";
import { motion, useInView, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Github,
  Sparkles,
  ShieldCheck,
  FileText,
  GitBranch,
  Activity,
  Briefcase,
  Building2,
  CalendarRange,
  Gauge,
  CheckCircle2,
  Download,
  PieChart,
  Zap,
  TrendingUp,
  Users,
  Star,
  Move,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart as RPieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function parseUsername(input: string): string | null {
  const v = input.trim();
  if (!v) return null;
  const m = v.match(/github\.com\/([^/?#\s]+)/i);
  if (m) return m[1].replace(/\/$/, "");
  if (/^[a-z0-9](?:[a-z0-9-]{0,38})$/i.test(v)) return v;
  return null;
}

const SUGGESTIONS = ["torvalds", "gaearon", "tj", "sindresorhus", "yyx990803"];

export default function Landing() {
  const [value, setValue] = useState("");
  const [recent, setRecent] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem("gp-recent");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [activeTab, setActiveTab] = useState<"overview" | "repos" | "career" | "roadmap">("overview");
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, -60]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.4]);

  useEffect(() => {
    document.title = "GitAnalyze AI — GitHub Portfolio Intelligence Platform";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Audit any public GitHub profile in seconds. Get real-data scoring, repository health audits, career readiness matching, and a 30/60/90 roadmap."
      );
    }
  }, []);

  function go(username: string) {
    const next = [username, ...recent.filter((r) => r !== username)].slice(0, 6);
    try {
      localStorage.setItem("gp-recent", JSON.stringify(next));
    } catch {}
    navigate(`/audit/${username}`);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const u = parseUsername(value);
    if (!u) {
      toast.error("Enter a GitHub username or full URL");
      return;
    }
    go(u);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="group flex items-center gap-2 font-display font-bold tracking-tight">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"
          >
            <Sparkles className="size-4" />
          </motion.div>
          <span className="text-lg">GitAnalyze AI</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#features" className="story-link hover:text-foreground">Features</a>
          <a href="#how" className="story-link hover:text-foreground">How it works</a>
          <a href="#report" className="story-link hover:text-foreground">Report</a>
          <a href="#faq" className="story-link hover:text-foreground">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* HERO */}
      <motion.main
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 mx-auto max-w-5xl px-6 pt-12 pb-20 text-center sm:pt-20"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
          </span>
          Real GitHub API — no fake scores, no mock data
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 font-display text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl"
        >
          <span className="text-gradient">GitHub Portfolio</span>
          <br />
          Intelligence, on demand.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg"
        >
          Paste a GitHub profile. We audit every repository, score documentation,
          deployment, CI and contribution health, match you to roles and companies,
          and ship a 30/60/90 roadmap plus an exportable PDF report.
        </motion.p>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row"
        >
          <div className="glass relative flex flex-1 items-center rounded-xl pl-4 transition focus-within:border-primary/60 focus-within:shadow-glow font-normal font-normal">
            <Github className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="github.com/torvalds  or  torvalds"
              id="github-username-input"
              aria-label="GitHub username or profile URL"
              className="border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 gap-2 px-6 text-base font-semibold hover-scale">
            Audit profile
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mx-auto mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground"
        >
          <span>Try:</span>
          {SUGGESTIONS.map((u) => (
            <button
              key={u}
              onClick={() => go(u)}
              aria-label={`Audit username ${u}`}
              className="rounded-full border bg-card/60 px-3 py-1 transition hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground cursor-pointer"
            >
              @{u}
            </button>
          ))}
        </motion.div>

        {recent.length > 0 && (
          <div className="mx-auto mt-4 flex max-w-2xl flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>Recent:</span>
            {recent.map((u) => (
              <Link
                key={u}
                to={`/audit/${u}`}
                className="rounded-full border border-primary/30 bg-accent/40 px-3 py-1 text-accent-foreground hover:bg-accent"
              >
                @{u}
              </Link>
            ))}
          </div>
        )}

        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-primary" /> No signup</span>
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-primary" /> Public data only</span>
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-primary" /> PDF in one click</span>
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-primary" /> 100% transparent scoring</span>
        </div>
      </motion.main>

      {/* LIVE STATS STRIP */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile icon={<Activity className="size-4" />} value={12} suffix="+" label="Signals scored" />
          <StatTile icon={<GitBranch className="size-4" />} value={6} label="Top repos audited" />
          <StatTile icon={<TrendingUp className="size-4" />} value={90} suffix="d" label="Career roadmap" />
          <StatTile icon={<FileText className="size-4" />} value={1} label="One-click PDF" />
        </div>
      </section>

      {/* DRAGGABLE PLAYGROUND */}
      <DraggablePlayground />

      {/* INTERACTIVE PREVIEW TABS */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-16">

        <SectionHeader eyebrow="Live preview" title="A peek inside the report" subtitle="Tap a tab to see what each module looks like." />

        <div className="mt-10 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Report previews">
          {(
            [
              { id: "overview", label: "Overview", icon: <Gauge className="size-3.5" aria-hidden="true" /> },
              { id: "repos", label: "Repositories", icon: <GitBranch className="size-3.5" aria-hidden="true" /> },
              { id: "career", label: "Career", icon: <Briefcase className="size-3.5" aria-hidden="true" /> },
              { id: "roadmap", label: "Roadmap", icon: <CalendarRange className="size-3.5" aria-hidden="true" /> },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              id={`tab-${t.id}`}
              role="tab"
              aria-selected={activeTab === t.id}
              aria-controls={`tabpanel-${t.id}`}
              onClick={() => setActiveTab(t.id)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold transition cursor-pointer ${
                activeTab === t.id
                  ? "border-primary/40 bg-primary text-primary-foreground shadow-glow"
                  : "bg-card/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          id={`tabpanel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="glass mt-6 rounded-3xl p-6 shadow-card sm:p-10"
        >
          {activeTab === "overview" && <PreviewOverview />}
          {activeTab === "repos" && <PreviewRepos />}
          {activeTab === "career" && <PreviewCareer />}
          {activeTab === "roadmap" && <PreviewRoadmap />}
        </motion.div>
      </section>

      {/* FEATURE GRID */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        <SectionHeader
          eyebrow="What you get"
          title="Everything a recruiter checks — in one report"
          subtitle="Each module is rendered live on the audit dashboard and included in the exportable PDF."
        />

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05}>
              <FeatureCard {...f} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        <SectionHeader eyebrow="How it works" title="From username to full report in seconds" />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1}>
              <StepCard {...s} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* REPORT BREAKDOWN */}
      <section id="report" className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        <SectionHeader
          eyebrow="The report"
          title="Six modules. One source of truth."
          subtitle="Every module appears on the live dashboard and inside the downloadable PDF."
        />

        <div className="mt-12 grid gap-3 md:grid-cols-2">
          <ReportRow icon={<PieChart className="size-4" />} label="Overview" desc="Profile header, top stats, language mix and portfolio radar." />
          <ReportRow icon={<GitBranch className="size-4" />} label="Repositories" desc="Sorted repo list with health scoring and suggestions." />
          <ReportRow icon={<ShieldCheck className="size-4" />} label="Health & ATS" desc="ATS-style score with signal breakdown and recruiter view." />
          <ReportRow icon={<Briefcase className="size-4" />} label="Career roles" desc="Role-by-role match with strengths and gaps." />
          <ReportRow icon={<Building2 className="size-4" />} label="Company fit" desc="Service vs product hiring rubric with reasons." />
          <ReportRow icon={<CalendarRange className="size-4" />} label="30/60/90 roadmap" desc="Week-by-week tasks tied to your real weak spots." />
        </div>

        <Reveal>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border bg-card/60 p-6 backdrop-blur sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                <Download className="size-5" />
              </div>
              <div>
                <p className="font-display text-base font-semibold">Exportable PDF report</p>
                <p className="text-sm text-muted-foreground">Editorial layout, colorful charts, recruiter-ready in one click.</p>
              </div>
            </div>
            <Button
              className="gap-2 hover-scale cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Audit a profile <ArrowRight className="size-4" />
            </Button>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 mx-auto max-w-4xl px-6 py-16">
        <SectionHeader eyebrow="FAQ" title="Good to know" />
        <div className="mt-10 grid gap-3">
          <Faq q="Do you store my data?" a="No. Audits run on-demand against the public GitHub API and are cached briefly in memory only." />
          <Faq q="Why does scoring look different from other tools?" a="Every point is tied to a real signal (README, license, CI, releases, deployment, contributors). You can audit our scoring on the Health tab." />
          <Faq q="Will it work on any user?" a="Any public GitHub profile. Private repos are intentionally excluded." />
          <Faq q="Is the PDF the same as the dashboard?" a="Yes — same data, same modules, formatted for print and sharing with recruiters." />
        </div>
      </section>

      <footer className="relative z-10 border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} GitAnalyze AI. Built on the public GitHub API.</p>
          <div className="flex items-center gap-4">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Reveal wrapper ---------- */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Animated counter ---------- */
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

function StatTile({
  icon, value, suffix = "", label,
}: { icon: React.ReactNode; value: number; suffix?: string; label: string }) {
  return (
    <Reveal>
      <div className="glass group flex items-center gap-3 rounded-2xl p-4 transition hover:-translate-y-0.5 hover:border-primary/40">
        <div className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground transition group-hover:scale-110">
          {icon}
        </div>
        <div>
          <p className="font-display text-2xl font-bold leading-none">
            <Counter to={value} />
            {suffix}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------- Preview tab content ---------- */
function PreviewOverview() {
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
          <motion.div initial={{ width: 0 }} animate={{ width: "82%" }} transition={{ duration: 1.2, ease: "easeOut" }} className="h-full rounded-full bg-primary" />
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
            <RPieChart>
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
            </RPieChart>
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

function MiniStat({ label, v }: { label: string; v: number }) {
  return (
    <div className="rounded-xl border bg-background/40 p-3">
      <p className="font-display text-lg font-bold"><Counter to={v} /></p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

/* ---------- Draggable interactive playground ---------- */
function DraggablePlayground() {
  const constraints = useRef<HTMLDivElement>(null);
  const [activity, setActivity] = useState(() =>
    Array.from({ length: 16 }, (_, i) => ({ d: `W${i + 1}`, commits: 8 + Math.round(Math.sin(i / 2) * 6 + Math.random() * 10) })),
  );
  const [score, setScore] = useState(72);

  // gently animate the chart so it feels alive
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
            <div className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground shrink-0"><ShieldCheck className="size-5" /></div>
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
            <div className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground shrink-0"><Star className="size-5" /></div>
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
            <div className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground shrink-0"><CalendarRange className="size-5" /></div>
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


function PreviewRepos() {
  const repos = [
    { name: "next-auth-kit", health: 94, stars: 421, lang: "TypeScript" },
    { name: "fast-cache", health: 88, stars: 318, lang: "Go" },
    { name: "vector-db", health: 81, stars: 254, lang: "Rust" },
    { name: "ml-pipeline", health: 72, stars: 188, lang: "Python" },
  ];
  return (
    <div className="grid gap-3">
      {repos.map((r, i) => (
        <motion.div
          key={r.name}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className="flex items-center gap-4 rounded-xl border bg-background/40 p-4 transition hover:border-primary/40"
        >
          <GitBranch className="size-4 text-muted-foreground" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm font-semibold">{r.name}</p>
              <span className="rounded border px-1.5 py-0.5 text-[10px] text-muted-foreground">{r.lang}</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div initial={{ width: 0 }} animate={{ width: `${r.health}%` }} transition={{ duration: 0.8, delay: i * 0.06 }} className="h-full rounded-full bg-primary" />
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="size-3" /> {r.stars}
          </div>
          <span className="font-display text-sm font-bold tabular-nums">{r.health}%</span>
        </motion.div>
      ))}
    </div>
  );
}

function PreviewCareer() {
  const roles = [
    { name: "Frontend", match: 88 },
    { name: "Full-Stack", match: 81 },
    { name: "Backend", match: 64 },
    { name: "DevOps", match: 49 },
    { name: "ML", match: 32 },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {roles.map((r, i) => (
        <motion.div
          key={r.name}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="rounded-xl border bg-background/40 p-4"
        >
          <div className="flex items-center justify-between">
            <p className="font-display font-semibold">{r.name}</p>
            <span className="font-mono text-sm">{r.match}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div initial={{ width: 0 }} animate={{ width: `${r.match}%` }} transition={{ duration: 0.9 }} className="h-full rounded-full bg-primary" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function PreviewRoadmap() {
  const phases = [
    { tag: "30 days", color: "var(--chart-1)", items: ["Add README + license to 3 repos", "Ship CI for top 2 projects", "Pin 6 best repos"] },
    { tag: "60 days", color: "var(--chart-3)", items: ["Publish first npm release", "Deploy 1 project + add badge", "Open 5 PRs to OSS"] },
    { tag: "90 days", color: "var(--chart-5)", items: ["Launch portfolio site", "Write 2 technical posts", "Reach 85+ ATS score"] },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {phases.map((p, i) => (
        <motion.div
          key={p.tag}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-2xl border bg-background/40 p-5"
        >
          <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: p.color }}>{p.tag}</span>
          <ul className="mt-3 space-y-2 text-sm">
            {p.items.map((it) => (
              <li key={it} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                <span className="text-muted-foreground">{it}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- shared ---------- */
const FEATURES = [
  { icon: <Gauge className="size-5" />, tag: "Overview", title: "Profile snapshot & key stats", body: "Followers, public repos, total stars, top languages and a portfolio strength gauge — at a glance.", bullets: ["Avatar, bio, location, links", "Language distribution chart", "Stars / forks aggregated"] },
  { icon: <GitBranch className="size-5" />, tag: "Repositories", title: "Per-repo health audit", body: "Every non-fork repo scored on README, license, topics, CI, releases, deployment and contributor signal.", bullets: ["Health % per repo", "Pass/fail breakdown", "Targeted suggestions"] },
  { icon: <Activity className="size-5" />, tag: "Health & ATS", title: "ATS-style portfolio score", body: "A transparent ATS score showing exactly which signals you have and which you're missing for recruiter screens.", bullets: ["Score + potential", "Signal-by-signal grading", "Recruiter readiness"] },
  { icon: <Briefcase className="size-5" />, tag: "Career", title: "Role fit & matching", body: "Match your GitHub footprint to roles like Frontend, Backend, Full-Stack, DevOps, ML — with strengths and gaps.", bullets: ["Role match %", "Top strengths", "Concrete gaps to close"] },
  { icon: <Building2 className="size-5" />, tag: "Companies", title: "Service vs product fit", body: "A rubric for both service-based and product-based hiring — see where you land and why.", bullets: ["Tiered scoring", "Reasons + gaps", "Per-company breakdown"] },
  { icon: <CalendarRange className="size-5" />, tag: "Roadmap", title: "30 / 60 / 90 day plan", body: "A week-by-week action plan generated from your real weaknesses — not generic advice.", bullets: ["Personalized tasks", "Phased delivery", "ATS uplift target"] },
];

const STEPS = [
  { n: 1, icon: <Github className="size-5" />, title: "Paste a profile", body: "Drop in a GitHub username or full profile URL. No login, no install." },
  { n: 2, icon: <Zap className="size-5" />, title: "We audit live", body: "We call the GitHub REST API for the user, every repo, languages, releases, CI workflows and contributors." },
  { n: 3, icon: <Users className="size-5" />, title: "Read + export", body: "Browse the interactive dashboard, then export a multi-page PDF report you can share with recruiters." },
];

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <Reveal>
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
      </div>
    </Reveal>
  );
}

function FeatureCard({
  icon, tag, title, body, bullets,
}: { icon: React.ReactNode; tag: string; title: string; body: string; bullets: string[] }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="glass group relative flex h-full flex-col rounded-2xl p-6 transition hover:border-primary/40 hover:shadow-glow"
    >
      <div className="flex items-center justify-between">
        <div className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground transition group-hover:scale-110 group-hover:rotate-3">{icon}</div>
        <span className="rounded-full border bg-background/60 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{tag}</span>
      </div>
      <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
      <ul className="mt-4 space-y-1.5 text-sm">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <span className="text-muted-foreground">{b}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function StepCard({ n, icon, title, body }: { n: number; icon: React.ReactNode; title: string; body: string }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass relative rounded-2xl p-6 transition hover:border-primary/40 hover:shadow-glow">
      <div className="flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-full border bg-background/60 font-mono text-xs font-semibold">{n}</span>
        <div className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">{icon}</div>
      </div>
      <h3 className="mt-4 font-display text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </motion.div>
  );
}

function ReportRow({ icon, label, desc }: { icon: React.ReactNode; label: string; desc: string }) {
  return (
    <Reveal>
      <div className="flex items-start gap-3 rounded-xl border bg-card/60 p-4 transition hover:-translate-y-0.5 hover:border-primary/40">
        <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">{icon}</div>
        <div>
          <p className="font-display text-sm font-semibold">{label}</p>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>
    </Reveal>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-xl border bg-card/60 p-4 open:bg-card open:shadow-card">
      <summary className="flex cursor-pointer items-center justify-between font-display text-sm font-semibold">
        {q}
        <span className="text-muted-foreground transition group-open:rotate-45" aria-hidden="true">+</span>
      </summary>
      <p className="mt-2 text-sm text-muted-foreground">{a}</p>
    </details>
  );
}
