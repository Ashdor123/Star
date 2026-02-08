
import React from 'react';
import { Page } from '../types';

interface ProfileProps {
  onNavigate: (page: Page) => void;
  userName: string;
  userAvatar: string;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate, userName, userAvatar }) => {
  return (
    <div className="flex flex-col min-h-screen px-6 pt-12">
      <header className="pb-4 flex justify-between items-center z-20">
        <div className="flex items-center space-x-2">
          <span className="material-icons-round text-primary text-3xl">eco</span>
          <h1 className="text-2xl font-bold text-gray-800 tracking-wide">我的世界</h1>
        </div>
        <button 
          onClick={() => onNavigate(Page.SETTINGS)}
          className="p-2 rounded-full bg-white shadow-sm text-gray-500 active:scale-90 transition-transform"
        >
          <span className="material-icons-round">settings</span>
        </button>
      </header>

      <main className="flex-1 space-y-8 z-10 pb-8">
        <section className="relative mt-4">
          <div className="bg-gradient-to-b from-primary/10 to-transparent rounded-3xl p-6 text-center relative overflow-visible">
            <div className="relative w-40 h-40 mx-auto mb-4 group cursor-pointer" onClick={() => onNavigate(Page.EDIT_PROFILE)}>
              <div className="absolute inset-0 bg-white rounded-full shadow-soft flex items-center justify-center p-1">
                <img alt="Avatar" className="w-full h-full rounded-full bg-blue-50 object-cover" src={userAvatar} loading="lazy"/>
              </div>
              <div className="absolute bottom-2 right-2 bg-secondary text-white p-2 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
                <span className="material-icons-round text-sm">edit</span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">{userName}</h2>
            <p className="text-sm text-gray-500 mb-4">等级 3 探索者</p>
            <button 
              onClick={() => onNavigate(Page.EDIT_PROFILE)}
              className="bg-primary text-white px-6 py-2 rounded-full font-medium shadow-lg shadow-primary/30 flex items-center justify-center mx-auto space-x-2 active:scale-95 transition-transform"
            >
              <span className="material-icons-round text-sm">face</span>
              <span>个性设置</span>
            </button>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center mb-3 text-yellow-500">
              <span className="material-icons-round text-2xl">emoji_emotions</span>
            </div>
            <h3 className="font-bold text-gray-800">IP表情包</h3>
            <p className="text-xs text-gray-400 mt-1">收集可爱贴纸</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-3 text-blue-500">
              <span className="material-icons-round text-2xl">auto_stories</span>
            </div>
            <h3 className="font-bold text-gray-800">学习笔记</h3>
            <p className="text-xs text-gray-400 mt-1">复习你的手语</p>
          </div>
        </section>

        <section className="relative">
          <div className="bg-blue-50 border-2 border-blue-100 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-blue-100/50 rounded-b-3xl"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex-1 pr-4">
                <h3 className="font-bold text-lg text-gray-800 mb-2">漂流瓶</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  有想法或问题吗？把它写下来，装进瓶子里，扔进大海吧！
                </p>
                <button className="bg-white text-blue-500 px-4 py-2 rounded-xl text-sm font-bold shadow-sm flex items-center space-x-2">
                  <span className="material-icons-round text-base">edit</span>
                  <span>写留言</span>
                </button>
              </div>
              <div className="w-24 h-24 flex-shrink-0 relative">
                <div className="absolute inset-0 flex items-center justify-center floating">
                  <div className="bg-white/80 rounded-full p-3 shadow-lg border border-white/40">
                    <span className="material-icons-round text-5xl text-blue-400 transform -rotate-12">waves</span>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-red-400 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">!</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
