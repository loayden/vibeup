"use client"
import React from "react";

const services = [
  {
    title: "Event Planning & Management",
    points: [
      "Full-service event planning and execution",
      "Corporate events, private parties, concerts, cultural and social events",
      "Timeline creation and on-site event coordination",
      "Vendor and supplier management (sound, lighting, staging, décor)",
    ],
    image: "widding.jpg",
  },
  {
    title: "Artist & Talent Management",
    points: [
      "Booking and coordination of artists, DJs, performers, and hosts",
      "Contract management and scheduling",
      "Artist hospitality and performance coordination",
    ],
    image: "dj.jpg",
  },
  {
    title: "Event Marketing & Promotion",
    points: [
      "Digital marketing campaigns for events",
      "Social media management",
      "Audience targeting and engagement strategies",
      "Influencer and media collaborations",
    ],
    image: "pexels-ardit-mbrati-216809103-16966362.jpg",
  },
  {
    title: "Ticketing & Guest Management",
    points: [
      "Ticket sales setup and management",
      "Digital invitations and RSVP systems",
      "Guest list management and check-in solutions",
      "VIP access coordination",
    ],
    image: "stage.jpg",
  },
];

function Orbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <div style={{
        position:"absolute", width:700, height:700, top:"-15%", right:"-10%",
        background:"radial-gradient(circle, rgba(198,169,98,0.07) 0%, transparent 65%)",
        filter:"blur(90px)"
      }} />
      <div style={{
        position:"absolute", width:550, height:550, bottom:"5%", left:"-8%",
        background:"radial-gradient(circle, rgba(150,140,220,0.05) 0%, transparent 65%)",
        filter:"blur(80px)"
      }} />
    </div>
  );
}

export default function ServicesPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=Jost:wght@200;300&display=swap');
        body { background:#080808; }
      `}</style>

      <main className="relative min-h-screen text-white px-6 md:px-20 py-24" style={{fontFamily:"'Jost',sans-serif"}}>
        <Orbs />

        <div className="relative z-10 max-w-5xl mx-auto text-center mb-20">
          <p className="text-white/20 text-[9px] tracking-[0.45em] uppercase mb-4">
            Services
          </p>

          <h1 style={{
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:"clamp(2.5rem,6vw,4.5rem)",
            fontWeight:300
          }}>
            VibeUp <em style={{color:"#C6A962"}}>Services</em>
          </h1>

          <div className="mt-6 h-px w-20 mx-auto" style={{
            background:"linear-gradient(90deg,transparent,#C6A962,transparent)"
          }}/>

          <p className="text-white/40 mt-6 text-sm max-w-2xl mx-auto leading-relaxed">
            Delivering exceptional events with precision and creativity, blending strategy, production, and unforgettable experiences.
          </p>
        </div>

        <div className="relative z-10 grid gap-10 md:grid-cols-2">
          {services.map((service, i) => (
            <div key={i} className="relative p-6 rounded-2xl overflow-hidden"
              style={{
                background:"linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
                backdropFilter:"blur(20px)",
                border:"1px solid rgba(255,255,255,0.09)"
              }}
            >
              <div className="absolute inset-x-5 top-0 h-px"
                style={{background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)"}} />

              <h2 className="mb-4 text-lg"
                style={{
                  fontFamily:"'Cormorant Garamond',serif",
                  fontWeight:300
                }}>
                {service.title}
              </h2>

              <div className="h-px mb-4"
                style={{background:"linear-gradient(90deg,#C6A962,transparent)"}} />

              <ul className="space-y-2 text-white/50 text-sm">
                {service.points.map((point, idx) => (
                  <li key={idx}>— {point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <footer className="relative z-10 mt-24 text-center text-white/30 text-xs">
          © 2026 VibeUp — Luxury experiences
        </footer>
      </main>
    </>
  );
}