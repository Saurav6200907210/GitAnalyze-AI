import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function PreviewRoadmap() {
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
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
                <span className="text-muted-foreground">{it}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}
