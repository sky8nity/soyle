import { Link } from 'react-router-dom';
import { exercises, userProfile, weeklyStats, categoryProgress } from '../data/mockData';
import ExerciseCard from '../components/ExerciseCard';
import ProgressBar from '../components/ProgressBar';

export default function Dashboard() {
  const todayExercises = exercises.slice(0, 3);
  const totalSessionsThisWeek = weeklyStats.reduce((a, b) => a + b.sessions, 0);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 rounded-3xl p-8 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 text-[120px] opacity-10 leading-none select-none">👅</div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">{userProfile.avatar}</span>
            <div>
              <p className="text-indigo-200 text-sm">Good morning!</p>
              <h1 className="text-2xl font-bold">Hello, {userProfile.name}! 🌟</h1>
            </div>
          </div>
          <p className="text-indigo-100 mb-5 text-sm">Ready for your tongue exercises today?</p>
          <div className="flex gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
              <p className="text-xl font-bold">🔥 {userProfile.streak}</p>
              <p className="text-indigo-200 text-xs">Day streak</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
              <p className="text-xl font-bold">{totalSessionsThisWeek}</p>
              <p className="text-indigo-200 text-xs">This week</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
              <p className="text-xl font-bold">{userProfile.totalSessions}</p>
              <p className="text-indigo-200 text-xs">Total sessions</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI tip banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
        <span className="text-2xl">🤖</span>
        <div>
          <p className="font-semibold text-emerald-800 text-sm">AI Tip for Today</p>
          <p className="text-emerald-600 text-sm">Your tongue tip control is improving! Focus on the Tongue Left–Right exercise today — your left-side movement is 15% weaker than your right.</p>
        </div>
      </div>

      {/* Today's exercises */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Today's Exercises</h2>
            <p className="text-slate-400 text-sm">Tongue & mouth movement practice</p>
          </div>
          <Link to="/exercises" className="text-indigo-600 text-sm font-medium hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {todayExercises.map(ex => <ExerciseCard key={ex.id} exercise={ex} />)}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-1">Sessions This Week</h3>
          <p className="text-slate-400 text-xs mb-4">{totalSessionsThisWeek} total sessions</p>
          <div className="flex items-end gap-2 h-28">
            {weeklyStats.map(stat => (
              <div key={stat.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-indigo-500 rounded-t-lg transition-all"
                  style={{ height: `${(stat.sessions / 5) * 100}%`, minHeight: '4px' }}
                />
                <span className="text-xs text-slate-400">{stat.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category progress */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-1">Movement Progress</h3>
          <p className="text-slate-400 text-xs mb-4">Accuracy by exercise type</p>
          <div className="space-y-4">
            {categoryProgress.map(cp => (
              <ProgressBar key={cp.category} label={cp.category} percent={cp.percent} color={cp.color} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick lesson promo */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-4xl">🎬</div>
          <div>
            <p className="font-bold text-slate-800">New Video Lesson</p>
            <p className="text-slate-500 text-sm">Daily Tongue Warm-Up · 6:15 · Dr. Aizat Bekova</p>
          </div>
        </div>
        <Link to="/lessons" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap">
          Watch Now
        </Link>
      </div>
    </div>
  );
}
