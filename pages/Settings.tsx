
import { useState } from 'react';

interface SettingsProps {
  onBack: () => void;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack, onLogout }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [notifications, setNotifications] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-6 pt-12 pb-6 flex items-center gap-4 border-b border-gray-50">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 active:scale-90 transition-transform"
        >
          <span className="material-icons-round">arrow_back</span>
        </button>
        <h1 className="text-2xl font-black text-gray-800">设置</h1>
      </header>

      <main className="flex-1 p-6 space-y-8">
        <section>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">声音与效果</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-icons-round">volume_up</span>
                </div>
                <span className="font-bold text-gray-700">音效</span>
              </div>
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-14 h-8 rounded-full transition-colors relative ${soundEnabled ? 'bg-primary' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${soundEnabled ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
                  <span className="material-icons-round">music_note</span>
                </div>
                <span className="font-bold text-gray-700">背景音乐</span>
              </div>
              <button 
                onClick={() => setMusicEnabled(!musicEnabled)}
                className={`w-14 h-8 rounded-full transition-colors relative ${musicEnabled ? 'bg-tertiary' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${musicEnabled ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">偏好设置</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                  <span className="material-icons-round">notifications</span>
                </div>
                <span className="font-bold text-gray-700">每日提醒</span>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-14 h-8 rounded-full transition-colors relative ${notifications ? 'bg-secondary' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${notifications ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">关于应用</h2>
          <div className="bg-gray-50 rounded-[2rem] p-6 text-center">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-soft flex items-center justify-center mx-auto mb-4">
              <span className="material-icons-round text-5xl text-primary">eco</span>
            </div>
            <h3 className="text-lg font-black text-gray-800">四星手语</h3>
            <p className="text-sm text-gray-400 font-bold mb-4">版本 1.2.0</p>
            <div className="flex justify-center gap-4">
              <button className="text-primary text-xs font-bold underline">隐私政策</button>
              <button className="text-primary text-xs font-bold underline">服务协议</button>
            </div>
          </div>
        </section>

        <button 
          onClick={onLogout}
          className="w-full py-4 rounded-2xl bg-red-50 text-red-500 font-black shadow-sm active:scale-95 transition-transform"
        >
          退出登录
        </button>
      </main>
    </div>
  );
};

export default Settings;
