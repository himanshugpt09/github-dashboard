'use client'

import { useEffect, useRef } from "react";
import { useEffects } from "./effects-provider";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
};

/**
 * Lightweight particle constellation background.
 * Connects nearby particles with thin lines.
 */
export function ParticleField() {
  const { particles, heavy3D } = useEffects();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!particles) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Reduce particle count when 3D is off to feel "smooth/lighter"
    const count = heavy3D ? 80 : 40;
    const connectDist = heavy3D ? 130 : 90;

    const colors = [
      getComputedStyle(document.documentElement).getPropertyValue("--aurora-1").trim() || "#a855f7",
      getComputedStyle(document.documentElement).getPropertyValue("--aurora-2").trim() || "#06b6d4",
      getComputedStyle(document.documentElement).getPropertyValue("--aurora-3").trim() || "#22c55e",
      getComputedStyle(document.documentElement).getPropertyValue("--aurora-4").trim() || "#ec4899",
    ];

    const particlesArr: Particle[] = Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.6,
      life: Math.random() * 100,
    }));

    let mouseX = -9999;
    let mouseY = -9999;
    const onMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMouse);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Update + draw particles
      for (let i = 0; i < particlesArr.length; i++) {
        const p = particlesArr[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const color = colors[i % colors.length];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.7;
        ctx.fill();

        // Connect to mouse (when close)
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const md = Math.sqrt(dx * dx + dy * dy);
        if (md < 180) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = color;
          ctx.globalAlpha = (1 - md / 180) * 0.35;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      // Connect close particles
      for (let i = 0; i < particlesArr.length; i++) {
        for (let j = i + 1; j < particlesArr.length; j++) {
          const a = particlesArr[i];
          const b = particlesArr[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < connectDist) {
            const color = colors[i % colors.length];
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = color;
            ctx.globalAlpha = (1 - d / connectDist) * 0.18;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
    };
  }, [particles, heavy3D]);

  if (!particles) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20 pointer-events-none"
      aria-hidden
    />
  );
}
