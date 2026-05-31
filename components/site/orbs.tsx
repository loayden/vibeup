export function Orbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {/* ✅ Reduced blur for better performance on mobile */}
      <div
        className="ambient-orb"
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          top: "-15%",
          right: "-10%",
          background:
            "radial-gradient(circle, rgba(198,169,98,0.08) 0%, transparent 65%)",
          filter: "blur(40px)", // ✅ Reduced from 90px
          animation: "orbA 26s ease-in-out infinite",
          willChange: "transform", // ✅ Optimize for animation
          transform: "translate3d(0, 0, 0)", // ✅ Enable GPU acceleration
        }}
      />
      <div
        className="ambient-orb"
        style={{
          position: "absolute",
          width: 550,
          height: 550,
          bottom: "5%",
          left: "-8%",
          background:
            "radial-gradient(circle, rgba(120,130,180,0.05) 0%, transparent 65%)",
          filter: "blur(40px)", // ✅ Reduced from 80px
          animation: "orbB 32s ease-in-out infinite",
          willChange: "transform",
          transform: "translate3d(0, 0, 0)",
        }}
      />
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .ambient-orb {
            animation: none !important;
          }
        }
        @media (max-width: 767px) {
          .ambient-orb {
            width: 360px !important;
            height: 360px !important;
            filter: blur(24px) !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
