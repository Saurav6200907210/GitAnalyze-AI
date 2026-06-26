import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Github, Sparkles, ShieldCheck, BarChart3, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";

function parseUsername(input: string): string | null {
  const v = input.trim();
  if (!v) return null;
  const m = v.match(/github\.com\/([^/?#\s]+)/i);
  if (m) return m[1].replace(/\/$/, "");
  if (/^[a-z0-9](?:[a-z0-9-]{0,38})$/i.test(v)) return v;
  return null;
}

export default function Landing() {
  const [value, setValue] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("gp-recent");
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const u = parseUsername(value);
    if (!u) {
      toast.error("Enter a GitHub username or full URL");
      return;
    }
    const next = [u, ...recent.filter((r) => r !== u)].slice(0, 6);
    try {
      localStorage.setItem("gp-recent", JSON.stringify(next));
    } catch {}
    navigate(`/audit/${u}`);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2 font-display font-bold tracking-tight">
          <div className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </div>
          <span className="text-lg">GitAnalyze AI</span>
        </Link>
        <div className="flex items-center gap-2">
          <a
            href="https://docs.github.com/rest"
            target="_blank"
            rel="noreferrer"
            className="hidden text-sm text-muted-foreground hover:text-foreground md:inline"
          >
            Docs
          </a>
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pt-12 pb-24 text-center sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
        >
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
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
          Paste a GitHub profile URL. We audit every repository, score documentation,
          deployment, CI, and contribution health, then ship a 30/60/90 roadmap to make you hireable.
        </motion.p>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row"
        >
          <div className="glass relative flex flex-1 items-center rounded-xl pl-4">
            <Github className="size-5 shrink-0 text-muted-foreground" />
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="github.com/torvalds  or  torvalds"
              className="border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 gap-2 px-6 text-base font-semibold">
            Audit profile
            <ArrowRight className="size-4" />
          </Button>
        </motion.form>

        {recent.length > 0 && (
          <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>Recent:</span>
            {recent.map((u) => (
              <Link
                key={u}
                to={`/audit/${u}`}
                className="rounded-full border bg-card/60 px-3 py-1 hover:border-primary/40 hover:text-foreground"
              >
                @{u}
              </Link>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-4 text-left sm:grid-cols-3"
        >
          <Feature
            icon={<BarChart3 className="size-5" />}
            title="Transparent scoring"
            body="Every percentage point traces back to a real signal: README, license, CI, releases, deployment."
          />
          <Feature
            icon={<ShieldCheck className="size-5" />}
            title="Career & company fit"
            body="Match against role signatures and a rubric for service- and product-based hiring."
          />
          <Feature
            icon={<FileText className="size-5" />}
            title="Exportable PDF"
            body="One-click enterprise-grade report. Profile, scoreboard, repo audit, and roadmap."
          />
        </motion.div>
      </main>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">{icon}</div>
      <h3 className="mt-4 font-display text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
