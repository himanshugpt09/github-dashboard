'use client'

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { GitCommit, GitPullRequest, CircleDot, Star, GitFork, Plus, Eye } from "lucide-react";

type Event = {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload: any;
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function eventMeta(e: Event) {
  switch (e.type) {
    case "PushEvent":
      return {
        icon: GitCommit,
        color: "var(--aurora-3)",
        label: `pushed ${e.payload.commits?.length || 1} commit${(e.payload.commits?.length || 1) > 1 ? "s" : ""}`,
        detail: e.payload.commits?.[0]?.message?.split("\n")[0] || "",
      };
    case "PullRequestEvent":
      return {
        icon: GitPullRequest,
        color: "var(--aurora-2)",
        label: `${e.payload.action || "opened"} a pull request`,
        detail: e.payload.pull_request?.title || "",
      };
    case "IssuesEvent":
      return {
        icon: CircleDot,
        color: "var(--aurora-4)",
        label: `${e.payload.action || "opened"} an issue`,
        detail: e.payload.issue?.title || "",
      };
    case "WatchEvent":
      return { icon: Star, color: "#facc15", label: "starred", detail: "" };
    case "ForkEvent":
      return { icon: GitFork, color: "var(--aurora-1)", label: "forked", detail: "" };
    case "CreateEvent":
      return { icon: Plus, color: "#22d3ee", label: "created repo/branch", detail: "" };
    default:
      return { icon: Eye, color: "#94a3b8", label: e.type.replace("Event", "").toLowerCase(), detail: "" };
  }
}

export function ActivityTimeline({ data }: { data: any }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [visibleCount, setVisibleCount] = useState(10);

  // Sort by date descending
  const events: Event[] = [...data.events]
    .sort((a: Event, b: Event) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, visibleCount);

  return (
    <section id="activity" className="relative px-4 py-20 sm:py-24">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Activity Timeline</span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-bold">
            <span className="text-gradient">Recent moves</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Latest commits, pull requests, issues, and stars — straight from the GitHub events API.
          </p>
        </motion.div>

        <div ref={ref} className="glass rounded-3xl p-4 sm:p-8">
          <div className="relative">
            {/* Timeline line */}
            <div
              className="absolute left-[18px] top-2 bottom-2 w-px"
              style={{ background: "linear-gradient(180deg, var(--aurora-1), var(--aurora-2), var(--aurora-3), transparent)" }}
            />

            <ol className="space-y-5">
              {events.map((e, i) => {
                const meta = eventMeta(e);
                const Icon = meta.icon;
                const repoShort = e.repo.name.replace("himanshugpt09/", "");
                return (
                  <motion.li
                    key={e.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="relative pl-12"
                  >
                    {/* Icon bubble */}
                    <div
                      className="absolute left-0 top-0 h-9 w-9 rounded-xl glass-strong flex items-center justify-center"
                      style={{ borderColor: meta.color }}
                    >
                      <Icon size={14} style={{ color: meta.color }} />
                    </div>

                    <div className="glass rounded-xl p-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-sm">
                          <span className="font-semibold">{meta.label}</span>{" "}
                          <span className="text-muted-foreground">in</span>{" "}
                          <a
                            href={`https://github.com/${e.repo.name}`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-xs hover:underline"
                            style={{ color: meta.color }}
                          >
                            {repoShort}
                          </a>
                        </span>
                        <span className="text-[10px] text-muted-foreground tabular-nums">
                          {timeAgo(e.created_at)}
                        </span>
                      </div>
                      {meta.detail && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          "{meta.detail}"
                        </p>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </div>

          {data.events.length > visibleCount && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setVisibleCount((c) => c + 6)}
                className="h-10 px-5 rounded-xl glass text-sm font-medium hover:scale-105 transition-transform"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
