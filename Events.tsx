import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import {
  Calendar,
  MapPin,
  Users,
  Clock,

  CheckCircle,
  Mic,
  Code,
  Trophy,
  Zap,
  PartyPopper,
} from "lucide-react";

const typeConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  workshop: { icon: Zap, color: "text-cyan-400", bg: "bg-cyan-400/10", label: "Workshop" },
  seminar: { icon: Mic, color: "text-purple-400", bg: "bg-purple-400/10", label: "Seminar" },
  hackathon: { icon: Code, color: "text-pink-400", bg: "bg-pink-400/10", label: "Hackathon" },
  contest: { icon: Trophy, color: "text-amber-400", bg: "bg-amber-400/10", label: "Contest" },
  department_program: { icon: PartyPopper, color: "text-green-400", bg: "bg-green-400/10", label: "Department Program" },
};

export default function Events() {
  const [filter, setFilter] = useState("");
  const { user } = useAuth();
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.event.list.useQuery({
    type: filter || undefined,
    limit: 50,
  });

  const registerMutation = trpc.event.register.useMutation({
    onSuccess: () => {
      utils.event.list.invalidate();
    },
  });

  const events = data?.events || [];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#161930]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <span className="text-pink-400 text-xs font-mono tracking-widest uppercase">
            Events
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-1">
            Upcoming Events
          </h1>
          <p className="text-white/50 mt-2">
            Discover workshops, hackathons, seminars, and programming contests.
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          <button
            onClick={() => setFilter("")}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              filter === "" ? "bg-pink-400 text-[#161930]" : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            All Events
          </button>
          {Object.entries(typeConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                filter === key ? "bg-pink-400 text-[#161930]" : "bg-white/5 text-white/60 hover:bg-white/10"
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
              <div key={i} className="glass rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">No events found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => {
              const config = typeConfig[event.eventType] || typeConfig.workshop;
              const EventIcon = config.icon;
              const startDate = new Date(event.startDate);

              return (
                <div
                  key={event.id}
                  className="glass rounded-2xl overflow-hidden border-glow hover:border-pink-400/20 transition-all group"
                >
                  {/* Image */}
                  <div className="h-40 bg-gradient-to-br from-[#1e2040] to-[#161930] relative overflow-hidden">
                    <div
                      className="absolute inset-0 bg-[url('/images/bento-events.jpg')] bg-cover bg-center opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase flex items-center gap-1 ${config.bg} ${config.color}`}
                      >
                        <EventIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 glass rounded-lg px-3 py-1.5 text-center">
                      <span className="text-lg font-bold text-white">
                        {startDate.getDate()}
                      </span>
                      <span className="block text-[10px] text-white/50 uppercase">
                        {startDate.toLocaleString("default", { month: "short" })}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-white font-semibold group-hover:text-pink-400 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-white/40 text-sm mt-2 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="flex flex-col gap-1.5 mt-4 text-xs text-white/40">
                      {event.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {event.maxAttendees && (
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3 h-3" />
                          Max {event.maxAttendees} attendees
                        </span>
                      )}
                    </div>

                    {user && (
                      <button
                        onClick={() => registerMutation.mutate({ eventId: event.id })}
                        disabled={registerMutation.isPending}
                        className="w-full mt-4 py-2.5 rounded-xl bg-pink-400/10 text-pink-400 text-sm font-medium border border-pink-400/20 hover:bg-pink-400/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Register
                      </button>
                    )}
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
