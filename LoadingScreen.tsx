export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#161930] flex items-center justify-center z-[9999]">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-2 border-cyan-400/20 rounded-full" />
          <div className="absolute inset-0 border-2 border-transparent border-t-cyan-400 rounded-full animate-spin" />
          <div className="absolute inset-2 border-2 border-transparent border-t-pink-500 rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
        </div>
        <p className="text-cyan-400 text-sm font-mono tracking-widest">LOADING</p>
      </div>
    </div>
  );
}
