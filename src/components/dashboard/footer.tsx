'use client'

import { ArrowUp, Heart } from "lucide-react";
import { useEffects } from "./effects-provider";

export function Footer({ user }: { user: any }) {
  const { playClick } = useEffects();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto px-4 pt-8 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground text-center sm:text-left">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start">
              <span>Built with</span>
              <Heart size={12} style={{ color: "var(--aurora-4)" }} fill="currentColor" />
              <span>using Next.js 16 · TypeScript · Tailwind · Framer Motion</span>
            </div>
            <div className="mt-1 opacity-70">
              © {year} {user.name || user.login}. Dashboard auto-syncs from GitHub API every 30 min.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/himanshugpt09"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={playClick}
            >
              @{user.login}
            </a>
            <button
              onClick={() => {
                playClick();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="h-9 w-9 rounded-xl glass flex items-center justify-center hover:scale-110 transition-transform"
              aria-label="Back to top"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
