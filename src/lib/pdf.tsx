import { Document, Page, Text, View, StyleSheet, Svg, Rect, Line, Circle, Path, G } from "@react-pdf/renderer";
import type { AuditResult } from "./types";

/**
 * Editorial colorful report — white background, emerald primary accent
 * (matches the website), warm multi-hue palette for charts. No blue
 * gradient anywhere.
 */

const INK = "#0a0a0a";
const SUB = "#475569";
const MUTED = "#737373";
const RULE = "#e5e7eb";
const SOFT = "#f5f5f5";

// Brand palette (emerald primary + warm hues; no blue)
const BRAND = "#16a34a";
const BRAND_DEEP = "#15803d";
const BRAND_SOFT = "#dcfce7";
const AMBER = "#f59e0b";
const ROSE = "#e11d48";
const VIOLET = "#7c3aed";
const TEAL = "#0d9488";
const ORANGE = "#ea580c";
const PALETTE = [BRAND, VIOLET, AMBER, ROSE, TEAL, ORANGE];

const styles = StyleSheet.create({
  page: { padding: 44, fontSize: 10, color: INK, fontFamily: "Helvetica", backgroundColor: "#ffffff" },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", borderBottom: 2, borderColor: BRAND, paddingBottom: 8 },
  brand: { fontSize: 9, letterSpacing: 3, fontFamily: "Helvetica-Bold", color: BRAND_DEEP },
  smallMeta: { fontSize: 8, color: MUTED, letterSpacing: 1 },

  coverTitle: { fontSize: 40, fontFamily: "Helvetica-Bold", marginTop: 28, lineHeight: 1.05, letterSpacing: -1, color: INK },
  coverHandle: { fontSize: 12, color: SUB, marginTop: 6 },
  coverBio: { fontSize: 11, color: INK, marginTop: 14, lineHeight: 1.45, maxWidth: "85%" },
  brandStrip: { marginTop: 14, height: 4, backgroundColor: BRAND, width: 80 },

  sectionLabel: { fontSize: 8, letterSpacing: 2, color: BRAND_DEEP, fontFamily: "Helvetica-Bold", marginBottom: 8, textTransform: "uppercase" },
  h2: { fontSize: 18, fontFamily: "Helvetica-Bold", marginBottom: 10, letterSpacing: -0.3, color: INK },
  h3: { fontSize: 11, fontFamily: "Helvetica-Bold", marginTop: 14, marginBottom: 6 },

  statRow: { flexDirection: "row", marginTop: 20, gap: 8 },
  statCard: { flex: 1, padding: 12, borderRadius: 8, borderLeftWidth: 3 },
  statLabel: { fontSize: 7, color: MUTED, letterSpacing: 1.5, textTransform: "uppercase" },
  statValue: { fontSize: 26, fontFamily: "Helvetica-Bold", marginTop: 6, letterSpacing: -1, color: INK },
  statSub: { fontSize: 8, color: MUTED, marginTop: 2 },

  table: { marginTop: 6 },
  thead: { flexDirection: "row", borderBottom: 1, borderColor: INK, paddingBottom: 5 },
  tr: { flexDirection: "row", borderBottom: 1, borderColor: RULE, paddingVertical: 7, alignItems: "center" },
  th: { fontFamily: "Helvetica-Bold", fontSize: 8, letterSpacing: 1, textTransform: "uppercase", color: MUTED },
  td: { fontSize: 9, color: INK },
  c1: { width: "34%" },
  c2: { width: "16%" },
  c3: { width: "10%", textAlign: "right" },
  c4: { width: "16%" },
  c5: { width: "24%" },

  muted: { color: SUB, fontSize: 9, lineHeight: 1.4 },
  pill: { fontSize: 7, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 2, backgroundColor: BRAND_SOFT, color: BRAND_DEEP, fontFamily: "Helvetica-Bold" },

  footer: { position: "absolute", bottom: 24, left: 44, right: 44, flexDirection: "row", justifyContent: "space-between", color: MUTED, fontSize: 8, borderTop: 1, borderColor: RULE, paddingTop: 8 },
});

