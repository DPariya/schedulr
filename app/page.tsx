export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-5xl font-extrabold text-white tracking-tight">Schedulr</h1>
          <p className="text-zinc-400 text-lg">
            Share your availability. Let others book time with you — effortlessly.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <a
            href="/login"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-emerald-500/25"
          >
            Login
          </a>
          <a
            href="/register"
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-xl transition-colors border border-white/10"
          >
            Register
          </a>
        </div>

        {/* Feature hints */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
          <div className="text-center space-y-1">
            <p className="text-2xl">📅</p>
            <p className="text-xs text-zinc-400">Set availability</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-2xl">🔗</p>
            <p className="text-xs text-zinc-400">Share your link</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-2xl">✉️</p>
            <p className="text-xs text-zinc-400">Get notified</p>
          </div>
        </div>
      </div>
    </div>
  );
}
