

import { Page } from '../types';

interface ChallengeProps {
  onNavigate: (page: Page) => void;
  userAvatar: string;
}

const Challenge: React.FC<ChallengeProps> = ({ onNavigate, userAvatar }) => {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background-light">
      <header className="relative z-10 px-6 pt-12 pb-4 flex justify-between items-center bg-white/80 backdrop-blur-md rounded-b-3xl shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-yellow-300 p-1 shadow-lg">
            <img alt="User" className="w-full h-full rounded-full border-2 border-white object-cover" src={userAvatar}/>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 leading-tight">你好, 小星星!</h1>
            <div className="flex items-center space-x-1">
              <span className="material-icons-round text-yellow-500 text-sm">star</span>
              <span className="text-sm font-bold text-primary">1,240</span>
              <span className="text-xs text-gray-500">得分</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => onNavigate(Page.SETTINGS)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 active:scale-90 transition-transform"
        >
          <span className="material-icons-round">settings</span>
        </button>
      </header>

      <main className="flex-1 relative z-0 overflow-y-auto hide-scrollbar">
        {/* Animated Map Path */}
        <svg className="absolute top-0 left-0 w-full h-[800px] pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M 210 60 Q 210 120 120 160 T 100 280 T 280 400 T 200 550 T 80 650" 
            fill="none" 
            stroke="#FFB74D" 
            strokeDasharray="12 12" 
            strokeLinecap="round" 
            strokeWidth="6"
          ></path>
        </svg>

        <div className="relative w-full h-[800px] px-6 py-8">
          {/* Level 1 Node */}
          <div className="absolute top-[30px] left-1/2 transform -translate-x-1/2 flex flex-col items-center group cursor-pointer z-10">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 ring-4 ring-white">
                <span className="material-icons-round text-4xl text-white floating">pets</span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                <span className="material-icons-round text-white text-sm">lock_open</span>
              </div>
            </div>
            <div className="mt-3 bg-white px-4 py-2 rounded-xl shadow-soft text-center">
              <h3 className="font-bold text-gray-800 text-sm">小蝌蚪找妈妈</h3>
              <p className="text-xs text-gray-500">第1关</p>
            </div>
          </div>

          <div className="absolute top-[200px] left-[60px] flex flex-col items-center opacity-80 z-10">
            <div className="w-16 h-16 rounded-2xl bg-gray-200 shadow-inner flex items-center justify-center ring-4 ring-white">
              <span className="material-icons-round text-3xl text-gray-400">sailing</span>
            </div>
            <div className="mt-2 bg-white/90 px-3 py-1 rounded-lg shadow-sm">
              <h3 className="font-bold text-gray-600 text-xs">宰相肚里能撑船</h3>
            </div>
          </div>

          <div className="absolute top-[620px] left-1/4 flex flex-col items-center z-10 cursor-pointer animate-bounce">
            <img alt="Treasure" className="w-20 h-20 drop-shadow-xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDmnjWnDdmyh_tLPGIOp0bjVAxPjwal8l9BO23IQ08lnop_T46-wG0JL4F_TxSskZDZmjaIgEZcaRIwU1-cELqTvPl-1CZKZ6RavrIcAqTa42_ldYTjP1zxTb_qbxpfiBbrvoDZRMM6xBKABnMPz1Yoh4D9xdGb7bEuKPZ2D5JCbsg733UDUEwftK5DGzbEK7lOKoVaUX2cGZdlN8HJgY_NXkXCLtZLwPXRzO6G3DiaKy1Kh_Bos3ypJfjb92z4Csu-_VAfeBsMhg"/>
            <div className="mt-1 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-bold">解锁新服装</div>
          </div>
        </div>
      </main>

      <div className="absolute bottom-28 left-4 right-4 bg-white rounded-3xl p-5 shadow-2xl border border-gray-100 z-20">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">小蝌蚪找妈妈</h2>
            <p className="text-sm text-gray-500">连线挑战 · 难度 ⭐⭐</p>
          </div>
          <div className="flex space-x-1">
            <span className="material-icons-round text-yellow-400">star</span>
            <span className="material-icons-round text-yellow-400">star</span>
            <span className="material-icons-round text-gray-300">star</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-2xl flex-shrink-0">
            <span className="material-icons-round text-blue-500 text-2xl">gesture</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            帮助小蝌蚪找到青蛙妈妈！观看手语视频，将正确的单词与图片连线。
          </p>
        </div>
        <button className="w-full bg-primary hover:bg-orange-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2">
          <span className="material-icons-round">play_arrow</span>
          <span>开始挑战</span>
        </button>
      </div>
    </div>
  );
};

export default Challenge;
