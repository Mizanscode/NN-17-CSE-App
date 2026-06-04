import { useState } from "react";
import { trpc } from "@/providers/trpc";
import {
  FileText,
  Pin,
  Calendar,
  Search,

  AlertTriangle,
  BookOpen,
  Users,
  Mic,
  GraduationCap,
} from "lucide-react";

const categoryConfig: Record<string, { icon: any; color: string; label: string }> = {
  exam: { icon: GraduationCap, color: "text-amber-400 bg-amber-400/10 border-amber-400/20", label: "Exam" },
  seminar: { icon: Mic, color: "text-purple-400 bg-purple-400/10 border-purple-400/20", label: "Seminar" },
  department: { icon: Users, color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20", label: "Department" },
  class: { icon: BookOpen, color: "text-green-400 bg-green-400/10 border-green-400/20", label: "Class" },
  assignment: { icon: FileText, color: "text-pink-400 bg-pink-400/10 border-pink-400/20", label: "Assignment" },
  emergency: { icon: AlertTriangle, color: "text-red-400 bg-red-400/10 border-red-400/20", label: "Emergency" },
};

export default function Notices() {
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = trpc.notice.list.useQuery({
    category: category || undefined,
    limit: 50,
  });

  const notices = data?.notices || [];
  const pinned = notices.filter((n) => n.isPinned);
  const regular = notices.filter((n) => !n.isPinned);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#161930]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <span className="text-cyan-400 text-xs font-mono tracking-widest uppercase">
            Notice Board
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-1">
            Official Notices
          </h1>
          <p className="text-white/50 mt-2">
            Stay updated with the latest announcements from the department.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notices..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setCategory("")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                category === "" ? "bg-cyan-400 text-[#161930]" : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              All
            </button>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  category === key ? "bg-cyan-400 text-[#161930]" : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                <config.icon className="w-3.5 h-3.5" />
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-white/5 rounded w-1/4 mb-3" />
                <div className="h-3 bg-white/5 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Pinned Notices */}
            {pinned.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Pin className="w-4 h-4 text-pink-400" />
                  <span className="text-pink-400 text-xs font-semibold uppercase tracking-wider">
                    Pinned
                  </span>
                </div>
                <div className="space-y-3">
                  {pinned.map((notice) => (
                    <NoticeCard key={notice.id} notice={notice} />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Notices */}
            {regular.length > 0 && (
              <div className="mt-8">
                {pinned.length > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4 text-white/30" />
                    <span className="text-white/30 text-xs font-semibold uppercase tracking-wider">
                      All Notices
                    </span>
                  </div>
                )}
                <div className="space-y-3">
                  {regular.map((notice) => (
                    <NoticeCard key={notice.id} notice={notice} />
                  ))}
                </div>
              </div>
            )}

            {notices.length === 0 && (
              <div className="text-center py-20">
                <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/50">No notices found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function NoticeCard({ notice }: { notice: any }) {
  const config = categoryConfig[notice.category] || categoryConfig.department;
  const CategoryIcon = config.icon;

  return (
    <div className="glass rounded-2xl p-6 border-glow hover:border-cyan-400/20 transition-all group">
      <div className="flex items-start gap-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.color}`}
        >
          <CategoryIcon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase border ${config.color}`}
            >
              {config.label}
            </span>
            {notice.isPinned && (
              <span className="text-[10px] text-pink-400 font-medium flex items-center gap-0.5">
                <Pin className="w-3 h-3" />
                PINNED
              </span>
            )}
          </div>
          <h3 className="text-white font-semibold group-hover:text-cyan-400 transition-colors">
            {notice.title}
          </h3>
          <p className="text-white/50 text-sm mt-2 leading-relaxed">
            {notice.content}
          </p>
          <div className="flex items-center gap-4 mt-3 text-xs text-white/30">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(notice.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
