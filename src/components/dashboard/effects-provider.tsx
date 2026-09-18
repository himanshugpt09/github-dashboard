'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type EffectsState = {
  /** 3D heavy mode (parallax tilt, 3D camera, depth). When off → flat 2D smooth. */
  heavy3D: boolean;
  toggle3D: () => void;
  /** Subtle UI sound effects on/off. */
  sound: boolean;
  toggleSound: () => void;
  /** Custom cursor trail on/off. */
  cursorTrail: boolean;
  toggleCursorTrail: () => void;
  /** Particle field background on/off. */
  particles: boolean;
  toggleParticles: () => void;
  playClick: () => void;
};

const EffectsContext = createContext<EffectsState | undefined>(undefined);

export function EffectsProvider({ children }: { children: ReactNode }) {
  const [heavy3D, setHeavy3D] = useState(true);
  const [sound, setSound] = useState(false);
  const [cursorTrail, setCursorTrail] = useState(true);
  const [particles, setParticles] = useState(true);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('hp-effects');
      if (stored) {
        const p = JSON.parse(stored);
        if (typeof p.heavy3D === 'boolean') setHeavy3D(p.heavy3D);
        if (typeof p.sound === 'boolean') setSound(p.sound);
        if (typeof p.cursorTrail === 'boolean') setCursorTrail(p.cursorTrail);
        if (typeof p.particles === 'boolean') setParticles(p.particles);
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('hp-effects', JSON.stringify({ heavy3D, sound, cursorTrail, particles }));
  }, [heavy3D, sound, cursorTrail, particles]);

  const playClick = () => {
    if (!sound) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.13);
      setTimeout(() => ctx.close(), 200);
    } catch {}
  };

  const value: EffectsState = {
    heavy3D,
    toggle3D: () => { setHeavy3D((p) => !p); playClick(); },
    sound,
    toggleSound: () => setSound((p) => !p),
    cursorTrail,
    toggleCursorTrail: () => setCursorTrail((p) => !p),
    particles,
    toggleParticles: () => setParticles((p) => !p),
    playClick,
  };

  return <EffectsContext.Provider value={value}>{children}</EffectsContext.Provider>;
}

export function useEffects() {
  const ctx = useContext(EffectsContext);
  if (!ctx) throw new Error('useEffects must be used within EffectsProvider');
  return ctx;
}
