import { Link } from "react-router";
import {
  Zap,
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
  Twitter,
  Heart,
} from "lucide-react";

const footerLinks = [
  {
    title: "Platform",
    links: [
      { label: "Student Directory", path: "/directory" },
      { label: "Notices", path: "/notices" },
      { label: "Events", path: "/events" },
      { label: "Gallery", path: "/gallery" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Academic Resources", path: "/resources" },
      { label: "Tech News", path: "/news" },
      { label: "Alumni Network", path: "/alumni" },
      { label: "Community", path: "/community" },
    ],
  },
  {
    title: "Institution",
    links: [
      { label: "Jagannath University", href: "https://jnu.ac.bd" },
      { label: "CSE Department", href: "https://jnu.ac.bd/department/portal/cse" },
      { label: "Admission", href: "https://jnu.ac.bd/admission" },
    ],
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/10 bg-[#111329]">
      {/* Shimmer Email */}
      <div className="py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/40 text-sm mb-4 font-mono tracking-widest uppercase">
            Get in Touch
          </p>
          <a
            href="mailto:contact@nexul17.jnu.ac.bd"
            className="inline-block text-2xl sm:text-4xl md:text-5xl font-bold text-white/90 hover:text-cyan-400 transition-all duration-500 group"
          >
            <span className="relative">
              contact@nexul17.jnu.ac.bd
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-pink-500 group-hover:w-full transition-all duration-500" />
            </span>
          </a>
          <div className="flex items-center justify-center gap-6 mt-8">
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-cyan-400 hover:border-cyan-400/50 transition-all"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-cyan-400 hover:border-cyan-400/50 transition-all"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-cyan-400 hover:border-cyan-400/50 transition-all"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                  <span className="text-[#161930] font-bold">N</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">NEXUL-17</h3>
                  <p className="text-white/40 text-xs">CSE, Jagannath University</p>
                </div>
              </Link>
              <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-4">
                The premier digital platform for the Computer Science &amp;
                Engineering Department at Jagannath University. Connecting
                students, faculty, and alumni.
              </p>
              <div className="flex flex-col gap-2 text-sm text-white/40">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sadarghat, Dhaka-1100, Bangladesh</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>info@jnu.ac.bd</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>+88-02-9534255</span>
                </div>
              </div>
            </div>

            {/* Links */}
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="text-white font-semibold text-sm mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-2.5">
                  {section.links.map((link: any) =>
                    link.href ? (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white/50 text-sm hover:text-cyan-400 transition-colors"
                        >
                          {link.label}
                        </a>
                      </li>
                    ) : (
                      <li key={link.label}>
                        <Link
                          to={link.path}
                          className="text-white/50 text-sm hover:text-cyan-400 transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-pink-500" /> by Neural
            Nexul-17 &middot; CSE, Jagannath University
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <Link to="/" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/" className="hover:text-white transition-colors">
              Terms
            </Link>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
            >
              <Zap className="w-3 h-3" />
              Back to Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
