'use client'

import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Star, GitFork, ExternalLink, Eye, ArrowUpRight, Folder } from "lucide-react";
import { useEffects } from "./effects-provider";

type Project = {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  updated_at: string;
  homepage: string | null;
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

function langColor(lang: string | null) {
  const map: Record<string, string> = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Java: "#b07219",
  };
  return lang ? map[lang] || "#7d8590" : "#7d8590";
}

function ProjectCard({ project, index, filter }: { project: Project; index: number; filter: string | null }) {
  const { heavy3D } = useEffects();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useTransform(useSpring(my, { stiffness: 200, damping: 20 }), [0, 1], [10, -10]);
  const ry = useTransform(useSpring(mx, { stiffness: 200, damping: 20 }), [0, 1], [-10, 10]);
  const glowX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(my, [0, 1], ["0%", "100%"]);
  const glowBg = useTransform(
    [glowX, glowY],
    ([x, y]: string[]) =>
      `radial-gradient(circle at ${x} ${y}, var(--aurora-1) 0%, transparent 40%)`
  );

  const matches = !filter || project.language === filter ||
    project.topics?.includes(filter.toLowerCase()) ||
    project.name.toLowerCase().includes(filter.toLowerCase());

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
      animate={inView ? { opacity: matches ? 1 : 0.15, y: 0, scale: matches ? 1 : 0.92 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      style={{ perspective: heavy3D ? 1000 : 0 }}
      className="relative"
    >
      <motion.a
        href={project.html_url}
        target="_blank"
        rel="noreferrer"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          rotateX: heavy3D ? rx : 0,
          rotateY: heavy3D ? ry : 0,
          transformStyle: "preserve-3d",
        }}
        className="block glass rounded-2xl p-5 h-full glass-hover relative overflow-hidden"
      >
        {/* Cursor-following glow */}
        {heavy3D && (
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{ background: glowBg }}
          />
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-3 relative" style={{ transform: heavy3D ? "translateZ(40px)" : undefined }}>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg glass-strong flex items-center justify-center">
              <Folder size={16} style={{ color: langColor(project.language) }} />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">{project.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                {project.language && (
                  <>
                    <span className="h-2 w-2 rounded-full" style={{ background: langColor(project.language) }} />
                    <span className="text-[10px] text-muted-foreground">{project.language}</span>
                    <span className="text-muted-foreground/40 text-[10px]">·</span>
                  </>
                )}
                <span className="text-[10px] text-muted-foreground">{timeAgo(project.updated_at)}</span>
              </div>
            </div>
          </div>
          <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-aurora-1" />
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem] relative" style={{ transform: heavy3D ? "translateZ(20px)" : undefined }}>
          {project.description || "A cool project — check it out on GitHub for the README."}
        </p>

        {/* Footer stats */}
        <div className="mt-4 flex items-center justify-between relative" style={{ transform: heavy3D ? "translateZ(30px)" : undefined }}>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Star size={12} /> {project.stargazers_count}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <GitFork size={12} /> {project.forks_count}
            </span>
            {project.homepage && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <ExternalLink size={12} /> live
              </span>
            )}
          </div>
          {project.topics && project.topics.length > 0 && (
            <div className="flex gap-1">
              {project.topics.slice(0, 2).map((t) => (
                <span key={t} className="text-[9px] px-1.5 py-0.5 rounded glass">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.a>
    </motion.div>
  );
}

export function FeaturedProjects({ data }: { data: any }) {
  const [filter, setFilter] = useState<string | null>(null);

  // Pick featured = top 9 by updated_at, prioritizing non-forks with descriptions
  const featured = [...data.repos]
    .filter((r: Project) => !r.fork)
    .sort((a: Project, b: Project) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 9);

  const langs = Array.from(
    new Set(featured.map((r: Project) => r.language).filter(Boolean))
  ) as string[];

  return (
    <section id="projects" className="relative px-4 py-20 sm:py-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Featured Projects</span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-bold">
            <span className="text-gradient">Things I've built</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            {featured.length} repos, sorted by most recent activity. Click a language tag to filter.
          </p>
        </motion.div>

        {/* Language filter chips */}
        {langs.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setFilter(null)}
              className={`text-xs px-3 py-1.5 rounded-full glass transition-all ${
                filter === null ? "scale-105" : "opacity-60 hover:opacity-100"
              }`}
              style={filter === null ? { background: "var(--aurora-1)", color: "white" } : {}}
            >
              All
            </button>
            {langs.map((lang) => (
              <button
                key={lang}
                onClick={() => setFilter(filter === lang ? null : lang)}
                className={`text-xs px-3 py-1.5 rounded-full glass transition-all flex items-center gap-1.5 ${
                  filter === lang ? "scale-105" : "opacity-60 hover:opacity-100"
                }`}
                style={filter === lang ? { background: langColor(lang), color: "#000" } : {}}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: langColor(lang) }} />
                {lang}
              </button>
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((p: Project, i: number) => (
            <ProjectCard key={p.id} project={p} index={i} filter={filter} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href={data.user.html_url + "?tab=repositories"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-xl glass font-medium hover:scale-105 transition-transform"
          >
            <Eye size={16} /> See all {data.user.public_repos} repositories
          </a>
        </div>
      </div>
    </section>
  );
}
