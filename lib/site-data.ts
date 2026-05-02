export const SITE = {
  name: "VibeUp Events & Services",
  shortName: "VibeUp",
  tagline: "Luxury event production, cultural experiences, and premium private celebrations.",
  description:
    "VibeUp Events & Services designs, produces, and manages elevated cultural nights, private parties, gala dinners, and branded experiences for clients who expect precision, atmosphere, and impeccable execution.",
  buyUrl: "https://vibesup.org/events/arab-nights",
  email: "vibesup.event@gmail.com",
  phonePrimary: "+1 (949) 247-9309",
  phoneSecondary: "+1 (917) 818-7850",
  venue: "Hilton Los Angeles / Universal City",
  city: "Los Angeles, California",
  credit: "Presented by FR ع · California Nights Entertainment",
  frInstagram: "https://www.instagram.com/fr3_fdn/?__pwa=1",
  countdownIso: "2025-12-31T20:30:00",
  heroVideo: "/arab.mp4",
  ambientAudio: "/luxury-ambient.mp3",
  socials: {
    whatsapp: "https://wa.me/19492479309",
    facebook: "https://www.facebook.com/vibeupevents",
    instagram: "https://www.instagram.com/vibeupevent/",
    tiktok: "https://www.tiktok.com/@vibesupevent",
  },
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact-us", label: "Contact" },
] as const;

