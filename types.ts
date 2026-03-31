
export enum Page {
  HOME = 'home',
  LEARNING = 'learning',
  STORE = 'store',
  CHALLENGE = 'challenge',
  PROFILE = 'profile',
  LESSON_DETAIL = 'lesson_detail',
  SETTINGS = 'settings',
  EDIT_PROFILE = 'edit_profile',
  LOGIN = 'login',
  REGISTER = 'register'
}

export interface Step {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface Lesson {
  id: string;
  title: string;
  pinyin: string;
  thumbnail: string;
  steps: Step[];
  tip: string;
}

export interface User {
  id: string;
  name: string;
  account?: string;
  avatar: string;
  level?: number;
}

export interface LearningProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  progress: number;
  last_accessed: string;
}

export interface ProgressData {
  completed?: boolean;
  progress?: number;
  last_accessed?: string;
}
