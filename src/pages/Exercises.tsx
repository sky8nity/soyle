import { useState } from 'react';
import { exercises } from '../data/mockData';
import ExerciseCard from '../components/ExerciseCard';
import type { ExerciseCategory } from '../types';

const categories: { label: string; value: ExerciseCategory | 'all'; emoji: string }[] = [
  { label: 'All', value: 'all', emoji: '⭐' },
  { label: 'Tongue', value: 'tongue', emoji: '👅' },
  { label: 'Lips', value: 'lips', emoji: '👄' },
  { label: 'Jaw', value: 'jaw', emoji: '🦷' },
  { label: 'Breath', value: 'breath', emoji: '💨' },
];

export default function Exercises() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ExerciseCategory | 'all'>('all');

  const filtered = exercises.filter(ex => {
    const matchSearch = ex.title.toLowerCase().includes(search.toLowerCase()) ||
                        ex.targetMovement.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'all' || ex.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const counts = {
    all: exercises.length,
    tongue: exercises.filter(e => e.category === 'tongue').length,
    lips: exercises.filter(e => e.category === 'lips').length,
    jaw: exercises.filter(e => e.category === 'jaw').length,
    breath: exercises.filter(e => e.category === 'breath').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Exercises</h1>
        <p className="text-slate-500">Tongue and mouth movement training with AI feedback</p>
      </div>

      <input
        type="text"
        placeholder="🔍  Search exercises..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />

      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.value
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeCategory === cat.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {counts[cat.value]}
            </span>
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(ex => <ExerciseCard key={ex.id} exercise={ex} />)}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400">
          <div className="text-5xl mb-3">🔍</div>
          <p>No exercises found</p>
        </div>
      )}
    </div>
  );
}