export function AuditPdf({ audit }: { audit: AuditResult }) {
  const totalStars = audit.repos.reduce((a, b) => a + b.repo.stargazers_count, 0);
  const totalForks = audit.repos.reduce((a, b) => a + b.repo.forks_count, 0);
  const top = [...audit.repos].sort((a, b) => b.healthScore - a.healthScore).slice(0, 12);
  const topLangs = audit.languageStats.slice(0, 6);
  const portfolio = Object.entries(audit.portfolioScores).map(([k, v]) => ({ k: labelFor(k), v }));

  return (
    <Document title={`GitAnalyze AI Audit - ${audit.user.login}`} author="GitAnalyze AI Intelligence">
      {/* COVER */}
      <Page size="A4" style={styles.page}>
        <View style={styles.topRow}>
          <Text style={styles.brand}>GITANALYZE AI • PORTFOLIO INTELLIGENCE REPORT</Text>
          <Text style={styles.smallMeta}>{new Date(audit.fetchedAt).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}</Text>
        </View>

        <Text style={styles.coverTitle}>{audit.user.name || audit.user.login}</Text>
        <Text style={styles.coverHandle}>@{audit.user.login}  ·  github.com/{audit.user.login}</Text>
        <View style={styles.brandStrip} />
        {audit.user.bio && <Text style={styles.coverBio}>{audit.user.bio}</Text>}

        {/* Colorful stat cards */}
        <View style={styles.statRow}>
          <StatCard label="ATS Score" value={String(audit.atsScore.score)} sub={`of 100 · potential ${audit.atsScore.potential}`} color={BRAND} />
          <StatCard label="Repositories" value={String(audit.user.public_repos)} sub={`analysed ${audit.repos.length}`} color={VIOLET} />
          <StatCard label="Total Stars" value={String(totalStars)} sub={`${totalForks} forks`} color={AMBER} />
          <StatCard label="Followers" value={String(audit.user.followers)} sub={`following ${audit.user.following}`} color={ROSE} />
        </View>

        <View style={{ marginTop: 28 }}>
          <Text style={styles.sectionLabel}>Portfolio Quality Index</Text>
          <BarChart data={portfolio} width={507} height={170} />
        </View>

        <View style={{ marginTop: 24, flexDirection: "row", gap: 24 }}>
          <View style={{ width: 220 }}>
            <Text style={styles.sectionLabel}>Language Mix</Text>
            <DonutChart data={topLangs.map((l) => ({ label: l.name, value: l.bytes }))} size={180} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionLabel}>Capability Radar</Text>
            <RadarChart data={portfolio} size={200} />
          </View>
        </View>

        <View style={styles.footer}>
          <Text>GitAnalyze AI Intelligence • Real GitHub API data</Text>
          <Text>Page 1 / 3</Text>
        </View>
      </Page>

      {/* REPO AUDIT */}
      <Page size="A4" style={styles.page}>
        <View style={styles.topRow}>
          <Text style={styles.brand}>REPOSITORY AUDIT</Text>
          <Text style={styles.smallMeta}>@{audit.user.login.toUpperCase()}</Text>
        </View>

        <Text style={[styles.h2, { marginTop: 18 }]}>Top {top.length} repositories</Text>

        <View style={{ marginTop: 4, marginBottom: 14 }}>
          <Text style={styles.sectionLabel}>Repository Health Scores</Text>
          <HBarChart
            data={top.slice(0, 8).map((r) => ({ label: r.repo.name, value: r.healthScore }))}
            width={507}
            rowHeight={18}
            colored
          />
        </View>

        <View style={styles.table}>
          <View style={styles.thead}>
            <Text style={[styles.th, styles.c1]}>Repository</Text>
            <Text style={[styles.th, styles.c2]}>Language</Text>
            <Text style={[styles.th, styles.c3]}>Stars</Text>
            <Text style={[styles.th, styles.c4]}>Health</Text>
            <Text style={[styles.th, styles.c5]}>Top recommendation</Text>
          </View>
          {top.map((r) => (
            <View key={r.repo.id} style={styles.tr}>
              <Text style={[styles.td, styles.c1]}>{r.repo.name}</Text>
              <Text style={[styles.td, styles.c2, { color: SUB }]}>{r.repo.language ?? "—"}</Text>
              <Text style={[styles.td, styles.c3]}>{r.repo.stargazers_count}</Text>
              <View style={styles.c4}>
                <MiniBar value={r.healthScore} />
              </View>
              <Text style={[styles.td, styles.c5, { color: SUB }]}>
                {r.suggestions[0]?.title ?? "Production-ready"}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>GitAnalyze AI Intelligence • @{audit.user.login}</Text>
          <Text>Page 2 / 3</Text>
        </View>
      </Page>

      {/* CAREER + ROADMAP */}
      <Page size="A4" style={styles.page}>
        <View style={styles.topRow}>
          <Text style={styles.brand}>CAREER FIT  ·  ROADMAP</Text>
          <Text style={styles.smallMeta}>@{audit.user.login.toUpperCase()}</Text>
        </View>

        <Text style={[styles.h2, { marginTop: 18 }]}>Role readiness</Text>
        <HBarChart
          data={audit.careerRoles.slice(0, 6).map((r) => ({ label: r.role, value: r.score }))}
          width={507}
          rowHeight={20}
          colored
        />

        <Text style={[styles.h2, { marginTop: 22 }]}>Company fit</Text>
        <View style={styles.table}>
          <View style={styles.thead}>
            <Text style={[styles.th, { width: "40%" }]}>Company</Text>
            <Text style={[styles.th, { width: "15%" }]}>Tier</Text>
            <Text style={[styles.th, { width: "20%" }]}>Score</Text>
            <Text style={[styles.th, { width: "25%" }]}>Key gap</Text>
          </View>
          {audit.companyFit.slice(0, 8).map((c) => (
            <View key={c.company} style={styles.tr}>
              <Text style={[styles.td, { width: "40%" }]}>{c.company}</Text>
              <Text style={[styles.td, { width: "15%", color: SUB }]}>{c.tier}</Text>
              <View style={{ width: "20%" }}>
                <MiniBar value={c.score} />
              </View>
              <Text style={[styles.td, { width: "25%", color: SUB }]}>{c.gaps[0] ?? "—"}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.h2, { marginTop: 22 }]}>30 / 60 / 90 day roadmap</Text>
        {audit.roadmap.map((w, i) => {
          const c = PALETTE[i % PALETTE.length];
          return (
            <View key={w.week} style={{ marginBottom: 10, paddingLeft: 10, borderLeftWidth: 3, borderLeftColor: c }}>
              <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10, color: c }}>
                Week {w.week}  ·  {w.title}
              </Text>
              {w.tasks.map((t, j) => (
                <Text key={j} style={[styles.muted, { marginTop: 2 }]}>—  {t}</Text>
              ))}
            </View>
          );
        })}

        <View style={styles.footer}>
          <Text>GitAnalyze AI Intelligence • @{audit.user.login}</Text>
          <Text>Page 3 / 3</Text>
        </View>
      </Page>
    </Document>
  );
}

/* ─────────────  PRIMITIVES  ───────────── */

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color, backgroundColor: tint(color) }]}>
      <Text style={[styles.statLabel, { color }]}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statSub}>{sub}</Text>
    </View>
  );
}

