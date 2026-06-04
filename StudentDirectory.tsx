import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Search, Users, GraduationCap, MapPin, ChevronRight } from "lucide-react";

export default function StudentDirectory() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading } = trpc.student.list.useQuery({
    search: search || undefined,
    page,
    limit,
  });

  const students = data?.students || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#161930]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <span className="text-cyan-400 text-xs font-mono tracking-widest uppercase">
            Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-1">
            Student Directory
          </h1>
          <p className="text-white/50 mt-2 max-w-xl">
            Browse and search through all {total}+ students of Neural Nexul-17.
            View detailed profiles with skills, projects, and social links.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, ID, or roll number..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 transition-all"
            />
          </div>
        </div>

        {/* Students Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-5 animate-pulse">
                <div className="w-16 h-16 rounded-full bg-white/5 mx-auto mb-3" />
                <div className="h-4 bg-white/5 rounded w-3/4 mx-auto mb-2" />
                <div className="h-3 bg-white/5 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">No students found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {students.map((student) => (
                <Link
                  key={student.id}
                  to={`/directory/${student.id}`}
                  className="group glass rounded-2xl p-5 border-glow hover:border-cyan-400/30 transition-all hover:shadow-lg hover:shadow-cyan-400/5"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <img
                        src={student.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.fullName}`}
                        alt={student.fullName}
                        className="w-20 h-20 rounded-full object-cover border-2 border-white/10 group-hover:border-cyan-400/30 transition-all"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#161930] border border-cyan-400/30 flex items-center justify-center">
                        <GraduationCap className="w-3 h-3 text-cyan-400" />
                      </div>
                    </div>
                    <h3 className="text-white font-semibold group-hover:text-cyan-400 transition-colors">
                      {student.fullName}
                    </h3>
                    <p className="text-white/40 text-xs mt-1 font-mono">
                      {student.studentId}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-white/30 text-xs">
                      <MapPin className="w-3 h-3" />
                      {student.district || "Bangladesh"}
                    </div>
                    {student.skills && (
                      <div className="flex flex-wrap justify-center gap-1 mt-3">
                        {JSON.parse(student.skills || "[]")
                          .slice(0, 3)
                          .map((skill: string) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded-md bg-white/5 text-white/40 text-[10px] border border-white/5"
                            >
                              {skill}
                            </span>
                          ))}
                      </div>
                    )}
                    <div className="flex items-center gap-1 mt-4 text-cyan-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      View Profile <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg glass text-sm text-white/60 hover:text-white disabled:opacity-30 transition-all"
                >
                  Previous
                </button>
                <span className="text-white/40 text-sm px-3">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg glass text-sm text-white/60 hover:text-white disabled:opacity-30 transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
