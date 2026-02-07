
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
