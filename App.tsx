
import { useState, useCallback, useEffect, memo, lazy, Suspense } from 'react';
import { Page, Lesson } from './types';
import TabBar from './components/TabBar';
import { authApi } from "./src/services/api";

// 懒加载页面组件
const Home = lazy(() => import('./pages/Home'));
const Learning = lazy(() => import('./pages/Learning'));
const Store = lazy(() => import('./pages/Store'));
const Challenge = lazy(() => import('./pages/Challenge'));
const Profile = lazy(() => import('./pages/Profile'));
const LessonDetail = lazy(() => import('./pages/LessonDetail'));
const Settings = lazy(() => import('./pages/Settings'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [learningTab, setLearningTab] = useState<'core' | 'extended'>('core');
  
  // User Profile State
  const [userName, setUserName] = useState('星星宝贝');
  const [userAvatar, setUserAvatar] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuCSW_4Vemod3sTNTovtXknl5nGwKmnu2glkFk7b-9IlUdT3UZmOxlRBi_-r4PtN6zuNAC8bhKmI1Rr8ymbqqD28KhJFd4-jZN3_9hJteTDA15tmX9SSqyZQruYohwT0bPCJvS04B-p2MqILmEwCNWBf1lnlIUVi7KGfIi8JrERsAr9YXjRjwppJ4qjdrIfzwExN8ti82iT0-95v5qgfeQBbsUmi48sGjJEHCWIdDrx7ACBo2YVVXPoeJtvi_xL5Jv7TsBkvgoF7cTg');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 初始化时检查登录状态
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        // 检查是否已有token
        const token = localStorage.getItem('token');
        
        if (token) {
          // 有token，获取用户信息
          const response = await authApi.getCurrentUser();
          if (response.success && response.user) {
            setUserName(response.user.name);
            setUserAvatar(response.user.avatar);
            setIsAuthenticated(true);
          } else {
            // token无效，显示登录页面
            setIsAuthenticated(false);
            setCurrentPage(Page.LOGIN);
          }
        } else {
          // 无token，显示登录页面
          setIsAuthenticated(false);
          setCurrentPage(Page.LOGIN);
        }
      } catch (error) {
        console.error('初始化应用失败:', error);
        // 登录失败，显示登录页面
        setIsAuthenticated(false);
        setCurrentPage(Page.LOGIN);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // 登录函数
  const handleLogin = async (loginData: { account?: string; password?: string; guest?: boolean }) => {
    try {
      const response = await authApi.login(loginData);
      if (response.success && response.user && response.token) {
        // 保存token
        localStorage.setItem('token', response.token);
        // 更新用户信息
        setUserName(response.user.name);
        setUserAvatar(response.user.avatar);
        // 更新登录状态
        setIsAuthenticated(true);
        // 导航到首页
        setCurrentPage(Page.HOME);
      }
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  };

  // 登录成功处理函数
  const handleLoginSuccess = (user: any) => {
    // 更新用户信息
    setUserName(user.name);
    setUserAvatar(user.avatar);
    // 更新登录状态
    setIsAuthenticated(true);
    // 导航到首页
    setCurrentPage(Page.HOME);
  };

  // 注册成功处理函数
  const handleRegisterSuccess = () => {
    setCurrentPage(Page.LOGIN);
  };

  // 导航到注册页面
  const navigateToRegister = () => {
    setCurrentPage(Page.REGISTER);
  };

  // 从注册页面返回登录页面
  const navigateToLogin = () => {
    setCurrentPage(Page.LOGIN);
  };

  // 退出登录处理函数
  const handleLogout = () => {
    // 清除localStorage中的token
    localStorage.removeItem('token');
    // 设置登录状态为未登录
    setIsAuthenticated(false);
    // 导航到登录页面
    setCurrentPage(Page.LOGIN);
  };

  const navigateTo = useCallback((page: Page, lesson?: Lesson, subTab?: 'core' | 'extended') => {
    setCurrentPage(page);
    if (lesson) {
      setSelectedLesson(lesson);
    }
    if (subTab) {
      setLearningTab(subTab);
    }
  }, []);

  const renderPage = () => {
    // 加载状态组件
    const LoadingFallback = () => (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

    return (
      <Suspense fallback={<LoadingFallback />}>
        {/* 如果用户未登录，只显示登录或注册页面 */}
        {!isAuthenticated ? (
          currentPage === Page.REGISTER ? (
            <Register onRegisterSuccess={handleRegisterSuccess} onBack={navigateToLogin} />
          ) : (
            <Login onLoginSuccess={handleLoginSuccess} onNavigateToRegister={navigateToRegister} />
          )
        ) : (
          <>
            {currentPage === Page.HOME && (
              <Home onNavigate={navigateTo} userAvatar={userAvatar} userName={userName} />
            )}
            {currentPage === Page.LEARNING && (
              <Learning 
                onNavigate={navigateTo} 
                initialTab={learningTab} 
                onTabChange={setLearningTab} 
              />
            )}
            {currentPage === Page.STORE && (
              <Store onNavigate={navigateTo} />
            )}
            {currentPage === Page.CHALLENGE && (
              <Challenge onNavigate={navigateTo} userAvatar={userAvatar} />
            )}
            {currentPage === Page.PROFILE && (
              <Profile onNavigate={navigateTo} userName={userName} userAvatar={userAvatar} />
            )}
            {currentPage === Page.SETTINGS && (
              <Settings onBack={() => setCurrentPage(Page.PROFILE)} onLogout={handleLogout} />
            )}
            {currentPage === Page.EDIT_PROFILE && (
              <EditProfile 
                  userName={userName} 
                  userAvatar={userAvatar}
                  onSave={async (name, avatar) => {
                    try {
                      // 调用API更新用户信息
                      const response = await authApi.updateUser({ name, avatar });
                      if (response.success && response.user) {
                        setUserName(response.user.name);
                        setUserAvatar(response.user.avatar);
                      }
                    } catch (error) {
                      console.error('更新用户信息失败:', error);
                      // 更新失败，仍然更新本地状态
                      setUserName(name);
                      setUserAvatar(avatar);
                    } finally {
                      setCurrentPage(Page.PROFILE);
                    }
                  }}
                  onBack={() => setCurrentPage(Page.PROFILE)} 
                />
            )}
            {currentPage === Page.LESSON_DETAIL && (
              selectedLesson ? (
                <LessonDetail lesson={selectedLesson} onBack={() => setCurrentPage(Page.LEARNING)} />
              ) : (
                <Home onNavigate={navigateTo} userAvatar={userAvatar} userName={userName} />
              )
            )}
          </>
        )}
      </Suspense>
    );
  };

  const hideTabBar = [Page.LESSON_DETAIL, Page.SETTINGS, Page.EDIT_PROFILE, Page.LOGIN, Page.REGISTER].includes(currentPage);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background-light relative shadow-2xl overflow-hidden flex flex-col font-sans">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-yellow-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-0 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-20 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar relative z-10 pb-24">
        <div className="transition-opacity duration-300 animate-in fade-in">
          {renderPage()}
        </div>
      </div>

      {!hideTabBar && (
        <TabBar activeTab={currentPage} onTabChange={(page) => {
          setCurrentPage(page);
          if (page === Page.LEARNING) setLearningTab('core');
        }} />
      )}
    </div>
  );
};

export default memo(App);
