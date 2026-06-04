import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Image, Heart, X, ChevronLeft, ChevronRight, Grid3x3, FolderOpen } from "lucide-react";

const categoryLabels: Record<string, string> = {
  batch_events: "Batch Events",
  university_programs: "University Programs",
  seminars: "Seminars",
  workshops: "Workshops",
  study_tours: "Study Tours",
  memories: "Memories",
};

export default function Gallery() {
  const [category, setCategory] = useState("");
  const [albumFilter, setAlbumFilter] = useState<number | undefined>();
  const [lightbox, setLightbox] = useState<number | null>(null);

  const { data: albums } = trpc.gallery.listAlbums.useQuery();
  const { data, isLoading } = trpc.gallery.listItems.useQuery({
    category: category || undefined,
    albumId: albumFilter,
    limit: 50,
  });

  const items = data?.items || [];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#161930]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <span className="text-purple-400 text-xs font-mono tracking-widest uppercase">
            Gallery
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-1">
            Photo Gallery
          </h1>
          <p className="text-white/50 mt-2">
            Explore memories from batch events, study tours, workshops, and more.
          </p>
        </div>

        {/* Albums */}
        {albums && albums.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <FolderOpen className="w-4 h-4 text-white/40" />
              <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">
                Albums
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setAlbumFilter(undefined)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  albumFilter === undefined
                    ? "bg-purple-400 text-[#161930]"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                <Grid3x3 className="w-3.5 h-3.5" />
                All Photos
              </button>
              {albums.map((album) => (
                <button
                  key={album.id}
                  onClick={() => setAlbumFilter(album.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    albumFilter === album.id
                      ? "bg-purple-400 text-[#161930]"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {album.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          <button
            onClick={() => setCategory("")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              category === "" ? "bg-cyan-400 text-[#161930]" : "bg-white/5 text-white/50 hover:bg-white/10"
            }`}
          >
            All
          </button>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                category === key ? "bg-cyan-400 text-[#161930]" : "bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square glass rounded-xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <Image className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">No photos found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setLightbox(index)}
                className="group relative aspect-square rounded-xl overflow-hidden glass border-glow hover:border-purple-400/30 transition-all"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-white text-xs font-medium truncate">{item.title}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Heart className="w-3 h-3 text-pink-400" />
                    <span className="text-white/60 text-[10px]">{item.likes}</span>
                  </div>
                </div>
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/50 text-white/60 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                  {categoryLabels[item.category] || item.category}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && items[lightbox] && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            onClick={() => setLightbox(null)}
          >
            <X className="w-5 h-5" />
          </button>

          {lightbox > 0 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {lightbox < items.length - 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <div className="max-w-5xl max-h-[85vh] px-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={items[lightbox].imageUrl}
              alt={items[lightbox].title}
              className="max-w-full max-h-[75vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center">
              <p className="text-white font-medium">{items[lightbox].title}</p>
              <p className="text-white/40 text-sm mt-1">{items[lightbox].description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
