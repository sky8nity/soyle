export type Difficulty = 'easy' | 'medium' | 'hard';

export type ExerciseCategory = 'tongue' | 'lips' | 'jaw' | 'breath';

export interface TonguePosition {
  label: string;
  description: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  category: ExerciseCategory;
  difficulty: Difficulty;
  duration: number;
  instructions: string[];
  icon: string;
  tongueGuide: string; // emoji or symbol showing target position
  targetMovement: string; // short description of the tongue/mouth movement
}

export interface VideoLesson {
  id: string;
  title: string;
  therapist: string;
  duration: string; // e.g. "4:32"
  ageRange: string; // e.g. "3–6 years"
  category: ExerciseCategory | 'general';
  color: string;
  description: string;
  tags: string[];
  thumbnail: string; // emoji
  videoUrl?: string; // playable video source; empty/undefined shows a "coming soon" state
}

export interface Session {
  id: string;
  exerciseId: string;
  exerciseTitle: string;
  date: string;
  score: number;
  duration: number;
  completed: boolean;
}

export interface UserProfile {
  name: string;
  age: number;
  level: string;
  streak: number;
  totalSessions: number;
  avatar: string;
  diagnosis: string; // 'ASD' | 'Speech Delay' | 'Both'
}

export interface WeeklyStat {
  day: string;
  sessions: number;
  avgScore: number;
}
