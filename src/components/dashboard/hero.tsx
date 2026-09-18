'use client'

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { Github, Twitter, Linkedin, Mail, ArrowDown, Sparkles, Code2, BrainCircuit } from "lucide-react";
import {
  SiOpenjdk,
  SiJavascript,
  SiPython,
  SiHtml5,
  SiGnubash,
  SiUbuntu,
  SiPostgresql,
  SiNumpy,
  SiPandas,
} from "@icons-pack/react-simple-icons";
import { useEffects } from "./effects-provider";

const ROLES = [
  "Data Scientist",
  "ML Engineer",
  "Python Developer",
  "Analytics Builder",
  "Lifelong Learner",
];

// 10 orbiting techs — Java (OpenJDK), JavaScript, Python, HTML5, Bash,
// Ubuntu, SQL (PostgreSQL), NumPy, Pandas, Machine Learning.
// Matplotlib and Seaborn removed per request — they're confusing abbreviations.
type TechItem = {
  name: string;
  color: string;
  r: number;        // orbit radius (px)
  dur: number;      // orbit duration (s)
  offset: number;   // phase offset 0..1
  Icon: React.ComponentType<{ size?: number; color?: string }>;
};

const ORBIT_TECHS: TechItem[] = [
  { name: "Java",        color: "#ED8B00", r: 130, dur: 22, offset: 0.00, Icon: SiOpenjdk },
  { name: "JavaScript",  color: "#F7DF1E", r: 130, dur: 22, offset: 0.33, Icon: SiJavascript },
  { name: "Python",      color: "#3776AB", r: 130, dur: 22, offset: 0.66, Icon: SiPython },
  { name: "HTML5",       color: "#E34F26", r: 180, dur: 30, offset: 0.00, Icon: SiHtml5 },
  { name: "Bash",        color: "#4EAA25", r: 180, dur: 30, offset: 0.50, Icon: SiGnubash },
  { name: "Ubuntu",      color: "#E95420", r: 180, dur: 30, offset: 0.75, Icon: SiUbuntu },
  { name: "SQL",         color: "#4169E1", r: 230, dur: 38, offset: 0.10, Icon: SiPostgresql },
  { name: "NumPy",       color: "#013243", r: 230, dur: 38, offset: 0.40, Icon: SiNumpy },
  { name: "Pandas",      color: "#150458", r: 230, dur: 38, offset: 0.70, Icon: SiPandas },
  { name: "Machine Learning", color: "#a855f7", r: 280, dur: 46, offset: 0.30, Icon: BrainCircuit },
];

function useTypewriter(words: string[], typeMs = 90, holdMs = 1600) {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && text.length < word.length) {
      t = setTimeout(() => setText(word.slice(0, text.length + 1)), typeMs);
    } else if (!deleting && text.length === word.length) {
      t = setTimeout(() => setDeleting(true), holdMs);
    } else if (deleting && text.length > 0) {
      t = setTimeout(() => setText(word.slice(0, text.length - 1)), typeMs / 2);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % words.length);
    }
    return () => clearTimeout(t);
  }, [text, deleting, wordIdx, words, typeMs, holdMs]);

  return text;
}

