import { useState } from "react";
import { trpc } from "@/providers/trpc";
import {
  GraduationCap,
  Building2,

  Linkedin,
  Mail,
  Search,
  Briefcase,

} from "lucide-react";

export default function Alumni() {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");

  const { data, isLoading } = trpc.alumni.list.useQuery({
    industry: industry || undefined,
    limit: 50,
  });

  const alumni = data?.alumni || [];

  const filtered = search
    ? alumni.filter(
        (a) =>
          a.fullName.toLowerCase().includes(search.toLowerCase()) ||
          a.currentCompany?.toLowerCase().includes(search.toLowerCase()) ||
          a.jobPosition?.toLowerCase().includes(search.toLowerCase()),
      )
    : alumni;

  const industries = [...new Set(alumni.map((a) => a.industry).filter(Boolean))];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#161930]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <span className="text-indigo-400 text-xs font-mono tracking-widest uppercase">
            Network
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-1">
            Alumni Network
          </h1>
          <p className="text-white/50 mt-2">
            Connect with graduates working at top companies worldwide.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search alumni by name, company, or role..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-indigo-400/50 transition-all"
            />
          </div>
          {industries.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setIndustry("")}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  industry === "" ? "bg-indigo-400 text-[#161930]" : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                All
              </button>
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setIndustry(ind || "")}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    industry === ind ? "bg-indigo-400 text-[#161930]" : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                <div className="w-16 h-16 rounded-full bg-white/5 mx-auto mb-3" />
                <div className="h-4 bg-white/5 rounded w-3/4 mx-auto mb-2" />
                <div className="h-3 bg-white/5 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <GraduationCap className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">No alumni found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((alumnus) => (
              <div
                key={alumnus.id}
                className="glass rounded-2xl p-6 border-glow hover:border-indigo-400/30 transition-all group"
              >
                <div className="flex flex-col items-center text-center">
                  <img
                    src={
                      alumnus.profilePicture ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${alumnus.fullName}`
                    }
                    alt={alumnus.fullName}
                    className="w-20 h-20 rounded-full object-cover border-2 border-indigo-400/20 group-hover:border-indigo-400/40 transition-all mb-4"
                  />
                  <h3 className="text-white font-semibold group-hover:text-indigo-400 transition-colors">
                    {alumnus.fullName}
                  </h3>
                  {alumnus.currentCompany && (
                    <p className="text-indigo-400 text-xs mt-1 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {alumnus.currentCompany}
                    </p>
                  )}
                  {alumnus.jobPosition && (
                    <p className="text-white/40 text-xs mt-0.5 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {alumnus.jobPosition}
                    </p>
                  )}
                  <p className="text-white/30 text-xs mt-1 font-mono">
                    Class of {alumnus.graduationYear}
                  </p>
                  {alumnus.industry && (
                    <span className="mt-2 px-2 py-0.5 rounded-md bg-indigo-400/10 text-indigo-400 text-[10px] border border-indigo-400/20">
                      {alumnus.industry}
                    </span>
                  )}

                  {/* Social Links */}
                  <div className="flex items-center gap-2 mt-4">
                    {alumnus.linkedinUrl && (
                      <a
                        href={alumnus.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/30 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {alumnus.email && (
                      <a
                        href={`mailto:${alumnus.email}`}
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/30 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
