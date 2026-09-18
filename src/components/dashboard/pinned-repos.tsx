'use client'

import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, GitFork, ExternalLink, ArrowUpRight, Pin, Calendar } from "lucide-react";
import { useEffects } from "./effects-provider";

type PinnedRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  homepage: string | null;
  updated_at: string;
  topics: string[];
  tags: string[];
  accent: string;
  short: string;
};

function timeAgo(iso: string) {
  const d = new Date(iso).getTime();
  const diff = Date.now() - d;
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "today";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function PinnedCard({ repo, index }: { repo: PinnedRepo; index: number }) {
  const { heavy3D } = useEffects();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useTransform(useSpring(my, { stiffness: 200, damping: 20 }), [0, 1], [8, -8]);
  const ry = useTransform(useSpring(mx, { stiffness: 200, damping: 20 }), [0, 1], [-8, 8]);
  const glowX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(my, [0, 1], ["0%", "100%"]);
  const glowBg = useTransform(
    [glowX, glowY],
    ([x, y]: string[]) =>
      `radial-gradient(circle at ${x} ${y}, ${repo.accent}40 0%, transparent 45%)`
  );

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heavy3D) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const handleLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{ perspective: heavy3D ? 1000 : 0 }}
      className="relative"
    >
      <motion.a
        href={repo.html_url}
        target="_blank"
        rel="noreferrer"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          rotateX: heavy3D ? rx : 0,
          rotateY: heavy3D ? ry : 0,
          transformStyle: "preserve-3d",
        }}
        className="block glass rounded-2xl p-5 h-full glass-hover relative overflow-hidden group"
      >
        {/* Accent glow */}
        <div
          className="absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity"
          style={{ background: repo.accent }}
        />

        {/* Cursor-following glow (3D only) */}
        {heavy3D && (
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{ background: glowBg }}
          />
        )}

        {/* Pin indicator */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full"
          style={{ background: `${repo.accent}25`, color: repo.accent }}
        >
          <Pin size={10} /> Pinned
        </div>

        {/* Header */}
        <div
          className="flex items-center gap-3 mb-3 relative"
          style={{ transform: heavy3D ? "translateZ(40px)" : undefined }}
        >
          <div
            className="h-12 w-12 rounded-2xl glass-strong flex items-center justify-center font-black text-sm"
            style={{ color: repo.accent, borderColor: `${repo.accent}55` }}
          >
            {repo.short}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base leading-tight truncate">{repo.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground">
              <Calendar size={10} />
              <span>updated {timeAgo(repo.updated_at)}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p
          className="text-sm text-muted-foreground line-clamp-3 min-h-[3.75rem] relative"
          style={{ transform: heavy3D ? "translateZ(20px)" : undefined }}
        >
          {repo.description}
        </p>

        {/* Tags */}
        <div
          className="mt-3 flex flex-wrap gap-1.5 relative"
          style={{ transform: heavy3D ? "translateZ(15px)" : undefined }}
        >
          {repo.tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] px-2 py-0.5 rounded-md glass"
              style={{ color: repo.accent }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div
          className="mt-4 pt-3 border-t flex items-center justify-between relative"
          style={{
            borderColor: "var(--glass-border)",
            transform: heavy3D ? "translateZ(30px)" : undefined,
          }}
        >
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star size={12} /> {repo.stargazers_count}
            </span>
            <span className="flex items-center gap-1">
              <GitFork size={12} /> {repo.forks_count}
            </span>
            {repo.language && (
              <span className="flex items-center gap-1">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: repo.accent }}
                />
                {repo.language}
              </span>
            )}
          </div>
          {repo.homepage ? (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-[10px] font-semibold hover:scale-105 transition-transform"
              style={{ color: repo.accent }}
            >
              <ExternalLink size={10} /> live demo
            </a>
          ) : (
            <ArrowUpRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </div>
      </motion.a>
    </motion.div>
  );
}

export function PinnedRepos({ data }: { data: any }) {
  const repos: PinnedRepo[] = data.pinnedRepos ?? [];

  return (
    <section id="pinned" className="relative px-4 py-20 sm:py-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Pinned Repositories
          </span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-bold">
            <span className="text-gradient">Hand-picked work</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            The {repos.length} repositories pinned on my GitHub profile — the projects
            I'm proudest of, updated with live stars and fork counts.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {repos.map((r, i) => (
            <PinnedCard key={r.id} repo={r} index={i} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href={data.user.html_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-xl glass font-medium hover:scale-105 transition-transform"
          >
            <Pin size={16} /> See full profile on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
