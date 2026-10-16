import { useNavigate } from 'react-router-dom';
import type { Exercise } from '../../types';
import Badge from '../Badge';

const categoryColors: Record<string, string> = {
  tongue: 'bg-indigo-100 text-indigo-700',
  lips: 'bg-emerald-100 text-emerald-700',
  jaw: 'bg-amber-100 text-amber-700',
  breath: 'bg-purple-100 text-purple-700',
};

const categoryLabels: Record<string, string> = {
  tongue: '👅 Tongue',
  lips: '👄 Lips',
  jaw: '🦷 Jaw',
  breath: '💨 Breath',
};

export default function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/exercises/${exercise.id}`)}
      className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl">{exercise.icon}</div>
        <span className="text-2xl bg-slate-50 rounded-lg p-1">{exercise.tongueGuide}</span>
      </div>
      <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{exercise.title}</h3>
      <p className="text-slate-500 text-sm mb-3 line-clamp-2">{exercise.targetMovement}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[exercise.category]}`}>
            {categoryLabels[exercise.category]}
          </span>
          <Badge difficulty={exercise.difficulty} />
        </div>
        <span className="text-slate-400 text-xs">{exercise.duration}s</span>
      </div>
    </div>
  );
}
