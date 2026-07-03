import { GitBranch, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function PreviewRepos() {
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
          <GitBranch className="size-4 text-muted-foreground" aria-hidden="true" />
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
            <Star className="size-3" aria-hidden="true" /> {r.stars}
          </div>
          <span className="font-display text-sm font-bold tabular-nums">{r.health}%</span>
        </motion.div>
      ))}
    </div>
  );
}
