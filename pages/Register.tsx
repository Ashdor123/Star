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
        // 注册成功，调用回调函数
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
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-green-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <button 
            onClick={onBack}
            className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm"
          >
            <span className="material-icons-round">arrow_back</span>
          </button>
          <div className="inline-block p-4 bg-green-100 rounded-2xl mb-4">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
              <img 
                src="https://neeko-copilot.bytedance.net/api/text2image?prompt=cute%20child%20cartoon%20waving%20hand&size=512x512" 
                alt="欢迎" 
                className="w-16 h-16 object-cover"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">四星手语</h1>
          <p className="text-gray-500 mb-4">儿童趣味学习平台</p>
          <div className="bg-green-100 inline-block px-4 py-2 rounded-full">
            <span className="text-green-600 font-medium">注册账号</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">欢迎你，小朋友！</h2>
            <p className="text-gray-500">让我们一起来学习手语吧</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-6">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* 用户名输入 */}
            <div>
              <div className="relative">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="给自己起个名字"
                  className="w-full border border-green-200 rounded-2xl py-4 px-12 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-green-50"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500">
                  <span className="material-icons-round">person</span>
                </div>
              </div>
            </div>

            {/* 账号输入 */}
            <div>
              <div className="relative">
                <input
                  type="text"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  placeholder="设置账号"
                  className="w-full border border-green-200 rounded-2xl py-4 px-12 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-green-50"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500">
                  <span className="material-icons-round">account_box</span>
                </div>
              </div>
            </div>

            {/* 密码输入 */}
            <div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="设置密码"
                  className="w-full border border-green-200 rounded-2xl py-4 px-12 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-green-50"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500">
                  <span className="material-icons-round">lock</span>
                </div>
              </div>
            </div>

            {/* 注册按钮 */}
            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-2xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>注册中...</span>
                </>
              ) : (
                <>
                  <span>开始学习</span>
                  <span className="material-icons-round">arrow_forward</span>
                </>
              )}
            </button>

            {/* 登录链接 */}
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                已有账号？
                <button 
                  onClick={onBack}
                  className="text-green-600 font-medium ml-1"
                >
                  登录
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;