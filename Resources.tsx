import { useState } from "react";
import { trpc } from "@/providers/trpc";
import {
  FileText,
  Download,
  BookOpen,
  FileQuestion,
  Library,
  Presentation,
  ClipboardList,
  FlaskConical,
  ScrollText,
  Search,
  File,
} from "lucide-react";

const categoryConfig: Record<string, { icon: any; color: string; label: string }> = {
  pdf_notes: { icon: FileText, color: "text-cyan-400", label: "PDF Notes" },
  lecture_slides: { icon: Presentation, color: "text-purple-400", label: "Lecture Slides" },
  previous_questions: { icon: FileQuestion, color: "text-amber-400", label: "Previous Questions" },
  programming_books: { icon: Library, color: "text-pink-400", label: "Programming Books" },
  lab_reports: { icon: FlaskConical, color: "text-green-400", label: "Lab Reports" },
  course_materials: { icon: BookOpen, color: "text-blue-400", label: "Course Materials" },
  assignments: { icon: ClipboardList, color: "text-orange-400", label: "Assignments" },
  research_papers: { icon: ScrollText, color: "text-indigo-400", label: "Research Papers" },
};

const fileTypeIcons: Record<string, any> = {
  pdf: FileText,
  ppt: Presentation,
  doc: File,
};

export default function Resources() {
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = trpc.resource.list.useQuery({
    category: category || undefined,
    limit: 50,
  });

  const downloadMutation = trpc.resource.incrementDownloads.useMutation();
  const resources = data?.resources || [];

  const filtered = search
    ? resources.filter(
        (r) =>
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.description?.toLowerCase().includes(search.toLowerCase()),
      )
    : resources;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#161930]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <span className="text-amber-400 text-xs font-mono tracking-widest uppercase">
            Resources
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-1">
            Academic Resources
          </h1>
          <p className="text-white/50 mt-2">
            Course materials, lecture notes, previous questions, programming books, and more.
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
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-400/50 transition-all"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          <button
            onClick={() => setCategory("")}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              category === "" ? "bg-amber-400 text-[#161930]" : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            All Resources
          </button>
          {Object.entries(categoryConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                category === key ? "bg-amber-400 text-[#161930]" : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              <config.icon className="w-3.5 h-3.5" />
              {config.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-5 animate-pulse h-20" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">No resources found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((resource) => {
              const config = categoryConfig[resource.category] || categoryConfig.pdf_notes;
              const CategoryIcon = config.icon;
              const FileIcon = fileTypeIcons[resource.fileType || "pdf"] || File;

              return (
                <div
                  key={resource.id}
                  className="glass rounded-2xl p-5 border-glow hover:border-amber-400/20 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${config.color.replace("text-", "bg-").replace("400", "400/10")}`}
                    >
                      <CategoryIcon className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-semibold group-hover:text-amber-400 transition-colors">
                          {resource.title}
                        </h3>
                        {resource.fileType && (
                          <span className="px-2 py-0.5 rounded bg-white/5 text-white/40 text-[10px] uppercase font-medium">
                            {resource.fileType}
                          </span>
                        )}
                      </div>
                      {resource.description && (
                        <p className="text-white/40 text-sm mt-1">{resource.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-white/30 text-xs flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {resource.downloads || 0} downloads
                        </span>
                        <span
                          className={`text-xs flex items-center gap-1 ${config.color}`}
                        >
                          <FileIcon className="w-3 h-3" />
                          {config.label}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadMutation.mutate({ id: resource.id })}
                      className="flex-shrink-0 px-4 py-2 rounded-xl bg-amber-400/10 text-amber-400 text-xs font-medium border border-amber-400/20 hover:bg-amber-400/20 transition-all flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
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
