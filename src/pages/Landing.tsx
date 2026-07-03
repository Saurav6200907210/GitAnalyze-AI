import { Link, useNavigate } from "react-router-dom";
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
import { useEffect, useMemo, useRef, useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";

const DraggablePlayground = lazy(() => import("@/components/landing/draggable-playground"));
const PreviewOverview = lazy(() => import("@/components/landing/preview-overview"));
const PreviewRepos = lazy(() => import("@/components/landing/preview-repos"));
const PreviewCareer = lazy(() => import("@/components/landing/preview-career"));
const PreviewRoadmap = lazy(() => import("@/components/landing/preview-roadmap"));

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
          <div className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
            <Sparkles className="size-4" />
          </div>
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
      <main className="relative z-10 mx-auto max-w-5xl px-6 pt-12 pb-20 text-center sm:pt-20">
        <div className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
          </span>
          Real GitHub API — no fake scores, no mock data
        </div>

        <h1 className="mt-6 font-display text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
          <span className="text-gradient">GitHub Portfolio</span>
          <br />
          Intelligence, on demand.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
          Paste a GitHub profile. We audit every repository, score documentation,
          deployment, CI and contribution health, match you to roles and companies,
          and ship a 30/60/90 roadmap plus an exportable PDF report.
        </p>

        <form
          onSubmit={submit}
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
        </form>

        <div className="mx-auto mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
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
        </div>

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
      </main>

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
      <Suspense fallback={<div className="mt-10 h-[390px] w-full rounded-3xl border bg-card/10 animate-pulse flex items-center justify-center text-sm text-muted-foreground">Loading interactive playground...</div>}>
        <DraggablePlayground />
      </Suspense>

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

        <div
          key={activeTab}
          id={`tabpanel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="glass mt-6 rounded-3xl p-6 shadow-card sm:p-10 min-h-[300px]"
        >
          <Suspense fallback={<div className="h-48 w-full animate-pulse flex items-center justify-center text-sm text-muted-foreground">Loading preview...</div>}>
            {activeTab === "overview" && <PreviewOverview />}
            {activeTab === "repos" && <PreviewRepos />}
            {activeTab === "career" && <PreviewCareer />}
            {activeTab === "roadmap" && <PreviewRoadmap />}
          </Suspense>
        </div>
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
function Reveal({ children }: { children: React.ReactNode; delay?: number }) {
  return <div>{children}</div>;
}

/* ---------- Animated counter ---------- */
function Counter({ to, duration = 1.2 }: { to: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = to;
    if (start === end) {
      setCount(end);
      return;
    }
    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 12);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / 60); // increment proportionally for high numbers
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(start);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [to, duration]);

  return <span>{count}</span>;
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
    <div
      className="glass group relative flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow"
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
    </div>
  );
}

function StepCard({ n, icon, title, body }: { n: number; icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="glass relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow">
      <div className="flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-full border bg-background/60 font-mono text-xs font-semibold">{n}</span>
        <div className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">{icon}</div>
      </div>
      <h3 className="mt-4 font-display text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
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
