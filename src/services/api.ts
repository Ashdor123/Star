// 根据环境选择API基础URL
const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

interface ApiRequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  timeout?: number;
}

const DEFAULT_TIMEOUT = 15000;

async function fetchWithTimeout(url: string, options: RequestInit & { timeout?: number } = {}): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * 通用API请求函数
 * @param endpoint - API端点
 * @param options - 请求选项
 * @returns 请求结果
 */
async function apiRequest<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetchWithTimeout(url, {
      ...options,
      headers,
      timeout: options.timeout || DEFAULT_TIMEOUT,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `请求失败: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('请求超时，请检查网络连接');
      }
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('网络连接失败，请检查网络设置');
      }
    }
    console.error('API请求错误:', error);
    throw error;
  }
}

// 类型定义
export interface User {
  id: string;
  name: string;
  account?: string;
  password?: string;
  avatar: string;
  level: number;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

interface RegisterData {
  name: string;
  account: string;
  password: string;
  avatar?: string;
}

interface LoginData {
  account?: string;
  password?: string;
  guest?: boolean;
}

interface UpdateUserData {
  name?: string;
  avatar?: string;
}

// 认证相关API
export const authApi = {
  /**
   * 用户注册
   * @param userData - 用户数据
   * @returns 注册结果
   */
  register: async (userData: RegisterData) => {
    return await apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * 用户登录
   * @param loginData - 登录数据
   * @returns 登录结果
   */
  login: async (loginData: LoginData) => {
    return await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
  },

  /**
   * 获取当前用户信息
   * @returns 用户信息
   */
  getCurrentUser: async () => {
    return await apiRequest<AuthResponse>('/users/me');
  },

  /**
   * 更新用户信息
   * @param userData - 用户数据
   * @returns 更新结果
   */
  updateUser: async (userData: UpdateUserData) => {
    return await apiRequest<AuthResponse>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};

// 课程相关类型
interface Lesson {
  id: string;
  title: string;
  pinyin?: string;
  thumbnail?: string;
  tip?: string;
  created_at?: string;
}

interface Step {
  id: number;
  lesson_id: string;
  title: string;
  description?: string;
  image?: string;
  order?: number;
}

interface LearningProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  progress: number;
  last_accessed: string;
}

interface ProgressData {
  completed?: boolean;
  progress?: number;
}

// 课程相关API
export const lessonApi = {
  /**
   * 获取课程列表
   * @returns 课程列表
   */
  getLessons: () => {
    return apiRequest<Lesson[]>('/lessons');
  },

  /**
   * 获取课程详情
   * @param lessonId - 课程ID
   * @returns 课程详情
   */
  getLessonDetail: (lessonId: string) => {
    return apiRequest<Lesson>(`/lessons/${lessonId}`);
  },

  /**
   * 获取推荐课程
   * @returns 推荐课程
   */
  getFeaturedLessons: () => {
    return apiRequest<Lesson[]>('/lessons/featured');
  },
};

// 学习进度相关类型
interface ProgressResponse {
  success: boolean;
  progress: LearningProgress[];
}

interface SingleProgressResponse {
  success: boolean;
  progress: LearningProgress;
}

// 学习进度相关API
export const progressApi = {
  /**
   * 获取用户学习进度
   * @returns 学习进度
   */
  getProgress: async () => {
    const response = await apiRequest<ProgressResponse>('/progress');
    return response.progress;
  },

  /**
   * 获取特定课程的学习进度
   * @param lessonId - 课程ID
   * @returns 学习进度
   */
  getLessonProgress: async (lessonId: string) => {
    const response = await apiRequest<SingleProgressResponse>(`/progress/${lessonId}`);
    return response.progress;
  },

  /**
   * 更新学习进度
   * @param lessonId - 课程ID
   * @param progressData - 进度数据
   * @returns 更新结果
   */
  updateProgress: async (lessonId: string, progressData: ProgressData) => {
    const response = await apiRequest<SingleProgressResponse>(`/progress/${lessonId}`, {
      method: 'PUT',
      body: JSON.stringify(progressData),
    });
    return response.progress;
  },
};

export default {
  auth: authApi,
  lesson: lessonApi,
  progress: progressApi,
};