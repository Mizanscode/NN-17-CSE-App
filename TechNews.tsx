import { useState } from "react";
import { trpc } from "@/providers/trpc";
import {
  Newspaper,

  Eye,
  ExternalLink,
  Brain,
  Cpu,
  Shield,
  Code,
  Cloud,
  Bot,
  Rocket,
  Database,
  Search,
} from "lucide-react";

const categoryConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  ai: { icon: Brain, color: "text-cyan-400", bg: "bg-cyan-400/10", label: "AI" },
  machine_learning: { icon: Cpu, color: "text-purple-400", bg: "bg-purple-400/10", label: "ML" },
  cyber_security: { icon: Shield, color: "text-red-400", bg: "bg-red-400/10", label: "Security" },
  programming: { icon: Code, color: "text-green-400", bg: "bg-green-400/10", label: "Programming" },
  software_engineering: { icon: Code, color: "text-blue-400", bg: "bg-blue-400/10", label: "SE" },
  cloud_computing: { icon: Cloud, color: "text-sky-400", bg: "bg-sky-400/10", label: "Cloud" },
  robotics: { icon: Bot, color: "text-orange-400", bg: "bg-orange-400/10", label: "Robotics" },
  startups: { icon: Rocket, color: "text-pink-400", bg: "bg-pink-400/10", label: "Startups" },
  data_science: { icon: Database, color: "text-amber-400", bg: "bg-amber-400/10", label: "Data Science" },
};

export default function TechNews() {
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = trpc.techNews.list.useQuery({
    category: category || undefined,
    limit: 50,
  });

  const viewMutation = trpc.techNews.incrementViews.useMutation();
  const articles = data?.articles || [];

  const filtered = search
    ? articles.filter(
        (a) =>
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.summary.toLowerCase().includes(search.toLowerCase()),
      )
    : articles;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#161930]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <span className="text-green-400 text-xs font-mono tracking-widest uppercase">
            Tech Pulse
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-1">
            Technology News
          </h1>
          <p className="text-white/50 mt-2">
            Stay updated with the latest in AI, cybersecurity, programming, and tech.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-green-400/50 transition-all"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          <button
            onClick={() => setCategory("")}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              category === "" ? "bg-green-400 text-[#161930]" : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            All News
          </button>
          {Object.entries(categoryConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                category === key ? "bg-green-400 text-[#161930]" : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              <config.icon className="w-3.5 h-3.5" />
              {config.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">No articles found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((article) => {
              const config = categoryConfig[article.category] || categoryConfig.ai;
              const CategoryIcon = config.icon;

              return (
                <div
                  key={article.id}
                  className="glass rounded-2xl overflow-hidden border-glow hover:border-green-400/20 transition-all group flex flex-col"
                >
                  {/* Image */}
                  <div className="h-44 bg-gradient-to-br from-[#1e2040] to-[#161930] relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-[url('/images/bento-news.jpg')] bg-cover bg-center opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase flex items-center gap-1 ${config.bg} ${config.color}`}
                      >
                        <CategoryIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3
                      className="text-white font-semibold group-hover:text-green-400 transition-colors line-clamp-2 cursor-pointer"
                      onClick={() => article.id && viewMutation.mutate({ id: article.id })}
                    >
                      {article.title}
                    </h3>
                    <p className="text-white/40 text-sm mt-2 line-clamp-3 flex-1">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                      <span className="text-white/30 text-xs flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {article.views || 0} views
                      </span>
                      {article.sourceUrl && (
                        <a
                          href={article.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-400 text-xs flex items-center gap-1 hover:text-green-300 transition-colors"
                          onClick={() => article.id && viewMutation.mutate({ id: article.id })}
                        >
                          Read More <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
