import { motion } from "framer-motion";

export default function PreviewCareer() {
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
