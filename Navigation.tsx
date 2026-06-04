import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  Menu,
  X,
  Users,
  Calendar,
  Image,
  FileText,
  Newspaper,
  GraduationCap,
  MessageSquare,
  Shield,
  LogOut,
  ChevronDown,
  Zap,
} from "lucide-react";

const navLinks = [
  { label: "Directory", path: "/directory", icon: Users },
  { label: "Notices", path: "/notices", icon: FileText },
  { label: "Events", path: "/events", icon: Calendar },
  { label: "Gallery", path: "/gallery", icon: Image },
  { label: "Resources", path: "/resources", icon: Zap },
  { label: "Tech News", path: "/news", icon: Newspaper },
  { label: "Alumni", path: "/alumni", icon: GraduationCap },
  { label: "Community", path: "/community", icon: MessageSquare },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === "/";
  const showNav = scrolled || !isHome;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          showNav
            ? "glass-strong translate-y-0"
            : isHome
              ? "translate-y-[-100%]"
              : "glass-strong"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-400/30 transition-all">
                <span className="text-[#161930] font-bold text-sm">N</span>
              </div>
              <span className="text-white font-semibold text-sm tracking-wide hidden sm:block">
                NEXUL-17
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1.5 ${
                      active
                        ? "text-cyan-400 bg-cyan-400/10"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <link.icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-pink-400 bg-pink-400/10 hover:bg-pink-400/20 transition-all"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                      {user.name?.[0] || "U"}
                    </div>
                    <ChevronDown className="w-3 h-3 text-white/50" />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-48 glass-strong rounded-xl p-2 z-50 animate-fade-in">
                        <div className="px-3 py-2 border-b border-white/10 mb-1">
                          <p className="text-sm font-medium text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-white/50">{user.email}</p>
                        </div>
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-1.5 rounded-lg text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-1.5 rounded-lg text-xs font-medium bg-cyan-400 text-[#161930] hover:bg-cyan-300 transition-all"
                  >
                    Join
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-all"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-16 left-0 right-0 glass-strong border-t border-white/10 p-4 animate-slide-up">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const active = location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? "text-cyan-400 bg-cyan-400/10"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {!user && (
              <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                <Link
                  to="/login"
                  className="flex-1 text-center py-2.5 rounded-lg text-sm font-medium text-white/70 border border-white/20 hover:bg-white/5 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-center py-2.5 rounded-lg text-sm font-medium bg-cyan-400 text-[#161930] hover:bg-cyan-300 transition-all"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
