import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-100 border-t border-slate-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🧩</span>
              <span className="text-lg font-bold text-indigo-600">Soyle</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              AI-powered speech therapy for children with autism and speech delays.
              Practice anywhere, anytime.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-slate-700 mb-3 text-sm uppercase tracking-wide">Navigation</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Dashboard' },
                { to: '/exercises', label: 'Exercises' },
                { to: '/progress', label: 'Progress' },
                { to: '/lessons', label: 'Video Lessons' },
                { to: '/profile', label: 'Profile' },
              ].map(link => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `text-sm transition-colors ${isActive ? 'text-indigo-600 font-medium' : 'text-slate-500 hover:text-indigo-500'}`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold text-slate-700 mb-3 text-sm uppercase tracking-wide">About</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>👅 Tongue movement tracking</li>
              <li>🤖 AI exercise analysis</li>
              <li>📹 Video lessons by therapists</li>
              <li>📊 Progress tracking</li>
              <li>🇰🇿 Kazakh language support</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-400 text-xs">
            © 2026 Soyle. Speech therapy for children with ASD & speech delays.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>React 18 + TypeScript</span>
            <span>·</span>
            <span>Vite + Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
