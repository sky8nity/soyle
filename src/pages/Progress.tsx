import { recentSessions, weeklyStats, categoryProgress, userProfile } from '../data/mockData';
import ProgressBar from '../components/ProgressBar';

export default function Progress() {
  const avgScore = Math.round(
    recentSessions.reduce((acc, s) => acc + s.score, 0) / recentSessions.length
  );
  const maxSessions = Math.max(...weeklyStats.map(s => s.sessions));

  const statCards = [
    { label: 'Total Sessions', value: userProfile.totalSessions, icon: '📋' },
    { label: 'Avg Score', value: `${avgScore}%`, icon: '⭐' },
    { label: 'Best Streak', value: `${userProfile.streak} days`, icon: '🔥' },
    { label: 'Level', value: userProfile.level, icon: '🏆' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Progress</h1>
        <p className="text-slate-500">Track {userProfile.name}'s speech therapy journey</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(stat => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-slate-400 text-sm mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly sessions bar chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">Sessions This Week</h3>
          <div className="flex items-end gap-2 h-36">
            {weeklyStats.map(stat => (
              <div key={stat.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-slate-400">{stat.sessions}</span>
                <div
                  className="w-full bg-indigo-500 rounded-t-md transition-all"
                  style={{ height: `${(stat.sessions / maxSessions) * 100}%` }}
                />
                <span className="text-xs text-slate-400">{stat.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Avg score chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">Avg Score This Week</h3>
          <div className="flex items-end gap-2 h-36">
            {weeklyStats.map(stat => (
              <div key={stat.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-slate-400">{stat.avgScore}</span>
                <div
                  className="w-full bg-emerald-400 rounded-t-md transition-all"
                  style={{ height: `${(stat.avgScore / 100) * 100}%` }}
                />
                <span className="text-xs text-slate-400">{stat.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category progress */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-5">Category Progress</h3>
        <div className="space-y-4">
          {categoryProgress.map(cp => (
            <ProgressBar key={cp.category} label={cp.category} percent={cp.percent} color={cp.color} />
          ))}
        </div>
      </div>

      {/* Recent sessions table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Recent Sessions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-500 text-sm">
                <th className="px-6 py-3 font-medium">Exercise</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Score</th>
                <th className="px-6 py-3 font-medium">Duration</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentSessions.map(session => (
                <tr key={session.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-800 font-medium">{session.exerciseTitle}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{session.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`font-semibold ${
                        session.score >= 85
                          ? 'text-emerald-600'
                          : session.score >= 70
                          ? 'text-amber-600'
                          : 'text-red-500'
                      }`}
                    >
                      {session.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{session.duration}s</td>
                  <td className="px-6 py-4">
                    {session.completed ? (
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        Completed
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        Partial
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
