export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo / Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-5xl font-bold text-white tracking-tight">Schedulr</h1>
          <p className="text-slate-400 text-lg">
            Share your availability. Let others book time with you — effortlessly.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <a
            href="/login"
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-8 py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/25"
          >
            Login
          </a>
          <a
            href="/register"
            className="bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-3 rounded-xl transition-colors border border-white/10"
          >
            Register
          </a>
        </div>

        {/* Feature hints */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
          <div className="text-center space-y-1">
            <p className="text-2xl">📅</p>
            <p className="text-xs text-slate-400">Set availability</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-2xl">🔗</p>
            <p className="text-xs text-slate-400">Share your link</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-2xl">✉️</p>
            <p className="text-xs text-slate-400">Get notified</p>
          </div>
        </div>
      </div>
    </div>
  );
}
