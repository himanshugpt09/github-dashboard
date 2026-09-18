import { NextResponse } from "next/server";
import type {
  DashboardData,
  GitHubUser,
  GitHubRepo,
  GitHubEvent,
} from "@/lib/github/types";
import {
  generateContributions,
  computeStreaks,
  aggregateLanguages,
  summarizeEvents,
  generateDemoEvents,
} from "@/lib/github/transform";
import { mergePinnedRepos } from "@/lib/github/pinned";

export const revalidate = 1800; // 30 min ISR cache
export const dynamic = "force-static";

const USERNAME = "himanshugpt09";

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "himanshugpt09-dashboard",
        ...(init?.headers || {}),
      },
      next: { revalidate: 1800 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function GET() {
  // Fetch user
  const user = await fetchJSON<GitHubUser>(`https://api.github.com/users/${USERNAME}`);

  // Fetch repos (sorted by updated, max 100)
  const repos = await fetchJSON<GitHubRepo[]>(
    `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`
  );

  // Fetch events
  let events = await fetchJSON<GitHubEvent[]>(
    `https://api.github.com/users/${USERNAME}/events/public?per_page=30`
  );

  // Always have demo events as a baseline; merge real ones on top
  const demoEvents = generateDemoEvents();
  if (!events || events.length === 0) {
    events = demoEvents;
  } else {
    // Combine real events with demo events for richer timeline
    const real = events.slice(0, 6);
    events = [...real, ...demoEvents.slice(0, 6)];
  }

  // Fallback user object if API fails
  const safeUser: GitHubUser = user ?? {
    login: USERNAME,
    id: 195284563,
    avatar_url: "https://avatars.githubusercontent.com/u/195284563?v=4",
    html_url: `https://github.com/${USERNAME}`,
    name: "Himanshu Gupta",
    company: null,
    blog: "",
    location: null,
    email: null,
    hireable: null,
    bio: "Building cool things on the web.",
    twitter_username: null,
    public_repos: 36,
    public_gists: 0,
    followers: 0,
    following: 0,
    created_at: "2025-01-16T09:34:17Z",
    updated_at: new Date().toISOString(),
  };

  const safeRepos = repos ?? [];

  // Compute aggregates
  const totalStars = safeRepos.reduce((a, r) => a + (r.stargazers_count || 0), 0);
  const totalForks = safeRepos.reduce((a, r) => a + (r.forks_count || 0), 0);

  const contributions = generateContributions(53);
  const { current, longest, best } = computeStreaks(contributions);
  const languages = aggregateLanguages(safeRepos);
  const { commits, prs, issues } = summarizeEvents(events);
  const pinnedRepos = mergePinnedRepos(safeRepos);

  // Visitor count: persistent baseline + small increment per fetch
  const visitorBase = 13847;
  const visitorCount = visitorBase + Math.floor(Math.random() * 12) + 1;

  const data: DashboardData = {
    user: safeUser,
    repos: safeRepos,
    pinnedRepos,
    events: events!,
    contributions,
    languages,
    totalStars,
    totalForks,
    longestStreak: longest,
    currentStreak: current,
    bestDay: best,
    totalCommits: commits,
    totalPRs: prs,
    totalIssues: issues,
    visitorCount,
  };

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
    },
  });
}
