'use client'

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Github, Twitter, Linkedin, Mail, Heart, Copy, Check, Coffee } from "lucide-react";
import { useEffects } from "./effects-provider";

function MagneticButton({ children, href, onClick }: { children: React.ReactNode; href: string; onClick?: () => void }) {
  const { playClick } = useEffects();
  const ref = useRef<HTMLAnchorElement | null>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  };
  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0, 0)";
  };

  return (
    <a
      ref={ref}
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={() => { playClick(); onClick?.(); }}
      className="h-14 w-14 rounded-2xl glass-strong flex items-center justify-center transition-transform duration-200 ease-out"
      style={{ transition: "transform 0.2s ease-out" }}
    >
      {children}
    </a>
  );
}

export function ContactSocial({ data }: { data: any }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [copied, setCopied] = useState(false);
  const { playClick } = useEffects();
  const user = data.user;
  const email = user.email || `${user.login}@users.noreply.github.com`;

  const copyEmail = () => {
    navigator.clipboard?.writeText(email).then(() => {
      setCopied(true);
      playClick();
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const socials = [
    { icon: Github, href: user.html_url, label: "GitHub", color: "var(--foreground)" },
    { icon: Twitter, href: user.twitter_username ? `https://twitter.com/${user.twitter_username}` : "#", label: "Twitter", color: "#1d9bf0" },
    { icon: Linkedin, href: "#", label: "LinkedIn", color: "#0a66c2" },
    { icon: Mail, href: `mailto:${email}`, label: "Email", color: "var(--aurora-1)" },
  ];

  return (
    <section id="contact" className="relative px-4 py-20 sm:py-24">
      <div className="max-w-3xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="glass-strong rounded-3xl p-8 sm:p-12 text-center"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Let's connect</span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-bold">
            <span className="text-gradient">Say hi 👋</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
            Open to collaborations, freelance, and interesting conversations. Reach out on any platform.
          </p>

          {/* Magnetic social buttons */}
          <div className="mt-10 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            {socials.map((s) => (
              <MagneticButton key={s.label} href={s.href}>
                <span className="sr-only">{s.label}</span>
                <s.icon size={22} style={{ color: s.color }} />
              </MagneticButton>
            ))}
          </div>

          {/* Copy email */}
          <div className="mt-8 flex items-center justify-center">
            <button
              onClick={copyEmail}
              className="glass rounded-full pl-4 pr-3 h-11 flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <span className="text-sm font-mono">{email}</span>
              <span className="h-6 w-6 rounded-full glass-strong flex items-center justify-center">
                {copied ? <Check size={12} style={{ color: "var(--aurora-3)" }} /> : <Copy size={12} />}
              </span>
            </button>
          </div>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-xs"
              style={{ color: "var(--aurora-3)" }}
            >
              ✓ Copied to clipboard
            </motion.div>
          )}

          {/* Sponsor CTA */}
          <a
            href={`https://github.com/sponsors/${user.login}`}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 h-11 px-5 rounded-xl text-sm font-semibold text-white hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(135deg, var(--aurora-4), var(--aurora-1))" }}
          >
            <Coffee size={16} /> Buy me a coffee
          </a>
        </motion.div>
      </div>
    </section>
  );
}
