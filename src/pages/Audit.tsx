import { Link, useParams, useNavigate } from "react-router-dom";
import { useAudit } from "@/hooks/useAudit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, RefreshCw } from "lucide-react";
import { ProfileHeader } from "@/components/audit/profile-header";
import { StatGrid } from "@/components/audit/stat-grid";
import { RepoList } from "@/components/audit/repo-list";
import { AtsCard } from "@/components/audit/ats-card";
import { CareerRoles } from "@/components/audit/career-roles";
import { CompanyFit } from "@/components/audit/company-fit";
import { Roadmap } from "@/components/audit/roadmap";
import { ChartsGrid, HealthRadarCard } from "@/components/audit/charts";
import { PortfolioScores } from "@/components/audit/portfolio-scores";
import { PdfExportButton } from "@/components/audit/pdf-export";
import { DashboardSkeleton } from "@/components/audit/skeleton";

function AuditError({ error, reset }: { error: Error; reset: () => void }) {
  const navigate = useNavigate();
  const msg = error.message;
  const friendly =
    msg === "NOT_FOUND"
      ? "That GitHub user doesn't exist."
      : msg === "RATE_LIMITED"
        ? "GitHub API rate limit hit. Add a GITHUB_TOKEN secret to lift the limit, or wait an hour."
        : "We couldn't load this profile.";
  return (
    <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
      <div className="max-w-md">
        <h1 className="font-display text-2xl font-bold">Audit failed</h1>
        <p className="mt-2 text-muted-foreground">{friendly}</p>
        <p className="mt-2 font-mono text-xs text-muted-foreground/70">{msg}</p>
        <div className="mt-6 flex justify-center gap-2">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            <Link to="/">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AuditPage() {
  const { username } = useParams<{ username: string }>();
  const { data, loading, error } = useAudit(username);

  if (error) {
    return <AuditError error={error} reset={() => window.location.reload()} />;
  }

  if (loading || !data) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 font-display font-bold tracking-tight">
              <div className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
                <Sparkles className="size-3.5" />
              </div>
              <span>GitAnalyze AI</span>
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="font-mono text-sm">@{data.user.login}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/"><ArrowLeft className="size-4" /> New audit</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={async () => {
              try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
                await fetch(`${API_BASE_URL}/api/github/refresh/${data.user.login}`, { method: 'POST' });
              } catch(e) {}
              window.location.reload();
            }}>
              <RefreshCw className="size-4" /> Refresh
            </Button>
            <PdfExportButton audit={data} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        <ProfileHeader user={data.user} fetchedAt={data.fetchedAt} rateLimit={data.rateLimit} />
        <StatGrid audit={data} />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="repositories">Repositories</TabsTrigger>
            <TabsTrigger value="health">Health & ATS</TabsTrigger>
            <TabsTrigger value="career">Career</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2"><ChartsGrid audit={data} /></div>
              <HealthRadarCard scores={data.portfolioScores} />
            </div>
            <PortfolioScores scores={data.portfolioScores} />
          </TabsContent>

          <TabsContent value="repositories"><RepoList repos={data.repos} /></TabsContent>

          <TabsContent value="health" className="space-y-6">
            <AtsCard ats={data.atsScore} />
            <PortfolioScores scores={data.portfolioScores} />
          </TabsContent>

          <TabsContent value="career"><CareerRoles roles={data.careerRoles} /></TabsContent>
          <TabsContent value="companies"><CompanyFit fit={data.companyFit} /></TabsContent>
          <TabsContent value="roadmap"><Roadmap weeks={data.roadmap} ats={data.atsScore} /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
