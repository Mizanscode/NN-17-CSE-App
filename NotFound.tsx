import { Link } from "react-router";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#161930] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-cyan-400/10 flex items-center justify-center mx-auto mb-6 border border-cyan-400/20">
          <AlertTriangle className="w-10 h-10 text-cyan-400" />
        </div>
        <h1 className="text-6xl font-bold text-white mb-2">404</h1>
        <p className="text-white/50 text-lg mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 text-[#161930] font-semibold text-sm hover:bg-cyan-300 transition-all"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
