import { useState, useRef } from 'react';
import { authApi } from '../src/services/api';
import { Page, User } from '../types';
import LoginDecorations from '../components/LoginDecorations';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
  onNavigateToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigateToRegister }) => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authApi.login({ 
        account: account.trim(),
        password: password.trim()
      });
      
      if (response.success && response.token && response.user) {
        localStorage.setItem('token', response.token);
        onLoginSuccess(response.user);
      } else {
        setError('登录失败，请检查账号和密码');
      }
    } catch (err) {
      console.error('登录错误:', err);
      setError(err.message || '登录失败，请检查网络连接');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authApi.login({ 
        guest: true
      });
      
      if (response.success && response.token && response.user) {
        localStorage.setItem('token', response.token);
        onLoginSuccess(response.user);
      } else {
        setError('登录失败，请重试');
      }
    } catch (err) {
      console.error('登录错误:', err);
      setError('登录失败，请检查网络连接');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-orange-50 relative overflow-hidden" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* 装饰元素 */}
      <LoginDecorations formRef={formRef} />
      
      {/* 登录表单容器 */}
      <div className="w-full max-w-sm relative z-10 px-4">
        {/* 标题区域 */}
        <div className="text-center mb-4">
          <div className="inline-block p-3 bg-orange-100 rounded-2xl mb-2">
            <span className="material-icons-round text-orange-500 text-5xl">sign_language</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">四星手语</h1>
          <p className="text-gray-500 text-sm">儿童趣味学习平台</p>
        </div>

        {/* 登录表单 - 带边框 */}
        <div 
          ref={formRef} 
          className="bg-white rounded-3xl shadow-xl p-6 border-4 border-orange-200"
          style={{ maxHeight: 'calc(100vh - 200px)', overflow: 'hidden' }}
        >
          <h2 className="text-xl font-bold text-center text-gray-800 mb-4">欢迎回来！</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-3 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {/* 账号输入 */}
            <div className="relative">
              <input
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="请输入账号"
                className="w-full border border-orange-200 rounded-xl py-3 px-10 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-orange-50 text-sm"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400">
                <span className="material-icons-round text-lg">account_box</span>
              </div>
            </div>

            {/* 密码输入 */}
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full border border-orange-200 rounded-xl py-3 px-10 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-orange-50 text-sm"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400">
                <span className="material-icons-round text-lg">lock</span>
              </div>
            </div>

            {/* 登录按钮 */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>登录中...</span>
                </>
              ) : (
                <>
                  <span className="material-icons-round text-lg">login</span>
                  <span>登录</span>
                </>
              )}
            </button>

            {/* 分隔线 */}
            <div className="relative flex items-center justify-center py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-400">或</span>
              </div>
            </div>

            {/* 游客登录 */}
            <button
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full bg-white border-2 border-orange-500 text-orange-600 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-orange-50 text-sm"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                  <span>登录中...</span>
                </>
              ) : (
                <>
                  <span className="material-icons-round text-lg">child_care</span>
                  <span>游客登录</span>
                </>
              )}
            </button>

            {/* 分隔线 */}
            <div className="relative flex items-center justify-center py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-400">新用户？</span>
              </div>
            </div>

            {/* 注册按钮 */}
            <button
              onClick={onNavigateToRegister}
              disabled={isLoading}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
            >
              <span className="material-icons-round text-lg">person_add</span>
              <span>注册账号</span>
            </button>
          </div>

          {/* 服务条款 */}
          <div className="mt-4 text-center text-xs text-gray-400">
            <p>登录即表示您同意我们的</p>
            <div className="flex justify-center gap-2 mt-1">
              <a href="#" className="text-orange-500 hover:underline">服务条款</a>
              <a href="#" className="text-orange-500 hover:underline">隐私政策</a>
            </div>
          </div>
        </div>

        {/* 底部说明 */}
        <div className="mt-4 text-center text-xs text-gray-400">
          <p>专为 3-12 岁儿童设计</p>
          <p>让学习手语变得有趣又简单</p>
        </div>
      </div>
    </div>
  );
};

export default Login;