/* very light tint of a hex color for card background */
function tint(hex: string) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const mix = (c: number) => Math.round(c * 0.08 + 255 * 0.92);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

function BarChart({ data, width, height }: { data: { k: string; v: number }[]; width: number; height: number }) {
  const pad = { l: 0, r: 8, t: 14, b: 28 };
  const cw = width - pad.l - pad.r;
  const ch = height - pad.t - pad.b;
  const n = data.length;
  const gap = 10;
  const bw = (cw - gap * (n - 1)) / n;
  return (
    <Svg width={width} height={height}>
      <Line x1={pad.l} y1={pad.t + ch} x2={pad.l + cw} y2={pad.t + ch} stroke={INK} strokeWidth={1} />
      {[25, 50, 75, 100].map((g) => (
        <Line key={g} x1={pad.l} y1={pad.t + ch - (ch * g) / 100} x2={pad.l + cw} y2={pad.t + ch - (ch * g) / 100} stroke={RULE} strokeWidth={0.5} />
      ))}
      {data.map((d, i) => {
        const h = (ch * d.v) / 100;
        const x = pad.l + i * (bw + gap);
        const y = pad.t + ch - h;
        const c = PALETTE[i % PALETTE.length];
        return (
          <G key={d.k}>
            <Rect x={x} y={y} width={bw} height={h} fill={c} rx={2} />
            <Text x={x + bw / 2} y={y - 4} style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: c }}>
              {d.v}
            </Text>
            <Text x={x + bw / 2} y={pad.t + ch + 12} style={{ fontSize: 7, color: SUB }}>
              {truncate(d.k, 14)}
            </Text>
          </G>
        );
      })}
    </Svg>
  );
}

function HBarChart({ data, width, rowHeight, colored }: { data: { label: string; value: number }[]; width: number; rowHeight: number; colored?: boolean }) {
  const labelW = 130;
  const valueW = 30;
  const trackW = width - labelW - valueW - 8;
  const height = data.length * rowHeight + 4;
  return (
    <Svg width={width} height={height}>
      {data.map((d, i) => {
        const y = i * rowHeight + rowHeight / 2;
        const w = (trackW * Math.max(0, Math.min(100, d.value))) / 100;
        const c = colored ? PALETTE[i % PALETTE.length] : BRAND;
        return (
          <G key={d.label + i}>
            <Text x={0} y={y + 3} style={{ fontSize: 9 }}>
              {truncate(d.label, 22)}
            </Text>
            <Rect x={labelW} y={y - 5} width={trackW} height={8} fill={SOFT} rx={2} />
            <Rect x={labelW} y={y - 5} width={w} height={8} fill={c} rx={2} />
            <Text x={labelW + trackW + 6} y={y + 3} style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: c }}>
              {d.value}
            </Text>
          </G>
        );
      })}
    </Svg>
  );
}

