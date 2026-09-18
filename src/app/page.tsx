'use client'

import { useEffect, useState } from "react";
import type { DashboardData } from "@/lib/github/types";
import { AuroraBackground } from "@/components/dashboard/aurora-background";
import { ParticleField } from "@/components/dashboard/particle-field";
import { CursorTrail } from "@/components/dashboard/cursor-trail";
import { KonamiEasterEgg } from "@/components/dashboard/konami-easter-egg";
import { TopNav } from "@/components/dashboard/top-nav";
import { Hero } from "@/components/dashboard/hero";
import { StatsStrip } from "@/components/dashboard/stats-strip";
import { ContributionUniverse } from "@/components/dashboard/contribution-universe";
import { TechStackGalaxy } from "@/components/dashboard/tech-stack-galaxy";
import { PinnedRepos } from "@/components/dashboard/pinned-repos";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { AchievementsWall } from "@/components/dashboard/achievements-wall";
import { VisitorMap } from "@/components/dashboard/visitor-map";
import { ContactSocial } from "@/components/dashboard/contact-social";
import { Footer } from "@/components/dashboard/footer";

function SectionSkeleton() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="glass rounded-2xl p-8 text-center">
        <div className="h-12 w-12 rounded-full mx-auto mb-3" style={{ background: "var(--glass-border)" }} />
        <div className="shimmer h-3 w-32 rounded mb-2 mx-auto" />
        <div className="shimmer h-3 w-48 rounded mx-auto" />
      </div>
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github")
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed to load dashboard data");
        return (await r.json()) as DashboardData;
      })
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => { if (!cancelled) setError(e.message); });
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <AuroraBackground />
      <ParticleField />
      <CursorTrail />
      <KonamiEasterEgg />
      <TopNav />

      <main className="relative min-h-screen flex flex-col">
        {!data && !error && (
          <>
            <SectionSkeleton />
          </>
        )}

        {error && (
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="glass rounded-2xl p-8 text-center max-w-md">
              <div className="text-4xl mb-3">⚠️</div>
              <h2 className="font-bold text-lg mb-2">Couldn't load GitHub data</h2>
              <p className="text-sm text-muted-foreground">
                The GitHub API may be rate-limited. Try refreshing in a moment.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 h-10 px-4 rounded-xl glass font-medium hover:scale-105 transition-transform"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {data && (
          <div className="flex-1">
            <Hero data={data} />
            <StatsStrip data={data} />
            <ContributionUniverse data={data} />
            <TechStackGalaxy data={data} />
            <PinnedRepos data={data} />
            <ActivityTimeline data={data} />
            <AchievementsWall data={data} />
            <VisitorMap data={data} />
            <ContactSocial data={data} />
          </div>
        )}

        {data && <Footer user={data.user} />}
      </main>
    </>
  );
}
