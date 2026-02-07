import React, { useState } from 'react';
import { authApi } from '../src/services/api';
import { Page } from '../types';

interface LoginProps {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigateToRegister }) => {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authApi.login({ 
        account: account.trim(),
        password: password.trim()
      });
      
      if (response.success && response.token) {
        // 保存token到本地存储
        localStorage.setItem('token', response.token);
        // 登录成功，调用回调函数
        onLoginSuccess();
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
      
      if (response.success && response.token) {
        // 保存token到本地存储
        localStorage.setItem('token', response.token);
        // 登录成功，调用回调函数
        onLoginSuccess();
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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-green-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-green-100 rounded-2xl mb-4">
            <span className="material-icons-round text-green-600 text-6xl">sign_language</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">四星手语</h1>
          <p className="text-gray-500">儿童趣味学习平台</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">欢迎回来！</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* 账号密码登录表单 */}
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <input
                    type="text"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    placeholder="请输入账号"
                    className="w-full border border-green-200 rounded-2xl py-4 px-12 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-green-50"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500">
                    <span className="material-icons-round">account_box</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    className="w-full border border-green-200 rounded-2xl py-4 px-12 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-green-50"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500">
                    <span className="material-icons-round">lock</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-2xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>登录中...</span>
                  </>
                ) : (
                  <>
                    <span className="material-icons-round">login</span>
                    <span>登录</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">或</span>
              </div>
            </div>

            <button
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full bg-white border-2 border-green-500 text-green-600 font-bold py-4 px-6 rounded-2xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-green-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                  <span>登录中...</span>
                </>
              ) : (
                <>
                  <span className="material-icons-round">child_care</span>
                  <span>游客登录</span>
                </>
              )}
            </button>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500">新用户？</span>
              </div>
            </div>

            <button
              onClick={onNavigateToRegister}
              disabled={isLoading}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 font-bold py-4 px-6 rounded-2xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <span className="material-icons-round">person_add</span>
              <span>注册账号</span>
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>登录即表示您同意我们的</p>
            <div className="flex justify-center gap-4 mt-1">
              <a href="#" className="text-green-600 hover:underline">服务条款</a>
              <a href="#" className="text-green-600 hover:underline">隐私政策</a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>专为 3-12 岁儿童设计</p>
          <p className="mt-1">让学习手语变得有趣又简单</p>
        </div>
      </div>
    </div>
  );
};

export default Login;