import { useParams, useNavigate } from 'react-router-dom';
import { videoLessons } from '../data/mockData';

export default function LessonDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lesson = videoLessons.find(l => l.id === id);

  if (!lesson) return (
    <div className="text-center py-20">
      <p className="text-slate-400">Lesson not found.</p>
      <button onClick={() => navigate('/lessons')} className="mt-4 text-indigo-600 hover:underline">← Back</button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => navigate('/lessons')} className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1">
        ← Back to Lessons
      </button>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
        {lesson.videoUrl ? (
          <video src={lesson.videoUrl} controls className="w-full bg-slate-900" style={{ aspectRatio: '16/9' }} />
        ) : (
          <div
            className="flex flex-col items-center justify-center gap-2"
            style={{ aspectRatio: '16/9', backgroundColor: lesson.color + '15' }}
          >
            <div className="text-6xl">{lesson.thumbnail}</div>
            <p className="text-slate-400 text-sm font-medium">Video coming soon</p>
          </div>
        )}

        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800">{lesson.title}</h1>
              <p className="text-slate-400 text-sm mt-1">👩‍⚕️ {lesson.therapist}</p>
            </div>
            <span
              className="text-white text-xs px-2 py-1 rounded-md font-medium whitespace-nowrap"
              style={{ backgroundColor: lesson.color }}
            >
              {lesson.ageRange}
            </span>
          </div>

          <p className="text-slate-600 text-sm">{lesson.description}</p>

          <div className="flex items-center gap-3">
            <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-full font-medium">
              ⏱ {lesson.duration}
            </span>
            {lesson.tags.map(tag => (
              <span key={tag} className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
