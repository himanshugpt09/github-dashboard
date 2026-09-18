'use client'

import { motion, AnimatePresence } from "framer-motion";
import { Github, Sun, Moon, Boxes, Sparkles, Volume2, VolumeX, MousePointerClick, Wind, Menu, X } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useEffects } from "./effects-provider";
import { useState } from "react";

function ToggleChip({
  active,
  onClick,
  activeIcon,
  inactiveIcon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`relative h-9 w-9 rounded-xl glass flex items-center justify-center transition-all hover:scale-110 ${
        active ? "text-aurora-1" : "text-muted-foreground"
      }`}
      style={{ color: active ? "var(--aurora-1)" : undefined }}
    >
      <span className="sr-only">{label}</span>
      {active ? activeIcon : inactiveIcon}
    </button>
  );
}

export function TopNav() {
  const { theme, toggleTheme } = useTheme();
  const { heavy3D, toggle3D, sound, toggleSound, cursorTrail, toggleCursorTrail, particles, toggleParticles } = useEffects();
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 inset-x-0 z-50 px-3 sm:px-6 pt-3"
    >
      <nav className="glass rounded-2xl px-3 sm:px-5 py-2.5 flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand */}
        <a
          href="#hero"
          className="flex items-center gap-2 group"
          aria-label="Himanshu Gupta dashboard home"
        >
          <div className="relative h-8 w-8 rounded-lg glass-strong flex items-center justify-center overflow-hidden">
            <div
              className="absolute inset-0 opacity-70 group-hover:opacity-100 transition-opacity"
              style={{
                background:
                  "conic-gradient(from 0deg, var(--aurora-1), var(--aurora-2), var(--aurora-3), var(--aurora-4), var(--aurora-1))",
                animation: "spin 8s linear infinite",
              }}
            />
            <span className="relative text-xs font-black">HG</span>
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-sm font-semibold">Himanshu</span>
            <span className="text-[10px] text-muted-foreground tracking-wider uppercase">
              Dashboard
            </span>
          </div>
        </a>

        {/* Desktop toggles */}
        <div className="hidden md:flex items-center gap-2">
          <ToggleChip
            active={theme === "dark"}
            onClick={toggleTheme}
            activeIcon={<Moon size={16} />}
            inactiveIcon={<Sun size={16} />}
            label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          />
          <ToggleChip
            active={heavy3D}
            onClick={toggle3D}
            activeIcon={<Boxes size={16} />}
            inactiveIcon={<Sparkles size={16} />}
            label={heavy3D ? "3D mode on — switch to 2D smooth" : "2D smooth — switch to 3D"}
          />
          <ToggleChip
            active={particles}
            onClick={toggleParticles}
            activeIcon={<Sparkles size={16} />}
            inactiveIcon={<Wind size={16} />}
            label={particles ? "Particles on" : "Particles off"}
          />
          <ToggleChip
            active={cursorTrail}
            onClick={toggleCursorTrail}
            activeIcon={<MousePointerClick size={16} />}
            inactiveIcon={<MousePointerClick size={16} />}
            label={cursorTrail ? "Custom cursor on" : "Custom cursor off"}
          />
          <ToggleChip
            active={sound}
            onClick={toggleSound}
            activeIcon={<Volume2 size={16} />}
            inactiveIcon={<VolumeX size={16} />}
            label={sound ? "Sound on" : "Sound off"}
          />

          <a
            href="https://github.com/himanshugpt09"
            target="_blank"
            rel="noreferrer"
            className="ml-2 h-9 px-4 rounded-xl glass flex items-center gap-2 text-sm font-medium hover:scale-105 transition-transform"
            style={{ color: "var(--foreground)" }}
          >
            <Github size={16} />
            <span className="hidden lg:inline">Star on GitHub</span>
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden h-9 w-9 rounded-xl glass flex items-center justify-center"
          onClick={() => setOpen((p) => !p)}
          aria-label="Open settings menu"
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden mt-2 glass rounded-2xl p-3 max-w-7xl mx-auto overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2">
              <button onClick={toggleTheme} className="h-11 rounded-xl glass flex items-center justify-center gap-2 text-sm">
                {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
                {theme === "dark" ? "Dark" : "Light"}
              </button>
              <button onClick={toggle3D} className="h-11 rounded-xl glass flex items-center justify-center gap-2 text-sm">
                <Boxes size={16} />
                {heavy3D ? "3D On" : "3D Off"}
              </button>
              <button onClick={toggleParticles} className="h-11 rounded-xl glass flex items-center justify-center gap-2 text-sm">
                <Sparkles size={16} />
                Particles
              </button>
              <button onClick={toggleCursorTrail} className="h-11 rounded-xl glass flex items-center justify-center gap-2 text-sm">
                <MousePointerClick size={16} />
                Cursor
              </button>
              <button onClick={toggleSound} className="h-11 rounded-xl glass flex items-center justify-center gap-2 text-sm col-span-2">
                {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
                {sound ? "Sound On" : "Sound Off"}
              </button>
              <a
                href="https://github.com/himanshugpt09"
                target="_blank"
                rel="noreferrer"
                className="h-11 rounded-xl glass flex items-center justify-center gap-2 text-sm col-span-2"
              >
                <Github size={16} /> Star on GitHub
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.header>
  );
}
