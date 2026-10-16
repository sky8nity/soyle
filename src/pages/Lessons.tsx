import { useState } from 'react';
import { videoLessons } from '../data/mockData';
import LessonCard from '../components/LessonCard';

const filters = [
  { label: 'All', value: 'all' },
  { label: '👅 Tongue', value: 'tongue' },
  { label: '👄 Lips', value: 'lips' },
  { label: '🦷 Jaw', value: 'jaw' },
  { label: '💨 Breath', value: 'breath' },
  { label: '📋 General', value: 'general' },
];

export default function Lessons() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = videoLessons.filter(l =>
    activeFilter === 'all' || l.category === activeFilter
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Video Lessons</h1>
        <p className="text-slate-500">Expert-led video lessons for children with speech delays and ASD</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-indigo-600">{videoLessons.length}</p>
          <p className="text-indigo-400 text-xs mt-1">Total Lessons</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">2</p>
          <p className="text-emerald-400 text-xs mt-1">Therapists</p>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">3–10</p>
          <p className="text-purple-400 text-xs mt-1">Age Range</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === f.value
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Video grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(lesson => <LessonCard key={lesson.id} lesson={lesson} />)}
      </div>
    </div>
  );
}
