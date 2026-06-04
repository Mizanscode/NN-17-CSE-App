import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import {
  Users,
  BookOpen,
  Calendar,
  Image,
  Zap,
  ArrowRight,
  TrendingUp,
  Award,
  Target,
  MapPin,
} from "lucide-react";
import HeroScene from "@/components/HeroScene";

export default function Home() {
  const { data: statsData } = trpc.student.getStats.useQuery();
  const { data: noticesData } = trpc.notice.list.useQuery({ limit: 3 });
  const { data: eventsData } = trpc.event.list.useQuery({ limit: 3 });

  return (
    <div className="relative">
      <HeroSection />
      <QuickStats stats={statsData} />
      <BentoGrid />
      <NoticesPreview notices={noticesData?.notices || []} />
      <EventsPreview events={eventsData?.events || []} />
      <DepartmentHistory />
      <CTASection />
    </div>
  );
}

/* ═══════ HERO SECTION ═══════ */
function HeroSection() {
  const [currentText, setCurrentText] = useState(0);
  const cycleTexts = [
    "CONNECTING",
    "COLLABORATING",
    "INNOVATING",
    "LEARNING",
    "EXPLORING",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % cycleTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden bg-[#161930]">
      {/* Three.js Canvas Background */}
      <HeroScene />

      {/* Cycling Background Text */}
      <div className="absolute inset-0 flex items-center justify-center z-[1] pointer-events-none">
        <span className="text-[10vw] sm:text-[8vw] font-black text-white/[0.03] tracking-widest select-none transition-opacity duration-500">
          {cycleTexts[currentText]}
        </span>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/5 mb-6 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 text-xs font-mono tracking-widest">
              CSE, JAGANNATH UNIVERSITY
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight animate-slide-up">
            Neural{" "}
            <span className="text-gradient-cyan">Nexul-17</span>
          </h1>

          <p
            className="text-lg sm:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            The premier digital platform for the Computer Science &amp;
            Engineering Department — where students, faculty, and alumni connect,
            collaborate, and innovate together.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              to="/directory"
              className="group px-8 py-3.5 rounded-xl bg-cyan-400 text-[#161930] font-semibold text-sm hover:bg-cyan-300 transition-all flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-400/30"
            >
              Explore Directory
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/5 hover:border-white/30 transition-all"
            >
              Join the Community
            </Link>
          </div>

          {/* Stats Row */}
          <div
            className="flex items-center justify-center gap-8 sm:gap-12 mt-16 animate-slide-up"
            style={{ animationDelay: "0.6s" }}
          >
            {[
              { value: "60+", label: "Students" },
              { value: "15", label: "Courses" },
              { value: "4", label: "Years" },
              { value: "1", label: "Family" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-white/40 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-white/30 text-xs font-mono">SCROLL</span>
        <div className="w-px h-8 bg-gradient-to-b from-cyan-400/50 to-transparent" />
      </div>
    </section>
  );
}

/* ═══════ QUICK STATS ═══════ */
function QuickStats({ stats }: { stats: any }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const statsList = [
    {
      icon: Users,
      label: "Total Students",
      value: stats?.totalStudents || 60,
      color: "cyan",
    },
    {
      icon: BookOpen,
      label: "Active Members",
      value: stats?.activeMembers || 55,
      color: "pink",
    },
    {
      icon: Calendar,
      label: "Events Organized",
      value: 12,
      color: "purple",
    },
    {
      icon: Zap,
      label: "Resources",
      value: 25,
      color: "green",
    },
  ];

  return (
    <section ref={ref} className="relative py-20 bg-[#161930]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsList.map((stat, i) => (
            <div
              key={stat.label}
              className={`glass rounded-2xl p-6 border-glow transition-all duration-700 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                  stat.color === "cyan"
                    ? "bg-cyan-400/10 text-cyan-400"
                    : stat.color === "pink"
                      ? "bg-pink-500/10 text-pink-500"
                      : stat.color === "purple"
                        ? "bg-purple-500/10 text-purple-500"
                        : "bg-green-500/10 text-green-500"
                }`}
              >
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-white/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════ BENTO GRID ═══════ */
function BentoGrid() {
  const cards = [
    {
      title: "Student Directory",
      description:
        "Browse and search through all 60+ students of Neural Nexul-17. View detailed profiles with skills, projects, and social links.",
      path: "/directory",
      image: "/images/bento-directory.jpg",
      size: "large",
      icon: Users,
      color: "from-cyan-400/20 to-cyan-600/5",
    },
    {
      title: "Events",
      description:
        "Discover upcoming workshops, hackathons, seminars, and programming contests. Register and participate.",
      path: "/events",
      image: "/images/bento-events.jpg",
      size: "medium",
      icon: Calendar,
      color: "from-purple-400/20 to-purple-600/5",
    },
    {
      title: "Academic Resources",
      description:
        "Access course materials, lecture notes, previous questions, programming books, and research papers.",
      path: "/resources",
      image: "/images/bento-resources.jpg",
      size: "tall",
      icon: BookOpen,
      color: "from-pink-400/20 to-pink-600/5",
    },
    {
      title: "Photo Gallery",
      description:
        "Explore memories from batch events, study tours, workshops, and university programs.",
      path: "/gallery",
      image: "/images/bento-gallery.jpg",
      size: "medium",
      icon: Image,
      color: "from-green-400/20 to-green-600/5",
    },
    {
      title: "Tech News",
      description:
        "Stay updated with the latest in AI, cybersecurity, programming, and the Bangladesh tech ecosystem.",
      path: "/news",
      image: "/images/bento-news.jpg",
      size: "wide",
      icon: TrendingUp,
      color: "from-amber-400/20 to-amber-600/5",
    },
    {
      title: "Community",
      description: "Join discussions, ask questions, and connect with your batchmates.",
      path: "/community",
      image: "/images/bento-community.jpg",
      size: "medium",
      icon: Target,
      color: "from-rose-400/20 to-rose-600/5",
    },
    {
      title: "Alumni Network",
      description: "Connect with graduates working at top companies worldwide.",
      path: "/alumni",
      image: "/images/bento-alumni.jpg",
      size: "tall",
      icon: Award,
      color: "from-indigo-400/20 to-indigo-600/5",
    },
  ];

  return (
    <section className="py-20 bg-[#161930]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-cyan-400 text-xs font-mono tracking-widest uppercase">
            Explore
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
            Everything at Your Fingertips
          </h2>
          <p className="text-white/50 mt-3 max-w-xl mx-auto">
            A complete ecosystem for academic collaboration, resource sharing,
            and community building.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {cards.map((card) => {
            const gridClass =
              card.size === "large"
                ? "md:col-span-2 md:row-span-2"
                : card.size === "wide"
                  ? "md:col-span-2"
                  : card.size === "tall"
                    ? "md:row-span-2"
                    : "";

            return (
              <Link
                key={card.path}
                to={card.path}
                className={`group relative overflow-hidden rounded-2xl glass border-glow transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${gridClass}`}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-40 transition-opacity duration-700"
                  style={{ backgroundImage: `url(${card.image})` }}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-50`}
                />

                {/* Content */}
                <div className="relative z-10 h-full p-6 flex flex-col justify-end">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:bg-cyan-400/10 group-hover:border-cyan-400/30 transition-all">
                    <card.icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors line-clamp-2">
                    {card.description}
                  </p>
                  <div className="flex items-center gap-1 mt-3 text-cyan-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════ NOTICES PREVIEW ═══════ */
function NoticesPreview({ notices }: { notices: any[] }) {
  const categoryColors: Record<string, string> = {
    exam: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    seminar: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    department: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    class: "text-green-400 bg-green-400/10 border-green-400/20",
    assignment: "text-pink-400 bg-pink-400/10 border-pink-400/20",
    emergency: "text-red-400 bg-red-400/10 border-red-400/20",
  };

  return (
    <section className="py-20 bg-[#13162d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-cyan-400 text-xs font-mono tracking-widest uppercase">
              Stay Updated
            </span>
            <h2 className="text-3xl font-bold text-white mt-1">
              Latest Notices
            </h2>
          </div>
          <Link
            to="/notices"
            className="flex items-center gap-1 text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {notices.slice(0, 3).map((notice) => (
            <Link
              key={notice.id}
              to="/notices"
              className="group flex items-start gap-4 p-5 rounded-xl glass border-glow hover:border-cyan-400/30 transition-all"
            >
              {notice.isPinned && (
                <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 flex-shrink-0 animate-pulse" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase border ${
                      categoryColors[notice.category] || categoryColors.department
                    }`}
                  >
                    {notice.category}
                  </span>
                  {notice.isPinned && (
                    <span className="text-[10px] text-pink-400 font-medium">
                      PINNED
                    </span>
                  )}
                </div>
                <h3 className="text-white font-medium group-hover:text-cyan-400 transition-colors truncate">
                  {notice.title}
                </h3>
                <p className="text-white/40 text-sm mt-1 line-clamp-1">
                  {notice.content}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════ EVENTS PREVIEW ═══════ */
function EventsPreview({ events }: { events: any[] }) {
  const typeColors: Record<string, string> = {
    workshop: "text-cyan-400 bg-cyan-400/10",
    seminar: "text-purple-400 bg-purple-400/10",
    hackathon: "text-pink-400 bg-pink-400/10",
    contest: "text-amber-400 bg-amber-400/10",
    department_program: "text-green-400 bg-green-400/10",
  };

  return (
    <section className="py-20 bg-[#161930]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-pink-400 text-xs font-mono tracking-widest uppercase">
              Coming Up
            </span>
            <h2 className="text-3xl font-bold text-white mt-1">
              Upcoming Events
            </h2>
          </div>
          <Link
            to="/events"
            className="flex items-center gap-1 text-pink-400 text-sm hover:text-pink-300 transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.slice(0, 3).map((event) => (
            <Link
              key={event.id}
              to="/events"
              className="group glass rounded-2xl overflow-hidden border-glow hover:border-pink-400/30 transition-all"
            >
              <div className="h-36 bg-gradient-to-br from-[#1e2040] to-[#161930] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/bento-events.jpg')] bg-cover bg-center opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase ${
                      typeColors[event.eventType] || typeColors.workshop
                    }`}
                  >
                    {event.eventType}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-white font-semibold group-hover:text-pink-400 transition-colors line-clamp-1">
                  {event.title}
                </h3>
                <p className="text-white/40 text-sm mt-2 line-clamp-2">
                  {event.description}
                </p>
                <div className="flex items-center gap-4 mt-4 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(event.startDate).toLocaleDateString()}
                  </span>
                  {event.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.location}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════ DEPARTMENT HISTORY ═══════ */
function DepartmentHistory() {
  const milestones = [
    {
      year: "1858",
      title: "Dhaka Brahma School Founded",
      desc: "The institution that would become Jagannath University began as Dhaka Brahma School, established by Dinanath Sen and others.",
    },
    {
      year: "1884",
      title: "Jagannath College Established",
      desc: "Elevated to second-grade college status by Kishorilal Roy Chowdhury, who renamed it after his father Jagannath.",
    },
    {
      year: "2005",
      title: "University Status Achieved",
      desc: "Jagannath College was transformed into a full public university through the Jagannath University Act-2005.",
    },
    {
      year: "2009",
      title: "CSE Department Founded",
      desc: "The Department of Computer Science & Engineering began its academic activities under the Faculty of Science.",
    },
    {
      year: "2022",
      title: "Neural Nexul-17 Begins",
      desc: "Our batch, Neural Nexul-17, started the journey with 60+ passionate students ready to shape the future of technology.",
    },
    {
      year: "2025",
      title: "Digital Platform Launch",
      desc: "The Neural Nexul-17 platform was launched to connect students, faculty, alumni, and the broader tech community.",
    },
  ];

  return (
    <section className="py-20 bg-[#13162d] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-purple-400 text-xs font-mono tracking-widest uppercase">
            Our Legacy
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
            Department History
          </h2>
          <p className="text-white/50 mt-3 max-w-xl mx-auto">
            From a small school in 1858 to a thriving CSE department in 2025 —
            a journey of excellence.
          </p>
        </div>

        <div className="relative">
          {/* Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400/50 via-purple-400/50 to-transparent hidden md:block" />

          <div className="space-y-12 md:space-y-16">
            {milestones.map((m, i) => (
              <div
                key={m.year}
                className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-12 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div
                  className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}
                >
                  <div className="glass rounded-2xl p-6 border-glow hover:border-purple-400/30 transition-all group">
                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-mono">
                      {m.year}
                    </span>
                    <h3 className="text-lg font-semibold text-white mt-2 group-hover:text-cyan-400 transition-colors">
                      {m.title}
                    </h3>
                    <p className="text-sm text-white/50 mt-2 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                </div>

                {/* Dot */}
                <div className="hidden md:flex w-4 h-4 rounded-full bg-purple-400 border-4 border-[#13162d] shadow-lg shadow-purple-400/50 z-10 flex-shrink-0" />

                {/* Spacer */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════ CTA SECTION ═══════ */
function CTASection() {
  return (
    <section className="py-24 bg-[#161930] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-400/5 blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Ready to <span className="text-gradient-cyan">Connect</span>?
        </h2>
        <p className="text-white/50 text-lg max-w-xl mx-auto mb-10">
          Join the Neural Nexul-17 community today and be part of something
          extraordinary.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 text-[#161930] font-bold text-sm hover:shadow-lg hover:shadow-cyan-400/30 transition-all"
          >
            Get Started Now
          </Link>
          <Link
            to="/directory"
            className="px-8 py-4 rounded-xl border border-white/20 text-white font-medium text-sm hover:bg-white/5 transition-all"
          >
            Browse Directory
          </Link>
        </div>
      </div>
    </section>
  );
}


