import type { AuditResult } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Users, GitFork, Star, BookMarked } from "lucide-react";
import { motion } from "framer-motion";

export function StatGrid({ audit }: { audit: AuditResult }) {
  const totalStars = audit.repos.reduce((a, b) => a + b.repo.stargazers_count, 0);
  const totalForks = audit.repos.reduce((a, b) => a + b.repo.forks_count, 0);

  const stats = [
    { label: "Public repos", value: audit.user.public_repos, icon: <BookMarked className="size-4" /> },
    { label: "Stars received", value: totalStars, icon: <Star className="size-4" /> },
    { label: "Forks", value: totalForks, icon: <GitFork className="size-4" /> },
    { label: "Followers", value: audit.user.followers, icon: <Users className="size-4" /> },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Card className="glass p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <span className="text-muted-foreground" aria-hidden="true">{s.icon}</span>
            </div>
            <div className="mt-3 font-display text-3xl font-bold tabular-nums">
              {s.value.toLocaleString()}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
