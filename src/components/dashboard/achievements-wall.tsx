'use client'

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Zap, Trophy, Rocket, Heart, Star, GitCommit, Users } from "lucide-react";

type Achievement = {
  icon: typeof Award;
  title: string;
  subtitle: string;
  color: string;
  unlocked: boolean;
};

export function AchievementsWall({ data }: { data: any }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const achievements: Achievement[] = [
    {
      icon: Rocket,
      title: "Quickstarter",
      subtitle: "Published 30+ repos in first year",
      color: "var(--aurora-1)",
      unlocked: data.user.public_repos >= 30,
    },
    {
      icon: GitCommit,
      title: "Consistent Committer",
      subtitle: `${data.longestStreak}-day longest streak`,
      color: "var(--aurora-2)",
      unlocked: data.longestStreak >= 5,
    },
    {
      icon: Star,
      title: "Polyglot",
      subtitle: `${data.languages.length}+ languages used`,
      color: "var(--aurora-3)",
      unlocked: data.languages.length >= 3,
    },
    {
      icon: Zap,
      title: "Always Shipping",
      subtitle: `${data.totalCommits}+ total commits`,
      color: "var(--aurora-4)",
      unlocked: data.totalCommits >= 100,
    },
    {
      icon: Trophy,
      title: "Best Day",
      subtitle: `${data.bestDay.count} commits on ${data.bestDay.date}`,
      color: "#facc15",
      unlocked: data.bestDay.count >= 5,
    },
    {
      icon: Heart,
      title: "Open Source Heart",
      subtitle: "All repos public, none private",
      color: "#f472b6",
      unlocked: true,
    },
    {
      icon: Users,
      title: "Community",
      subtitle: "Joined GitHub community",
      color: "#22d3ee",
      unlocked: true,
    },
    {
      icon: Award,
      title: "Pull Shark",
      subtitle: "Opened pull requests",
      color: "#a855f7",
      unlocked: data.totalPRs >= 1,
    },
  ];

  return (
    <section id="achievements" className="relative px-4 py-20 sm:py-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Achievements</span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-bold">
            <span className="text-gradient">Trophy wall</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Unlocked badges based on real GitHub activity. More to come.
          </p>
        </motion.div>

        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {achievements.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 30, rotateY: -30 }}
                animate={inView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08, type: "spring", stiffness: 150 }}
                whileHover={{ scale: 1.05, rotateZ: 2 }}
                className={`glass rounded-2xl p-5 text-center relative overflow-hidden ${
                  a.unlocked ? "glass-hover" : "opacity-40 grayscale"
                }`}
              >
                {a.unlocked && (
                  <div
                    className="absolute -inset-4 opacity-30 blur-2xl"
                    style={{ background: a.color }}
                  />
                )}
                <div className="relative">
                  <div
                    className="mx-auto h-14 w-14 rounded-2xl glass-strong flex items-center justify-center mb-3"
                    style={{ borderColor: a.color }}
                  >
                    <Icon size={24} style={{ color: a.color }} />
                  </div>
                  <h3 className="font-bold text-sm">{a.title}</h3>
                  <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{a.subtitle}</p>
                  {a.unlocked ? (
                    <div className="mt-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: a.color }}>
                      ✓ Unlocked
                    </div>
                  ) : (
                    <div className="mt-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                      Locked
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
