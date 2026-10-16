import { useState } from 'react';
import { userProfile, recentSessions, categoryProgress } from '../data/mockData';
import ProgressBar from '../components/ProgressBar';

interface ToggleProps {
  label: string;
  description: string;
  defaultOn?: boolean;
}

function SettingsToggle({ label, description, defaultOn = false }: ToggleProps) {
  const [on, setOn] = useState(defaultOn);

  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-slate-800 font-medium text-sm">{label}</p>
        <p className="text-slate-400 text-xs mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => setOn(prev => !prev)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
          on ? 'bg-indigo-600' : 'bg-slate-200'
        }`}
        role="switch"
        aria-checked={on}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
            on ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

export default function Profile() {
  const avgScore = Math.round(
    recentSessions.reduce((acc, s) => acc + s.score, 0) / recentSessions.length
  );

  const achievements = [
    { icon: '🔥', label: '7-Day Streak', earned: true },
    { icon: '⭐', label: 'First 90% Score', earned: true },
    { icon: '🏅', label: '10 Sessions', earned: true },
    { icon: '🎯', label: '50 Sessions', earned: false },
    { icon: '🦋', label: 'Vowel Master', earned: false },
    { icon: '🏆', label: 'Advanced Level', earned: false },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Profile</h1>
        <p className="text-slate-500">Manage {userProfile.name}'s account and preferences</p>
      </div>

      {/* Profile hero card */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-3xl p-8 text-white text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
          {userProfile.avatar}
        </div>
        <h2 className="text-2xl font-bold">{userProfile.name}</h2>
        <p className="text-indigo-200 text-sm mt-0.5">Age {userProfile.age} · {userProfile.level} Level</p>
        <div className="flex justify-center gap-8 mt-6">
          <div className="text-center">
            <p className="text-xl font-bold">{userProfile.totalSessions}</p>
            <p className="text-indigo-200 text-xs">Sessions</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{avgScore}%</p>
            <p className="text-indigo-200 text-xs">Avg Score</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">🔥 {userProfile.streak}</p>
            <p className="text-indigo-200 text-xs">Day Streak</p>
          </div>
        </div>
      </div>

      {/* Category progress */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4">Skill Progress</h3>
        <div className="space-y-4">
          {categoryProgress.map(cp => (
            <ProgressBar key={cp.category} label={cp.category} percent={cp.percent} color={cp.color} />
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4">Achievements</h3>
        <div className="grid grid-cols-3 gap-3">
          {achievements.map(ach => (
            <div
              key={ach.label}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all ${
                ach.earned
                  ? 'bg-indigo-50 border-indigo-200'
                  : 'bg-slate-50 border-slate-100 opacity-40 grayscale'
              }`}
            >
              <span className="text-2xl">{ach.icon}</span>
              <span className="text-xs font-medium text-slate-700 leading-tight">{ach.label}</span>
              {ach.earned && (
                <span className="text-xs text-indigo-600 font-semibold">Earned</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-2">Settings</h3>
        <SettingsToggle
          label="Daily Reminder Notifications"
          description="Get notified at 9:00 AM to practice"
          defaultOn={true}
        />
        <SettingsToggle
          label="Session Sound Effects"
          description="Play audio cues during exercises"
          defaultOn={true}
        />
        <SettingsToggle
          label="Dark Mode"
          description="Switch to a darker color theme"
          defaultOn={false}
        />
        <SettingsToggle
          label="AI Camera Analysis"
          description="Use computer vision for real-time feedback"
          defaultOn={true}
        />
        <SettingsToggle
          label="Weekly Progress Report"
          description="Receive weekly summary emails"
          defaultOn={false}
        />
      </div>

      {/* About */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-3">About Soyle</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-4">
          Soyle is an AI-powered speech therapy application designed to help children with autism
          spectrum disorder (ASD) develop clearer speech through engaging, gamified exercises with
          real-time computer vision feedback.
        </p>
        <div className="flex gap-3 flex-wrap">
          <span className="bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full">
            Version 1.0.0
          </span>
          <span className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full">
            Kazakh Language Support
          </span>
          <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full">
            ASD Certified Curriculum
          </span>
        </div>
      </div>
    </div>
  );
}