export function Hero({ data }: { data: { user: any } }) {
  const { heavy3D } = useEffects();
  const typed = useTypewriter(ROLES);
  const user = data.user;

  // 3D tilt of avatar
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useTransform(useSpring(my), [0, 1], [12, -12]);
  const ry = useTransform(useSpring(mx), [0, 1], [-12, 12]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heavy3D) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onMouseLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-4 pt-28 pb-16"
    >
      <div className="max-w-5xl w-full mx-auto text-center">
        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inset-0 rounded-full pulse-ring"
              style={{ background: "var(--aurora-3)" }}
            />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full"
              style={{ background: "var(--aurora-3)" }}
            />
          </span>
          <span className="text-xs sm:text-sm font-medium tracking-wide">
            Available for collaborations · Currently coding
          </span>
        </motion.div>

        {/* Avatar + orbiting tech (3D mode only) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          className={`flex items-center justify-center mb-8 ${heavy3D ? "h-[340px] sm:h-[400px]" : "h-40 sm:h-48"}`}
          style={{ perspective: heavy3D ? 1000 : 0 }}
        >
          <motion.div
            style={{ rotateX: heavy3D ? rx : 0, rotateY: heavy3D ? ry : 0, transformStyle: "preserve-3d" }}
            className="relative h-40 w-40 sm:h-48 sm:w-48"
          >
            {/* Glow */}
            <div
              className="absolute -inset-6 rounded-full blur-2xl opacity-60"
              style={{
                background: "conic-gradient(from 0deg, var(--aurora-1), var(--aurora-2), var(--aurora-3), var(--aurora-4), var(--aurora-1))",
                animation: "spin 14s linear infinite",
              }}
            />
            {/* Avatar */}
            <div className="relative h-full w-full rounded-full overflow-hidden glass-strong">
              <img
                src={user.avatar_url}
                alt={`${user.name || user.login}'s avatar`}
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>

            {/* Orbit rings + orbiting icons — only in 3D mode */}
            {heavy3D && (
              <>
                <div
                  className="absolute inset-0 rounded-full border"
                  style={{ borderColor: "var(--glass-border)", transform: "rotateX(70deg)" }}
                />
                <div
                  className="absolute -inset-12 rounded-full border"
                  style={{ borderColor: "var(--glass-border)", transform: "rotateX(70deg)" }}
                />
                <div
                  className="absolute -inset-24 rounded-full border opacity-50"
                  style={{ borderColor: "var(--glass-border)", transform: "rotateX(70deg)" }}
                />

                {/* Orbiting tech icons (real SVG brand icons) */}
                {ORBIT_TECHS.map((tech, i) => {
                  // Outer orbits get slightly smaller badges to avoid crowding
                  const isOuter = tech.r >= 280;
                  const sizeClass = isOuter ? "h-10 w-10 sm:h-11 sm:w-11" : "h-11 w-11 sm:h-12 sm:w-12";
                  const offset = isOuter ? -20 : -24;
                  const iconSize = isOuter ? 18 : 20;
                  return (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2"
                      style={{
                        ['--orbit-r' as any]: `${tech.r}px`,
                        animation: `orbit ${tech.dur}s linear infinite`,
                        animationDelay: `-${tech.dur * tech.offset}s`,
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <div
                        className={`${sizeClass} rounded-xl glass-strong flex items-center justify-center group/icon relative`}
                        style={{
                          color: tech.color,
                          borderColor: tech.color + "55",
                          marginLeft: offset,
                          marginTop: offset,
                          boxShadow: `0 0 12px ${tech.color}33`,
                        }}
                        title={tech.name}
                      >
                        <tech.Icon size={iconSize} color={tech.color} />
                        {/* Tooltip on hover */}
                        <span
                          className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-medium px-1.5 py-0.5 rounded glass-strong opacity-0 group-hover/icon:opacity-100 transition-opacity pointer-events-none"
                          style={{ color: tech.color }}
                        >
                          {tech.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Name + role */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-5xl sm:text-7xl font-black tracking-tight"
        >
          <span className="text-gradient">{user.name || user.login}</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-4 text-xl sm:text-2xl font-medium h-8 sm:h-10"
        >
          <span className="text-foreground/80">{typed}</span>
          <span className="type-caret" />
        </motion.div>

        {/* Bio */}
        {user.bio && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto"
          >
            {user.bio}
          </motion.p>
        )}

        {/* Tech stack row — shown in BOTH modes, but in 2D-smooth it's the primary tech display */}
        {!heavy3D && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2.5 max-w-2xl mx-auto"
          >
            {ORBIT_TECHS.map((tech, i) => (
              <div
                key={tech.name}
                className="group/icon relative h-11 w-11 rounded-xl glass-strong flex items-center justify-center float-anim"
                style={{
                  color: tech.color,
                  borderColor: tech.color + "55",
                  boxShadow: `0 0 10px ${tech.color}22`,
                  animationDelay: `${i * 0.2}s`,
                }}
                title={tech.name}
              >
                <tech.Icon size={20} color={tech.color} />
                {/* Tooltip on hover */}
                <span
                  className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium px-1.5 py-0.5 rounded glass-strong opacity-0 group-hover/icon:opacity-100 transition-opacity pointer-events-none"
                  style={{ color: tech.color }}
                >
                  {tech.name}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: heavy3D ? 0.55 : 0.7 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
            className="h-12 px-6 rounded-2xl glass-strong font-semibold flex items-center gap-2 hover:scale-105 transition-transform"
            style={{ color: "var(--foreground)" }}
          >
            <Github size={18} /> View GitHub
          </a>
          <a
            href="#pinned"
            className="h-12 px-6 rounded-2xl font-semibold flex items-center gap-2 hover:scale-105 transition-transform text-white"
            style={{ background: "linear-gradient(135deg, var(--aurora-1), var(--aurora-2))" }}
          >
            <Code2 size={18} /> See Projects
          </a>
        </motion.div>

        {/* Social row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="mt-8 flex items-center justify-center gap-3"
        >
          {[
            { icon: Github, href: user.html_url, label: "GitHub" },
            { icon: Twitter, href: user.twitter_username ? `https://twitter.com/${user.twitter_username}` : "#", label: "Twitter" },
            { icon: Linkedin, href: "#", label: "LinkedIn" },
            { icon: Mail, href: user.email ? `mailto:${user.email}` : "#", label: "Email" },
          ].map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className="h-10 w-10 rounded-xl glass flex items-center justify-center hover:scale-110 hover:text-aurora-1 transition-transform"
            >
              <s.icon size={16} />
            </a>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.a
        href="#stats"
        aria-label="Scroll down to stats"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { duration: 1, delay: 1 }, y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <ArrowDown size={14} />
      </motion.a>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