export const SECONDARY_NAV_LINKS = [
  { href: "/blog", label: "Journal" },
  { href: "/faq", label: "FAQ" },
  { href: "/careers", label: "Careers" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

export const HERO_STATS = [
  { label: "Events Produced", value: "50+" },
  { label: "Guests Served", value: "10,000+" },
  { label: "Years Of Experience", value: "7" },
  { label: "Cities Activated", value: "4" },
] as const;

export const TICKET_TYPES = [
  {
    id: "vip-red",
    name: "VIP Red",
    price: 250,
    badge: "Premium",
    color: "rgba(214,75,75,0.72)",
    description:
      "Priority access, premium table placement, and concierge-style arrival support for guests who want the most elevated experience in the room.",
  },
  {
    id: "blue",
    name: "Blue",
    price: 200,
    badge: "Popular",
    color: "rgba(77,121,214,0.72)",
    description:
      "A refined seating tier with strong sightlines, premium service flow, and a balanced entry point into the evening’s main experience.",
  },
  {
    id: "green",
    name: "Green",
    price: 175,
    badge: null,
    color: "rgba(74,177,112,0.72)",
    description:
      "Comfortable access to the event atmosphere, headline performance, and curated gala setting at a versatile mid-tier position.",
  },
  {
    id: "yellow",
    name: "Yellow",
    price: 150,
    badge: null,
    color: "rgba(211,183,75,0.72)",
    description:
      "An accessible gala category designed for guests who want the ceremony, the music, and the social energy without compromise.",
  },
  {
    id: "purple",
    name: "Purple",
    price: 120,
    badge: null,
    color: "rgba(136,91,214,0.72)",
    description:
      "A streamlined access tier for stylish guests who want to be part of the night, the countdown, and the celebratory atmosphere.",
  },
  {
    id: "group",
    name: "Group",
    price: 145,
    badge: "Best Value",
    color: "rgba(77,192,182,0.72)",
    description:
      "A social booking option for four or more guests designed around shared arrival, streamlined coordination, and better value per seat.",
  },
] as const;

export const UPCOMING_EVENTS = [
  {
    title: "Arab Nights ft. Abdel Karim",
    slug: "arab-nights",
    date: "March 28, 2026",
    isoDate: "2026-03-28T20:00:00",
    venue: "Hilton LA / Universal City",
    city: "Los Angeles, CA",
    priceFrom: 120,
    status: "limited" as const,
    image: "/arabnights-1200.webp",
    summary:
      "A black-tie cultural celebration with live performance, premium dining, ceremonial arrival moments, and a deeply atmospheric midnight sequence.",
  },
  {
    title: "Ramadan Night Gala",
    slug: "ramadan-night-gala",
    date: "April 15, 2026",
    isoDate: "2026-04-15T19:30:00",
    venue: "Beverly Wilshire Hotel",
    city: "Beverly Hills, CA",
    priceFrom: 150,
    status: "upcoming" as const,
    image: "/gala-hero.jpg",
    summary:
      "An elegant evening built around hospitality, performance, fine dining, and a polished production language tailored to premium cultural gatherings.",
  },
  {
    title: "Summer Rooftop Series",
    slug: "summer-rooftop-series",
    date: "June 20, 2026",
    isoDate: "2026-06-20T18:00:00",
    venue: "SkyBar Los Angeles",
    city: "Los Angeles, CA",
    priceFrom: 80,
    status: "upcoming" as const,
    image: "/fireworks-1600.webp",
    summary:
      "A sunset-to-midnight rooftop concept featuring elevated hospitality, skyline ambience, curated DJ direction, and premium guest flow.",
  },
  {
    title: "Eid Al-Adha Celebration",
    slug: "eid-al-adha-celebration",
    date: "June 28, 2026",
    isoDate: "2026-06-28T20:00:00",
    venue: "Hilton Los Angeles",
    city: "Los Angeles, CA",
    priceFrom: 100,
    status: "upcoming" as const,
    image: "/stage-1600.webp",
    summary:
      "A large-format family and community celebration with formal production, entertainment programming, and a refined hospitality structure.",
  },
  {
    title: "New Year’s Eve Gala 2027",
    slug: "new-years-eve-gala-2027",
    date: "December 31, 2026",
    isoDate: "2026-12-31T20:30:00",
    venue: "Hilton LA / Universal City",
    city: "Los Angeles, CA",
    priceFrom: 150,
    status: "upcoming" as const,
    image: "/fireworks-1600.webp",
    summary:
      "The signature VibeUp countdown experience with cinematic staging, formal dinner service, live entertainment, and a dramatic midnight reveal.",
  },
] as const;

export const PAST_EVENTS = [
  {
    title: "New Year’s Eve Gala 2026",
    date: "December 31, 2025",
    venue: "Hilton LA",
    attendance: "800+ Guests",
    image: "/VIBEUP21-1600.webp",
    summary:
      "A full-room premium celebration that blended gala service, live performance, and one of the most memorable countdowns in our calendar.",
  },
  {
    title: "Arab Cultural Night",
    date: "October 12, 2025",
    venue: "Marriott Downtown LA",
    attendance: "500+ Guests",
    image: "/VIBEUP10.jpg",
    summary:
      "A cultural night centered on music, presentation, and community with an editorial visual direction and high guest retention.",
  },
  {
    title: "Summer Nights Festival",
    date: "July 4, 2025",
    venue: "Rooftop Venue LA",
    attendance: "300+ Guests",
    image: "/VIBEUP5.jpg",
    summary:
      "A seasonal open-air activation built around premium energy, social storytelling, and a lighter but still polished VibeUp atmosphere.",
  },
] as const;

export const FEATURED_EVENT = {
  eyebrow: "Featured Event",
  title: "Abdel Karim’s Arab Nights",
  goldWord: "Returns",
  description:
    "An evening of ceremony, voice, dining, and atmosphere produced for guests who expect more than a party. Arab Nights is built as a complete journey, from arrival and reception to performance, social immersion, and a precisely timed finale.",
  image: "/arabnights-1200.webp",
  venue: SITE.venue,
  date: "March 28",
  details: [
    "Red-carpet arrival with editorial photo moments",
    "Headline performance by Abdel Karim Hamdan",
    "Luxury hospitality flow and curated guest experience",
    "Refined seating tiers with premium table service options",
  ],
};

export const WHY_VIBEUP = [
  {
    title: "World-Class Entertainment",
    body:
      "We curate artists, performers, and programming that match the scale and tone of the room, creating events that feel intentional from the first note to the final encore.",
  },
  {
    title: "Expert Team",
    body:
      "Our producers manage timeline, vendors, logistics, styling, guest flow, and on-site execution with the calm precision premium clients expect.",
  },
  {
    title: "Full-Service Management",
    body:
      "From strategy and creative concept to technical production and post-event reporting, we cover the entire event lifecycle under one direction.",
  },
] as const;

export const SERVICES = [
  {
    category: "Event Planning",
    title: "Event Planning & Management",
    summary:
      "Complete planning and execution for private, corporate, cultural, and social gatherings with full production oversight.",
    details: [
      "Timeline design and milestone management",
      "Vendor sourcing, negotiation, and coordination",
      "Venue layout planning and guest journey mapping",
      "On-site production leadership from setup to close",
    ],
    image: "/wedding-1600.webp",
  },
  {
    category: "Production",
    title: "Artist & Talent Management",
    summary:
      "Booking, contracting, hospitality, and stage coordination for artists, DJs, hosts, and performers.",
    details: [
      "Artist outreach and booking support",
      "Contract and scheduling management",
      "Technical and hospitality coordination",
      "Performance cueing and stage management",
    ],
    image: "/dj-1600.webp",
  },
  {
    category: "Marketing",
    title: "Event Marketing & Promotion",
    summary:
      "Campaign architecture designed to sell tickets, build anticipation, and position your event with sharper cultural relevance.",
    details: [
      "Paid and organic social campaign planning",
      "Audience segmentation and platform messaging",
      "Influencer and community partner outreach",
      "Launch, countdown, and conversion reporting",
    ],
    image: "/artist-1600.webp",
  },
  {
    category: "Production",
    title: "Ticketing & Guest Management",
    summary:
      "Smooth entry systems, guest communications, list management, and VIP handling for polished front-of-house operations.",
    details: [
      "Ticket structure and access-tier setup",
      "Guest list and RSVP coordination",
      "Check-in process design and support",
      "VIP access, codes, and hospitality allocation",
    ],
    image: "/stage-1600.webp",
  },
  {
    category: "Creative",
    title: "Branding & Creative Direction",
    summary:
      "Luxury visual systems, print assets, campaign concepts, and event identities that feel premium and memorable.",
    details: [
      "Brand story and event identity development",
      "Invitation, flyer, and signage design",
      "Theme direction and styling references",
      "Digital content systems for launch and recap",
    ],
    image: "/gala-hero.jpg",
  },
  {
    category: "Creative",
    title: "Media Production",
    summary:
      "Photography, videography, live edits, and premium content capture built for social, sponsors, and lasting brand value.",
    details: [
      "Photo and video crew direction",
      "Highlight reels and short-form edits",
      "Sponsor-ready recap content",
      "Archive and asset delivery workflows",
    ],
    image: "/VIBEUP4.jpg",
  },
  {
    category: "Production",
    title: "Technical Production",
    summary:
      "Sound, lighting, stage, screens, show calling, and technical supervision for a stable, cinematic event environment.",
    details: [
      "Lighting and sound system planning",
      "LED, projection, and stage integration",
      "Live show flow and cue management",
      "Technical supervision and vendor alignment",
    ],
    image: "/fireworks-1600.webp",
  },
  {
    category: "Consulting",
    title: "Logistics & Operations",
    summary:
      "The systems layer behind a polished guest-facing experience: staffing, transportation, setup flow, and event-day operations.",
    details: [
      "Staffing plans and role assignments",
      "Transportation and equipment coordination",
      "Setup, strike, and loading schedules",
      "Guest circulation and service rhythm planning",
    ],
    image: "/production-1600.webp",
  },
  {
    category: "Marketing",
    title: "Sponsorship & Partnerships",
    summary:
      "Sponsor packaging, brand placement strategy, activation planning, and partner coordination before and during the event.",
    details: [
      "Sponsorship inventory creation",
      "Partner pitch materials and deck support",
      "Brand placement and on-site activation ideas",
      "Partner deliverables and recap reporting",
    ],
    image: "/pexels-rdne-7648047.jpg",
  },
  {
    category: "Consulting",
    title: "Consulting & Event Strategy",
    summary:
      "Advisory support for event concepts, budgets, program architecture, and growth opportunities across recurring event lines.",
    details: [
      "Concept ideation and audience positioning",
      "Budget planning and cost modelling",
      "Competitive and market review",
      "Post-event reporting and growth recommendations",
    ],
    image: "/pexels-sebastiaan9977-3379257.jpg",
  },
] as const;

export const SERVICE_PROCESS = [
  {
    title: "Consultation",
    body:
      "We align on audience, ambition, tone, budget, timeline, and business objective before a concept is ever approved.",
  },
  {
    title: "Planning",
    body:
      "We build the project architecture, vendor map, staffing logic, creative direction, and guest-flow systems that make the event feel effortless.",
  },
  {
    title: "Production",
    body:
      "Technical, visual, marketing, and logistical streams move in parallel under one lead so every moving part remains coordinated.",
  },
  {
    title: "Execution",
    body:
      "On event day, our team manages timing, transitions, hospitality, troubleshooting, and live decision-making without breaking guest experience.",
  },
  {
    title: "Follow-Up",
    body:
      "We deliver recap assets, performance notes, next-step recommendations, and the operational insight needed for stronger future events.",
  },
] as const;

export const SERVICE_PACKAGES = [
  {
    title: "Essential",
    price: "Starting at $2,500",
    body:
      "For intimate events up to 100 guests that need elegant planning, strong coordination, and a polished guest experience.",
  },
  {
    title: "Premium",
    price: "Starting at $7,500",
    body:
      "For mid-sized events from 100 to 500 guests that need fuller production support, elevated styling, and stronger execution depth.",
  },
  {
    title: "Elite",
    price: "Custom Pricing",
    body:
      "For large-format or high-visibility experiences that require full production leadership, brand integration, and white-glove planning.",
  },
] as const;

export const SERVICE_ADDONS = [
  "Luxury invitation suites and guest gifting",
  "Premium lounge styling and VIP host staffing",
  "Live content team and real-time social coverage",
  "Custom sponsor moments and activation design",
  "Airport, hotel, and artist hospitality coordination",
] as const;

export const TEAM = [
  {
    name: "Rami Farid",
    role: "Founder & Executive Producer",
    bio:
      "Rami leads the commercial vision, show direction, and guest-experience philosophy behind VibeUp’s premium event portfolio.",
  },
  {
    name: "Lina Haddad",
    role: "Creative Director",
    bio:
      "Lina shapes the visual language, styling direction, and editorial finish that makes every production feel cinematic and intentional.",
  },
  {
    name: "Omar Rahman",
    role: "Production Manager",
    bio:
      "Omar oversees timelines, technical partners, and on-site coordination with a calm operational style built for complex live events.",
  },
  {
    name: "Sara Nabil",
    role: "Marketing Lead",
    bio:
      "Sara manages campaign strategy, community visibility, and launch momentum across VibeUp’s public and ticketed experiences.",
  },
] as const;

export const VALUES = [
  {
    title: "Excellence",
    body:
      "We design for polish, clarity, and execution quality because premium brands are judged in details more than declarations.",
  },
  {
    title: "Authenticity",
    body:
      "Cultural relevance is never surface-level. We respect atmosphere, audience, and identity while translating them into modern experiences.",
  },
  {
    title: "Community",
    body:
      "Our strongest events do more than entertain. They build belonging, conversation, memory, and long-term loyalty.",
  },
] as const;

export const MILESTONES = [
  { year: "2018", title: "Founded In Los Angeles", body: "VibeUp launched with a mission to produce elevated Arab-American experiences with premium execution." },
  { year: "2019", title: "First 500-Person Event", body: "Our production model scaled into larger guest counts without losing intimacy, service rhythm, or visual identity." },
  { year: "2021", title: "Expansion To Three Cities", body: "We extended operations and partnerships across multiple markets while keeping one luxury-standard production process." },
  { year: "2023", title: "10,000 Guest Milestone", body: "A major signal that VibeUp had evolved from boutique organizer into a recognized premium event company." },
  { year: "2025", title: "International Momentum", body: "Our concepts, partnerships, and audience reach positioned the brand for broader luxury-cultural expansion." },
] as const;

export const AWARDS = [
  { title: "Best Cultural Event Experience", year: "2024", issuer: "California Nights Showcase" },
  { title: "Premium Guest Experience Recognition", year: "2025", issuer: "LA Event Producers Collective" },
  { title: "Creative Event Direction Mention", year: "2025", issuer: "West Coast Hospitality Forum" },
] as const;

export const PRESS_QUOTES = [
  {
    source: "LA Social Edit",
    quote:
      "VibeUp has developed a recognisable signature: events that feel cinematic, culturally grounded, and far more polished than the market norm.",
  },
  {
    source: "California Nights Review",
    quote:
      "The company’s strength lies in atmosphere and control. Guests feel the luxury, but the real achievement is how smoothly the night moves.",
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "Every touchpoint felt elevated. The arrival, the service rhythm, the entertainment, and the room energy all carried the same premium standard.",
    name: "Nadine K.",
    role: "Private Client",
    event: "New Year’s Eve Gala",
    rating: 5,
  },
  {
    quote:
      "VibeUp thinks like producers, not just organisers. The team saw details before we even knew they mattered, and the result felt effortless.",
    name: "Khaled M.",
    role: "Brand Partner",
    event: "Arab Cultural Night",
    rating: 5,
  },
  {
    quote:
      "The room looked expensive, the flow was controlled, and the guest experience stayed smooth until the very last moment. That is rare.",
    name: "Sahar A.",
    role: "Corporate Host",
    event: "Ramadan Night Gala",
    rating: 5,
  },
] as const;

export const PARTNERS = [
  "California Nights Entertainment",
  "Hilton Los Angeles / Universal City",
  "Beverly Wilshire",
  "SkyBar Los Angeles",
  "National Arab Orchestra",
  "FR ع",
] as const;

export const GALLERY_ITEMS = [
  { category: "events", image: "/VIBEUP21-1600.webp", title: "New Year’s Eve Gala", date: "December 31, 2025" },
  { category: "events", image: "/VIBEUP22.jpeg", title: "Arab Nights Reception", date: "March 28, 2025" },
  { category: "artists", image: "/VIBEUP9.jpg", title: "Featured Artist Performance", date: "March 28, 2025" },
  { category: "venues", image: "/stage-1600.webp", title: "Stage & Lighting Architecture", date: "January 2026" },
  { category: "behind-the-scenes", image: "/VIBEUP4.jpg", title: "Production Build", date: "October 2025" },
  { category: "events", image: "/VIBEUP10.jpg", title: "Guest Arrival Story", date: "October 12, 2025" },
  { category: "artists", image: "/VIBEUP11.jpg", title: "Voices Of Legends", date: "August 2025" },
  { category: "venues", image: "/gala-hero.jpg", title: "Dining & Table Setting", date: "January 2026" },
  { category: "behind-the-scenes", image: "/VIBEUP13.jpg", title: "Team Coordination", date: "June 2025" },
] as const;

export const GALLERY_VIDEOS = [
  {
    title: "Voices Of Legends Highlights",
    src: "/VIBEUP1.mp4",
    description:
      "A short look at atmosphere, performance, and room pacing from one of VibeUp’s signature cultural productions.",
  },
  {
    title: "Arab Nights Energy Reel",
    src: "/VIBEUP4.mp4",
    description:
      "An editorial recap focused on arrival moments, headline performance, and the emotional tempo of the event.",
  },
  {
    title: "Artist Spotlight Sequence",
    src: "/VIBEUP9.mp4",
    description:
      "A closer look at stage presence, sound environment, and the live-performance quality that anchors the guest experience.",
  },
] as const;

export const BLOG_POSTS = [
  {
    slug: "plan-the-perfect-arab-cultural-event",
    category: "Event Tips",
    title: "How to Plan the Perfect Arab Cultural Event",
    excerpt:
      "A strategic look at tone, timing, guest flow, entertainment, and hospitality for cultural events that feel modern and deeply resonant.",
    author: "VibeUp Editorial",
    readTime: "6 min read",
    date: "March 10, 2026",
    image: "/arabnights-1200.webp",
    featured: true,
  },
  {
    slug: "behind-the-scenes-new-years-eve-gala-2025",
    category: "Behind the Scenes",
    title: "Behind the Scenes: New Year’s Eve Gala 2025",
    excerpt:
      "How the room was built, how the countdown was timed, and what operational detail made the night feel seamless to guests.",
    author: "Production Team",
    readTime: "5 min read",
    date: "February 22, 2026",
    image: "/VIBEUP21-1600.webp",
    featured: false,
  },
  {
    slug: "five-reasons-to-hire-a-professional-event-company",
    category: "Event Tips",
    title: "5 Reasons to Hire a Professional Event Company",
    excerpt:
      "The difference between an event that simply happens and an experience that looks expensive, feels calm, and converts attention into reputation.",
    author: "VibeUp Editorial",
    readTime: "4 min read",
    date: "January 28, 2026",
    image: "/production-1600.webp",
    featured: false,
  },
  {
    slug: "abdel-karim-a-night-to-remember",
    category: "Artist Spotlights",
    title: "Abdel Karim: A Night to Remember",
    excerpt:
      "A look at how artist programming, room energy, and cultural memory came together inside one of VibeUp’s most talked-about nights.",
    author: "Guest Features",
    readTime: "5 min read",
    date: "January 12, 2026",
    image: "/VIBEUP9.jpg",
    featured: false,
  },
  {
    slug: "building-community-through-celebration",
    category: "Community",
    title: "Building Community Through Celebration",
    excerpt:
      "Why the best luxury cultural events do more than entertain and how event design can create belonging without losing refinement.",
    author: "VibeUp Editorial",
    readTime: "5 min read",
    date: "December 18, 2025",
    image: "/VIBEUP10.jpg",
    featured: false,
  },
  {
    slug: "vibeup-expands-to-new-york-and-chicago",
    category: "News",
    title: "VibeUp Expands to New York and Chicago",
    excerpt:
      "A strategic move that marks the next chapter in VibeUp’s premium event growth across high-opportunity markets.",
    author: "Press Desk",
    readTime: "3 min read",
    date: "November 29, 2025",
    image: "/fireworks-1600.webp",
    featured: false,
  },
] as const;

export const FAQ_GROUPS = [
  {
    category: "General",
    items: [
      {
        question: "How do I purchase tickets?",
        answer:
          "You can reserve directly through our checkout experience or use the official external purchase link when an event has a dedicated release page.",
      },
      {
        question: "Are the events family-friendly?",
        answer:
          "Some are designed for family attendance and some are adults-focused gala environments. Each event page clearly communicates age guidance and dress tone.",
      },
      {
        question: "What cities do you operate in?",
        answer:
          "Our core market is Los Angeles, with active expansion across select US cities for premium cultural and nightlife experiences.",
      },
    ],
  },
  {
    category: "Tickets",
    items: [
      {
        question: "How do I receive my ticket after purchase?",
        answer:
          "For full ticketed events, guests receive a confirmation email with their booking details and digital access instructions once payment is confirmed.",
      },
      {
        question: "Can I transfer my ticket to someone else?",
        answer:
          "Transfer options depend on the event and ticket tier. Contact our team early so we can confirm eligibility and update guest records properly.",
      },
      {
        question: "Do you offer group discounts?",
        answer:
          "Yes. Group availability depends on the event, capacity, and booking timing. Our group tier is designed for coordinated reservations and better value.",
      },
    ],
  },
  {
    category: "Services",
    items: [
      {
        question: "How can I book VibeUp for my private event?",
        answer:
          "Start through the enquiry form with your audience size, date range, event type, and budget band. We respond with a tailored next-step consultation.",
      },
      {
        question: "How far in advance should I book?",
        answer:
          "For premium experiences, earlier is always better. Larger productions benefit from at least eight to twelve weeks of planning runway.",
      },
      {
        question: "Do you provide vendor referrals?",
        answer:
          "Yes. We maintain trusted relationships across venue operations, technical production, hospitality staffing, décor, talent, and media capture.",
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We support secure card payments for ticketed experiences and structured invoicing/payment scheduling for private or corporate production work.",
      },
      {
        question: "What is your refund or cancellation policy?",
        answer:
          "Refund terms depend on the event and service agreement. Ticket policies are shown during purchase, while production agreements include custom cancellation terms.",
      },
      {
        question: "What should I wear to events?",
        answer:
          "Dress guidance is set per event. Most VibeUp signature nights lean toward elevated evening attire, black tie, or refined cultural glamour.",
      },
    ],
  },
] as const;

export const CAREER_BENEFITS = [
  {
    title: "Creative Culture",
    body:
      "Work inside an environment where visual language, atmosphere, and quality are taken seriously from concept to final guest moment.",
  },
  {
    title: "Growth Opportunities",
    body:
      "Build across production, marketing, partnerships, logistics, and storytelling while growing with a company still in active expansion.",
  },
  {
    title: "Community Impact",
    body:
      "Help create events that feel aspirational while also strengthening cultural connection, visibility, and belonging.",
  },
] as const;

export const OPEN_POSITIONS = [
  {
    role: "Event Coordinator",
    type: "Full-time",
    location: "Los Angeles",
    summary:
      "Own scheduling, guest-list support, vendor coordination, and event-day detail management for premium live experiences.",
  },
  {
    role: "Marketing Specialist",
    type: "Part-time",
    location: "Remote",
    summary:
      "Support launch campaigns, content planning, audience targeting, and event promotion across core social channels.",
  },
  {
    role: "Production Assistant",
    type: "Contract",
    location: "Los Angeles",
    summary:
      "Work on site with the production team across staging, run-of-show support, setup, and coordination.",
  },
  {
    role: "Social Media Manager",
    type: "Remote",
    location: "Remote",
    summary:
      "Lead day-to-day publishing, content rhythm, platform storytelling, and event-specific audience engagement.",
  },
  {
    role: "Graphic Designer",
    type: "Freelance",
    location: "Remote",
    summary:
      "Create premium digital assets, launch visuals, branded layouts, and event campaigns that match the luxury direction of the company.",
  },
] as const;

export const TRUST_SIGNALS = [
  "Stripe-hosted card payment with internal order tracking",
  "Confirmation email and QR tickets after paid webhook confirmation",
  "Live inventory awareness and order visibility inside the admin dashboard",
] as const;
