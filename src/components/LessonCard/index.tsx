import { Link } from 'react-router-dom';
import type { VideoLesson } from '../../types';

export default function LessonCard({ lesson }: { lesson: VideoLesson }) {
  return (
    <Link to={`/lessons/${lesson.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200 cursor-pointer group block">
      {/* Video thumbnail */}
      <div className="relative h-36 flex items-center justify-center" style={{ backgroundColor: lesson.color + '20' }}>
        <div className="text-5xl">{lesson.thumbnail}</div>
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 ml-1" style={{ color: lesson.color }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md font-medium">
          {lesson.duration}
        </div>
        {/* Age range */}
        <div className="absolute top-2 left-2 text-white text-xs px-2 py-0.5 rounded-md font-medium" style={{ backgroundColor: lesson.color }}>
          {lesson.ageRange}
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1">{lesson.title}</h3>
        <p className="text-slate-500 text-xs mb-3 line-clamp-2">{lesson.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-xs">👩‍⚕️ {lesson.therapist}</span>
          <div className="flex gap-1">
            {lesson.tags.slice(0, 2).map(tag => (
              <span key={tag} className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
