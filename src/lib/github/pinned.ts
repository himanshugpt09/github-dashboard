import type { GitHubRepo } from "./types";

/**
 * Pinned repositories for himanshugpt09, fetched from the public profile HTML.
 * GitHub's REST API does not expose pinned repos — only the GraphQL API does,
 * and that requires auth. So we hardcode the pinned list here, then enrich
 * each entry with live data (stars, forks, language) from the REST API at
 * runtime via /api/github.
 *
 * Curated descriptions + tech tags give visitors instant context, since most
 * of these repos have no README description set on GitHub.
 */
export const PINNED_REPO_NAMES: string[] = [
  "Auto-PPT",
  "Data_analyst_agent-2.0",
  "LLM-Agent-Browser-Based",
  "marimo-notebook",
  "marp-slides",
  "RAWGraphs-Visualization-Market-Research-Analytics",
];

type PinnedMeta = {
  description: string;
  tags: string[];
  /** Accent color (used for card glow + icon background). */
  accent: string;
  /** Short label shown on the icon (max 4 chars). */
  short: string;
};

export const PINNED_REPO_META: Record<string, PinnedMeta> = {
  "Auto-PPT": {
    description:
      "AI-powered presentation generator — turn a topic or markdown outline into a styled slide deck automatically. Deploys to Vercel.",
    tags: ["Python", "AI", "Slides", "Automation"],
    accent: "#a855f7",
    short: "PPT",
  },
  "Data_analyst_agent-2.0": {
    description:
      "Autonomous data-analyst agent that ingests CSVs, asks clarifying questions, runs pandas/numpy analysis, and produces a written report.",
    tags: ["Python", "Pandas", "NumPy", "Agents"],
    accent: "#22d3ee",
    short: "DA2",
  },
  "LLM-Agent-Browser-Based": {
    description:
      "In-browser LLM agent that can browse, click, and reason about pages without a backend — pure client-side orchestration.",
    tags: ["JavaScript", "LLM", "Browser", "Agent"],
    accent: "#f472b6",
    short: "LLM",
  },
  "marimo-notebook": {
    description:
      "Reactive Python notebooks (marimo) — every cell re-runs on dependency change, like a spreadsheet for data science.",
    tags: ["Python", "Notebook", "Reactive"],
    accent: "#4ade80",
    short: "MO",
  },
  "marp-slides": {
    description:
      "Markdown → presentation slides via MARP. Write once in MD, export to PDF/HTML/PPTX with consistent theming.",
    tags: ["Markdown", "Slides", "Marp"],
    accent: "#facc15",
    short: "Marp",
  },
  "RAWGraphs-Visualization-Market-Research-Analytics": {
    description:
      "Market research analytics pipeline that consumes survey data and produces publication-ready charts via RAWGraphs.",
    tags: ["Visualization", "Analytics", "RAWGraphs"],
    accent: "#fb923c",
    short: "RAW",
  },
};

// tiny string-hash fallback for ids
function strHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/**
 * Merge live repo data (from GitHub REST API) with the curated meta above.
 * Falls back to meta-only if live data is missing (rate limit, etc.).
 */
export function mergePinnedRepos(liveRepos: GitHubRepo[]) {
  return PINNED_REPO_NAMES.map((name) => {
    const live = liveRepos.find((r) => r.name === name);
    const meta = PINNED_REPO_META[name];
    return {
      id: live?.id ?? strHash(name),
      name,
      full_name: `himanshugpt09/${name}`,
      html_url: live?.html_url ?? `https://github.com/himanshugpt09/${name}`,
      description: meta?.description ?? live?.description ?? "",
      fork: live?.fork ?? false,
      language: live?.language ?? null,
      stargazers_count: live?.stargazers_count ?? 0,
      forks_count: live?.forks_count ?? 0,
      watchers_count: live?.watchers_count ?? 0,
      open_issues_count: live?.open_issues_count ?? 0,
      topics: live?.topics?.length ? live.topics : meta?.tags ?? [],
      created_at: live?.created_at ?? "2025-08-01T00:00:00Z",
      updated_at: live?.updated_at ?? "2025-08-20T00:00:00Z",
      pushed_at: live?.pushed_at ?? "2025-08-20T00:00:00Z",
      size: live?.size ?? 0,
      default_branch: live?.default_branch ?? "main",
      homepage: live?.homepage ?? null,
      // Curated extras
      tags: meta?.tags ?? [],
      accent: meta?.accent ?? "#7d8590",
      short: meta?.short ?? name.slice(0, 3).toUpperCase(),
    };
  });
}

// remove the dangling declaration
export type PinnedRepo = ReturnType<typeof mergePinnedRepos>[number];
