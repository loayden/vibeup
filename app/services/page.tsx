// /app/services/page.tsx
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
      "Social media management (Instagram, Facebook, TikTok, LinkedIn)",
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
      "Promotional codes and VIP access coordination",
    ],
    image: "stage.jpg",
  },
  {
    title: "Branding & Creative Services",
    points: [
      "Brand identity development",
      "Logo design and visual branding",
      "Event flyers, posters, banners, and invitations",
      "Creative concepts and themed event design",
    ],
    image: "pexels-leeloothefirst-7598011.jpg",
  },
  {
    title: "Media Production",
    points: [
      "Professional photography and videography",
      "Event highlight videos and promotional content",
      "Video editing and post-production",
      "Social media-ready visual content",
    ],
    image: "pexels-beige-media-2148596893-32538883.jpg",
  },
  {
    title: "Technical & Production Services",
    points: [
      "Sound, lighting, and stage production",
      "LED screens and visual displays",
      "Live streaming and broadcast solutions",
      "Technical setup and on-site supervision",
    ],
    image: "blurred-light-bulbs.jpg",
  },
  {
    title: "Logistics & Operations",
    points: [
      "Equipment coordination and transportation",
      "Venue setup and breakdown",
      "Staff coordination (ushers, security, technicians)",
      "On-site operations management",
    ],
    image: "pexels-artempodrez-5025636.jpg",
  },
  {
    title: "Sponsorship & Partnerships",
    points: [
      "Sponsor acquisition and management",
      "Brand placement and activation strategies",
      "Partnership coordination before and during events",
    ],
    image: "pexels-rdne-7648047.jpg",
  },
  {
    title: "Consulting & Event Strategy",
    points: [
      "Event concept development",
      "Budget planning and cost optimization",
      "Market research and competitor analysis",
      "Post-event reports and performance analysis",
    ],
    image: "pexels-sebastiaan9977-3379257.jpg",
  },
  {
    title: "Optional Add-On Services",
    points: [
      "VIP and hospitality services",
      "Catering and food vendor coordination",
      "Custom décor and luxury event styling",
      "Corporate and brand activations",
    ],
    image: "pexels-pavel-danilyuk-6405773.jpg",
  },
];

const ServicesPage = () => {
  return (
    <main className="bg-black text-white min-h-screen py-20 px-8 md:px-24">
      <header className="text-center mb-20 max-w-4xl mx-auto">
        <h1 className="font-extrabold text-7xl text-yellow-400 drop-shadow-[0_0_15px_rgba(255,255,0,0.75)] mb-6 tracking-wide">
          VibeUp Services
        </h1>
        <p className="text-xl md:text-2xl text-yellow-200/90 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
          Delivering exceptional events with precision and creativity. From strategic planning and seamless execution to innovative marketing and expert talent management, VibeUp ensures every moment is unforgettable.
        </p>
      </header>

      <section className="grid gap-12">
        {services.map((service, index) => (
          <div
            key={index}
            className="relative bg-black rounded-3xl shadow-2xl border-2 border-yellow-400/50 overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-3xl fade-in"
          >
            {/* Background image */}
            {service.image && (
              <div className="absolute inset-0">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover opacity-30 pointer-events-none select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
              </div>
            )}

            {/* Glow frame */}
            <div className="absolute inset-0 rounded-3xl border-2 border-yellow-400 opacity-20 animate-pulse pointer-events-none"></div>

            {/* Content */}
            <div className="relative p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-yellow-400 mb-6 drop-shadow-2xl tracking-wide">
                {service.title}
              </h2>
              <ul className="list-disc list-inside text-yellow-100/90 space-y-3 md:space-y-4 text-base md:text-lg leading-relaxed">
                {service.points.map((point, i) => (
                  <li key={i} className="hover:text-yellow-300 transition-colors duration-300">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      <footer className="mt-24 text-center text-yellow-200/70">
        <p className="mb-2">© 2026 VibeUp Events & Services</p>
        <p>Luxury experiences, unforgettable moments.</p>
      </footer>
    </main>
  );
};

export default ServicesPage;