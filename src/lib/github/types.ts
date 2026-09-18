export type GitHubUser = {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
};

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  default_branch: string;
  homepage: string | null;
};

export type GitHubEvent = {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload: {
    action?: string;
    commits?: Array<{ message: string; sha: string }>;
    pull_request?: { title: string; html_url: string };
    issue?: { title: string; html_url: string };
  };
};

export type ContributionDay = {
  date: string;   // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type DashboardData = {
  user: GitHubUser;
  repos: GitHubRepo[];
  events: GitHubEvent[];
  contributions: ContributionDay[];
  languages: { name: string; bytes: number; color: string; pct: number }[];
  totalStars: number;
  totalForks: number;
  longestStreak: number;
  currentStreak: number;
  bestDay: { date: string; count: number };
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  visitorCount: number;
};
