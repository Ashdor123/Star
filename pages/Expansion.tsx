
import React from 'react';
import { Page } from '../types';

const Expansion: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col min-h-screen px-5">
      <header className="sticky top-0 z-50 bg-background-light/90 backdrop-blur-md pt-12 pb-4 flex justify-between items-center transition-colors">
        <button onClick={() => onNavigate(Page.HOME)} className="p-2 rounded-full hover:bg-gray-100">
          <span className="material-icons-round text-3xl text-gray-600">arrow_back_ios_new</span>
        </button>
        <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">拓展学习</h1>
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <span className="material-icons-round text-3xl text-primary">stars</span>
          <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </header>

      <main className="flex-1 pb-32">
        <div className="mt-4 mb-8 bg-gradient-to-r from-primary to-orange-400 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-1">探索新世界！ 🌍</h2>
            <p className="text-orange-100 text-sm font-semibold opacity-90">通过故事和儿歌学习手语。</p>
            <button className="mt-4 bg-white text-primary px-4 py-2 rounded-xl text-sm font-bold shadow-bouncy active:translate-y-1 transition-all">
              开始每日挑战
            </button>
          </div>
          <img alt="Pattern" className="absolute right-[-10px] bottom-[-10px] w-24 h-24 object-cover rounded-full border-4 border-white/30 opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCI9X31vEt0qBFaXOuDiYKZaSMBq21g-O1ewGoT3fisa7OMNf_cLzVnuZUkcWfDMrjgtYB8iFJtnTLG9MKHsAaBZCiggC60zeKRiOAsY35laraxXjpDpX2quw2x6Ji_YkkipeO4R9X-F_9zXZF5VuAfjT1a7fQfllzJo_qNBPlhlCS7yLJknwO0yK9RjDn0QGcDxIVUIQIOfBzx0ES1nJK8ui7QyRJKfVmhgsWwN83_BLniWPwbcBPUye1y_rIQRw4f3VvOGXslwe8"/>
        </div>

        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="material-icons-round text-tertiary">music_note</span>
              儿歌
            </h3>
            <a className="text-primary text-sm font-bold" href="#">查看全部</a>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {['律动儿歌', '趣味故事', '动物朋友'].map((title, i) => (
              <div key={title} className="flex-shrink-0 w-40 bg-white rounded-2xl p-3 shadow-soft border border-gray-100 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer">
                <div className={`w-full h-28 rounded-xl ${i === 0 ? 'bg-tertiary/10' : i === 1 ? 'bg-purple-100' : 'bg-pink-100'} flex items-center justify-center mb-3`}>
                  <span className={`material-icons-round text-5xl ${i === 0 ? 'text-tertiary' : i === 1 ? 'text-purple-500' : 'text-pink-500'}`}>
                    {i === 0 ? 'child_care' : i === 1 ? 'theater_comedy' : 'pets'}
                  </span>
                </div>
                <span className="font-bold text-center text-gray-800 text-sm">{title}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
            <span className="material-icons-round text-danger">security</span>
            安全知识
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: '防溺水', desc: '游泳安全守则', icon: 'pool', color: 'blue' },
              { label: '防拐骗', desc: '保护自己不走失', icon: 'admin_panel_settings', color: 'red' },
              { label: '防火安全', desc: '紧急情况处理', icon: 'fire_extinguisher', color: 'orange' },
              { label: '防诈骗', desc: '聪明识破骗局', icon: 'phonelink_lock', color: 'purple' }
            ].map((item) => (
              <div key={item.label} className="bg-white p-4 rounded-2xl shadow-soft border-b-4 border-gray-100 flex flex-col gap-2 relative overflow-hidden group cursor-pointer active:scale-95 transition-transform">
                <span className={`material-icons-round text-4xl text-${item.color}-500 z-10`}>{item.icon}</span>
                <div>
                  <h4 className="font-bold text-gray-800">{item.label}</h4>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Expansion;
