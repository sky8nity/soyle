import type { Difficulty } from '../../types';

const styles: Record<Difficulty, string> = {
  easy: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-red-100 text-red-700',
};

export default function Badge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${styles[difficulty]}`}>
      {difficulty}
    </span>
  );
}
