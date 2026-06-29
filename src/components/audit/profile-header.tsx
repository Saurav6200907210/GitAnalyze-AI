import type { GhUser } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { MapPin, Link as LinkIcon, Calendar, Twitter, Building2 } from "lucide-react";
import { motion } from "framer-motion";

export function ProfileHeader({
  user,
  fetchedAt,
  rateLimit,
}: {
  user: GhUser;
  fetchedAt: string;
  rateLimit: { remaining: number; limit: number };
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="overflow-hidden p-0">
        <div className="h-24 bg-gradient-to-br from-primary/30 via-chart-2/20 to-chart-5/20" />
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <Avatar className="-mt-16 size-24 border-4 border-card shadow-xl">
              <AvatarImage src={user.avatar_url} alt={user.login} />
              <AvatarFallback>{user.login[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-display text-2xl font-bold leading-tight">
                {user.name || user.login}
              </h1>
              <a
                href={user.html_url}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-sm text-muted-foreground hover:text-foreground"
              >
                @{user.login}
              </a>
              {user.bio && (
                <p className="mt-2 max-w-2xl text-sm text-foreground/80">{user.bio}</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {user.company && (
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="size-3.5" /> {user.company}
                  </span>
                )}
                {user.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" /> {user.location}
                  </span>
                )}
                {user.blog && (
                  <a
                    href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    <LinkIcon className="size-3.5" /> {user.blog.replace(/^https?:\/\//, "")}
                  </a>
                )}
                {user.twitter_username && (
                  <span className="inline-flex items-center gap-1">
                    <Twitter className="size-3.5" /> @{user.twitter_username}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3.5" /> Joined {new Date(user.created_at).getFullYear()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 text-xs text-muted-foreground">
            <span>Audited {new Date(fetchedAt).toLocaleString()}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
