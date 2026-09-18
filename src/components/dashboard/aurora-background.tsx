'use client'

export function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none">
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-[0.25]" />

      {/* Aurora blobs */}
      <div className="aurora-blob b1" />
      <div className="aurora-blob b2" />
      <div className="aurora-blob b3" />
      <div className="aurora-blob b4" />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, var(--background) 95%)",
        }}
      />
    </div>
  );
}
