export function Orbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          top: "-15%",
          right: "-10%",
          background:
            "radial-gradient(circle, rgba(198,169,98,0.08) 0%, transparent 65%)",
          filter: "blur(90px)",
          animation: "orbA 26s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 550,
          height: 550,
          bottom: "5%",
          left: "-8%",
          background:
            "radial-gradient(circle, rgba(120,130,180,0.05) 0%, transparent 65%)",
          filter: "blur(80px)",
          animation: "orbB 32s ease-in-out infinite",
        }}
      />
    </div>
  );
}