function MiniBar({ value }: { value: number }) {
  const w = 80;
  const fill = (w * Math.max(0, Math.min(100, value))) / 100;
  const c = value >= 75 ? BRAND : value >= 50 ? AMBER : ROSE;
  return (
    <Svg width={w + 28} height={12}>
      <Rect x={0} y={3} width={w} height={6} fill={SOFT} rx={2} />
      <Rect x={0} y={3} width={fill} height={6} fill={c} rx={2} />
      <Text x={w + 4} y={9} style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: c }}>
        {value}
      </Text>
    </Svg>
  );
}

function DonutChart({ data, size }: { data: { label: string; value: number }[]; size: number }) {
  const total = data.reduce((a, b) => a + b.value, 0) || 1;
  const r = size / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;
  const inner = r * 0.6;
  let a0 = -Math.PI / 2;
  return (
    <Svg width={size} height={size + data.length * 12 + 8}>
      {data.map((d, i) => {
        const frac = d.value / total;
        const a1 = a0 + frac * Math.PI * 2;
        const large = frac > 0.5 ? 1 : 0;
        const x0 = cx + r * Math.cos(a0);
        const y0 = cy + r * Math.sin(a0);
        const x1 = cx + r * Math.cos(a1);
        const y1 = cy + r * Math.sin(a1);
        const xi1 = cx + inner * Math.cos(a1);
        const yi1 = cy + inner * Math.sin(a1);
        const xi0 = cx + inner * Math.cos(a0);
        const yi0 = cy + inner * Math.sin(a0);
        const dPath = `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} L ${xi1} ${yi1} A ${inner} ${inner} 0 ${large} 0 ${xi0} ${yi0} Z`;
        a0 = a1;
        return <Path key={d.label} d={dPath} fill={PALETTE[i % PALETTE.length]} />;
      })}
      <Circle cx={cx} cy={cy} r={inner - 2} fill="#ffffff" />
      <Text x={cx - 18} y={cy + 2} style={{ fontSize: 9, fontFamily: "Helvetica-Bold" }}>
        {data.length} langs
      </Text>
      {data.map((d, i) => (
        <G key={"l" + d.label}>
          <Rect x={0} y={size + 4 + i * 12} width={8} height={8} fill={PALETTE[i % PALETTE.length]} rx={1} />
          <Text x={14} y={size + 11 + i * 12} style={{ fontSize: 8 }}>
            {d.label}  {Math.round((d.value / total) * 100)}%
          </Text>
        </G>
      ))}
    </Svg>
  );
}

function RadarChart({ data, size }: { data: { k: string; v: number }[]; size: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 24;
  const n = data.length;
  const angle = (i: number) => -Math.PI / 2 + (i * Math.PI * 2) / n;
  const pt = (i: number, v: number) => {
    const rr = (r * v) / 100;
    return [cx + rr * Math.cos(angle(i)), cy + rr * Math.sin(angle(i))] as const;
  };
  const poly = data.map((d, i) => pt(i, d.v));
  const path = poly.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ") + " Z";
  return (
    <Svg width={size} height={size}>
      {[0.25, 0.5, 0.75, 1].map((s) => (
        <Circle key={s} cx={cx} cy={cy} r={r * s} stroke={RULE} strokeWidth={0.5} fill="none" />
      ))}
      {data.map((d, i) => {
        const [x, y] = pt(i, 100);
        return <Line key={"sp" + i} x1={cx} y1={cy} x2={x} y2={y} stroke={RULE} strokeWidth={0.5} />;
      })}
      <Path d={path} fill={BRAND} fillOpacity={0.18} stroke={BRAND} strokeWidth={1.4} />
      {poly.map((p, i) => (
        <Circle key={"pt" + i} cx={p[0]} cy={p[1]} r={2.2} fill={BRAND_DEEP} />
      ))}
      {data.map((d, i) => {
        const [x, y] = pt(i, 118);
        return (
          <Text key={"lb" + i} x={x - 24} y={y + 3} style={{ fontSize: 7, color: SUB }}>
            {truncate(d.k, 14)}
          </Text>
        );
      })}
    </Svg>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function labelFor(k: string) {
  return (
    {
      portfolioStrength: "Strength",
      documentation: "Docs",
      openSource: "OSS",
      recruiter: "Recruiter",
      diversity: "Diversity",
      consistency: "Consistency",
    } as Record<string, string>
  )[k] ?? k;
}
