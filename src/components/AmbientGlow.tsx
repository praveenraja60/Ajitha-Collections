/** Soft floating light orbs — decorative only, no pointer events. */
export default function AmbientGlow() {
  return (
    <div className="ambient-glow pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <span className="ambient-glow__orb ambient-glow__orb--a" />
      <span className="ambient-glow__orb ambient-glow__orb--b" />
      <span className="ambient-glow__orb ambient-glow__orb--c" />
      <span className="ambient-glow__grain" />
    </div>
  )
}
