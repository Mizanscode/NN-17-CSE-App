import { useEffect } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import {
  Users,
  FileText,
  Calendar,
  BookOpen,
  Image,
  Newspaper,
  GraduationCap,
  MessageSquare,
  TrendingUp,
  Shield,
  AlertCircle,
} from "lucide-react";

const statCards = [
  { key: "totalUsers", label: "Total Users", icon: Users, color: "cyan" },
  { key: "totalStudents", label: "Students", icon: GraduationCap, color: "indigo" },
  { key: "totalNotices", label: "Notices", icon: FileText, color: "amber" },
  { key: "totalEvents", label: "Events", icon: Calendar, color: "pink" },
  { key: "totalResources", label: "Resources", icon: BookOpen, color: "green" },
  { key: "totalGalleryItems", label: "Gallery Items", icon: Image, color: "purple" },
  { key: "totalTechNews", label: "Tech Articles", icon: Newspaper, color: "sky" },
  { key: "totalCommunityPosts", label: "Community Posts", icon: MessageSquare, color: "rose" },
];

const colorMap: Record<string, { text: string; bg: string; border: string }> = {
  cyan: { text: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/20" },
  indigo: { text: "text-indigo-400", bg: "bg-indigo-400/10", border: "border-indigo-400/20" },
  amber: { text: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
  pink: { text: "text-pink-400", bg: "bg-pink-400/10", border: "border-pink-400/20" },
  green: { text: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
  purple: { text: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
  sky: { text: "text-sky-400", bg: "bg-sky-400/10", border: "border-sky-400/20" },
  rose: { text: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20" },
};

export default function AdminDashboard() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: stats, isLoading } = trpc.dashboard.getStats.useQuery(undefined, {
    enabled: isAdmin,
    retry: false,
  });

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/");
    }
  }, [authLoading, isAdmin, navigate]);

  if (authLoading) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-[#161930] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-[#161930] flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center border-glow">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-white/50">You need admin privileges to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#161930]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-pink-400" />
            <span className="text-pink-400 text-xs font-mono tracking-widest uppercase">
              Admin Panel
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Dashboard
          </h1>
          <p className="text-white/50 mt-2">
            Overview of platform activity and statistics.
          </p>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 animate-pulse h-28" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {statCards.map((card) => {
              const colors = colorMap[card.color];
              const value = stats?.[card.key as keyof typeof stats] || 0;

              return (
                <div
                  key={card.key}
                  className={`glass rounded-2xl p-5 border-glow hover:border-cyan-400/20 transition-all`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center mb-3`}
                  >
                    <card.icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold text-white">{value as number}</p>
                  <p className="text-white/40 text-xs mt-1">{card.label}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Recent Activity */}
        {!isLoading && stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Recent Notices */}
            <div className="glass rounded-2xl p-6 border-glow">
              <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-amber-400" />
                Recent Notices
              </h3>
              <div className="space-y-3">
                {stats.recentNotices?.slice(0, 5).map((notice: any) => (
                  <div
                    key={notice.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{notice.title}</p>
                      <p className="text-white/30 text-xs">
                        {new Date(notice.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {(!stats.recentNotices || stats.recentNotices.length === 0) && (
                  <p className="text-white/30 text-sm text-center py-4">No notices yet</p>
                )}
              </div>
            </div>

            {/* Recent Events */}
            <div className="glass rounded-2xl p-6 border-glow">
              <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-pink-400" />
                Recent Events
              </h3>
              <div className="space-y-3">
                {stats.recentEvents?.slice(0, 5).map((event: any) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-pink-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{event.title}</p>
                      <p className="text-white/30 text-xs">
                        {new Date(event.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {(!stats.recentEvents || stats.recentEvents.length === 0) && (
                  <p className="text-white/30 text-sm text-center py-4">No events yet</p>
                )}
              </div>
            </div>

            {/* Role Distribution */}
            {stats.roleDistribution && stats.roleDistribution.length > 0 && (
              <div className="glass rounded-2xl p-6 border-glow lg:col-span-2">
                <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  User Role Distribution
                </h3>
                <div className="flex flex-wrap gap-4">
                  {stats.roleDistribution.map((role: any) => (
                    <div
                      key={role.role}
                      className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.02]"
                    >
                      <div className="w-3 h-3 rounded-full bg-cyan-400" />
                      <div>
                        <p className="text-white text-sm font-medium capitalize">
                          {role.role.replace("_", " ")}
                        </p>
                        <p className="text-white/40 text-xs">{role.count} users</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
