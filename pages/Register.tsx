import { useState } from 'react';
import { authApi } from '../src/services/api';
import { Page } from '../types';

interface RegisterProps {
  onRegisterSuccess: () => void;
  onBack: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onBack }) => {
  const [userName, setUserName] = useState('');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!userName.trim()) {
      setError('请输入用户名');
      return;
    }

    if (!account.trim()) {
      setError('请输入账号');
      return;
    }

    if (!password.trim()) {
      setError('请输入密码');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authApi.register({ 
        name: userName.trim(),
        account: account.trim(),
        password: password.trim()
      });
      
      if (response.success && response.user) {
        onRegisterSuccess();
      } else {
        setError('注册失败，请重试');
      }
    } catch (err) {
      console.error('注册错误:', err);
      setError('注册失败，请检查网络连接');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-orange-50 relative overflow-hidden" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* 返回按钮 */}
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white flex items-center justify-center text-orange-500 shadow-sm z-20"
      >
        <span className="material-icons-round">arrow_back</span>
      </button>
      
      {/* 注册表单容器 */}
      <div className="w-full max-w-sm relative z-10 px-4">
        {/* 标题区域 */}
        <div className="text-center mb-4">
          <div className="inline-block p-3 bg-orange-100 rounded-2xl mb-2">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              <span className="material-icons-round text-orange-500 text-4xl">waving_hand</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">四星手语</h1>
          <p className="text-gray-500 text-sm">儿童趣味学习平台</p>
        </div>

        {/* 注册表单 */}
        <div 
          className="bg-white rounded-3xl shadow-xl p-6"
          style={{ maxHeight: 'calc(100vh - 200px)', overflow: 'hidden' }}
        >
          <h2 className="text-xl font-bold text-center text-gray-800 mb-1">欢迎你，小朋友！</h2>
          <p className="text-center text-gray-500 mb-4 text-sm">让我们一起来学习手语吧</p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-3 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {/* 用户名输入 */}
            <div className="relative">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="给自己起个名字"
                className="w-full border border-orange-200 rounded-xl py-3 px-10 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-orange-50 text-sm"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400">
                <span className="material-icons-round text-lg">person</span>
              </div>
            </div>

            {/* 账号输入 */}
            <div className="relative">
              <input
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="设置账号"
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
                placeholder="设置密码"
                className="w-full border border-orange-200 rounded-xl py-3 px-10 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-orange-50 text-sm"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400">
                <span className="material-icons-round text-lg">lock</span>
              </div>
            </div>

            {/* 注册按钮 */}
            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>注册中...</span>
                </>
              ) : (
                <>
                  <span>开始学习</span>
                  <span className="material-icons-round text-lg">arrow_forward</span>
                </>
              )}
            </button>

            {/* 登录链接 */}
            <div className="text-center pt-2">
              <p className="text-gray-500 text-sm">
                已有账号？
                <button 
                  onClick={onBack}
                  className="text-orange-600 font-medium ml-1 hover:underline"
                >
                  登录
                </button>
              </p>
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

export default Register;