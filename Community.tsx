import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";

import {
  MessageSquare,
  ThumbsUp,
  Eye,
  Clock,
  Plus,
  Search,
  X,
  Send,
  MessageCircle,
  BookOpen,
  Briefcase,
  Code,
  Users,
} from "lucide-react";

const categoryConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  general: { icon: MessageCircle, color: "text-cyan-400", bg: "bg-cyan-400/10", label: "General" },
  academic: { icon: BookOpen, color: "text-purple-400", bg: "bg-purple-400/10", label: "Academic" },
  career: { icon: Briefcase, color: "text-green-400", bg: "bg-green-400/10", label: "Career" },
  technical: { icon: Code, color: "text-pink-400", bg: "bg-pink-400/10", label: "Technical" },
  social: { icon: Users, color: "text-amber-400", bg: "bg-amber-400/10", label: "Social" },
};

export default function Community() {
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("general");
  const { user } = useAuth();
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.community.list.useQuery({
    category: category || undefined,
    limit: 50,
  });

  const createMutation = trpc.community.create.useMutation({
    onSuccess: () => {
      utils.community.list.invalidate();
      setShowCreate(false);
      setNewTitle("");
      setNewContent("");
    },
  });

  const posts = data?.posts || [];

  const filtered = search
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.content.toLowerCase().includes(search.toLowerCase()),
      )
    : posts;

  const handleCreate = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    createMutation.mutate({
      title: newTitle,
      content: newContent,
      category: newCategory as any,
    });
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#161930]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <span className="text-rose-400 text-xs font-mono tracking-widest uppercase">
              Community
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mt-1">
              Discussion Forum
            </h1>
            <p className="text-white/50 mt-2">
              Join conversations, ask questions, and connect with batchmates.
            </p>
          </div>
          {user && (
            <button
              onClick={() => setShowCreate(true)}
              className="px-5 py-2.5 rounded-xl bg-rose-400 text-[#161930] font-semibold text-sm hover:bg-rose-300 transition-all flex items-center gap-2 flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              New Post
            </button>
          )}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search discussions..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-rose-400/50 transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setCategory("")}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                category === "" ? "bg-rose-400 text-[#161930]" : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              All
            </button>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  category === key ? "bg-rose-400 text-[#161930]" : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                <config.icon className="w-3.5 h-3.5" />
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-6 animate-pulse h-28" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">
              {search ? "No posts match your search" : "No posts yet. Be the first to start a discussion!"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post) => {
              const config = categoryConfig[post.category] || categoryConfig.general;
              const CategoryIcon = config.icon;

              return (
                <div
                  key={post.id}
                  className="glass rounded-2xl p-6 border-glow hover:border-rose-400/20 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg}`}
                    >
                      <CategoryIcon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase border ${config.bg} ${config.color} border-current/20`}
                        >
                          {config.label}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold group-hover:text-rose-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-white/40 text-sm mt-1 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-white/30">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          {post.likes || 0} likes
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views || 0} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-strong rounded-2xl p-6 w-full max-w-lg border-glow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create New Post</h2>
              <button
                onClick={() => setShowCreate(false)}
                className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-xs font-medium mb-1.5">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-400/50 transition-all"
                >
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <option key={key} value={key} className="bg-[#161930]">
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/70 text-xs font-medium mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-rose-400/50 transition-all"
                  placeholder="What's on your mind?"
                />
              </div>

              <div>
                <label className="block text-white/70 text-xs font-medium mb-1.5">
                  Content
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-rose-400/50 transition-all resize-none"
                  placeholder="Describe your question or discussion topic..."
                />
              </div>

              <button
                onClick={handleCreate}
                disabled={createMutation.isPending || !newTitle.trim() || !newContent.trim()}
                className="w-full py-2.5 rounded-xl bg-rose-400 text-[#161930] font-semibold text-sm hover:bg-rose-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {createMutation.isPending ? (
                  <div className="w-5 h-5 border-2 border-[#161930]/30 border-t-[#161930] rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Post Discussion
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
