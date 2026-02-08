
import { useState, useEffect, useCallback, memo } from 'react';
import { Page, Lesson } from '../types';
import { progressApi } from '../src/services/api';

interface LearningProps {
  onNavigate: (page: Page, lesson?: Lesson) => void;
  initialTab?: 'core' | 'extended';
  onTabChange?: (tab: 'core' | 'extended') => void;
}

const HELLO_LESSON: Lesson = {
  id: 'hello',
  title: '你好',
  pinyin: 'Nǐ Hǎo',
  thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCS9nNiMWtxCfogk1FYyRWH9bZXnjqgvYK-K4jBQz7jkCx30aHn5My2DBbxr8U3GFwR7ZnweqHvg7rR5v9IxLeMGG_QBrR6ig6IThEqWT7DzeSvV-1c2T31N8MS0ceg8PGsjAFD25VHtO5NTBi16N493pDSk6ynF8hQ9qaooHhjrM3AynOvBbmwjhXJ1gLJUaUf8GezmcDas4Lu3rtQLzT2Op8k5fJ3bmFvdptyqwhSVmRpsB2LXvZ9D86wU5ssSAupvIfBDhfobUY',
  tip: '做“你好”这个动作时，记得要保持微笑哦！',
  steps: [
    {
      id: 1,
      title: '举起手掌',
      description: '张开你的手掌，举到额头附近，就像敬礼一样。',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQbwAdqFwtM-sOnRWRQPZ4IqDPFq1em0bCRSVdkLfKuBY-SdVyystyvl9adxsKUzbwfrkJXCJoEtXn_DxXeFgnyK7CY4SaikuZ0XFFqjkMYP-iXLZVDJY_w-eZ0Fekjn0GPDKwbpJhwReJpjSnDulXQeACIG7_wMCmKLFGuvdLn6oEkdhBlRcA7LEm4tBfGyxkR295ny-eXsYaDzvc8FjYfyyiiY8I9NRGqlL9kDeSb_dFuvM7YFgUa76uxan5UgTlCzRrwK8KSx0'
    },
    {
      id: 2,
      title: '向前移动',
      description: '手掌稍微向前并在头部前方画一个小弧线。',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU0ZIIUAtcPmeIdpgaaqI8K5Z5TqIm23Ot428zOcJfdvp3iWek3zXHVEJnV5F0_yqeOuF1ebpmAqBmgjXrBRj0wg5GWopkf6F-Ate36u4QHMT8d-jiaOSOaPBM3YtJWj1GAq79GsSJ4iWumFsuOkMk6xqtyjycKPbas51GwjlX64wM6SucwGfcjSIX4USk_wHv5EvMNNYfGKbWRBZGA3KcpJ-T1DefS4g94519woWNdUvrYi8Fa_KdwOltE-iiY3IJD5m7kYAOtJ8'
    }
  ]
};

const Learning: React.FC<LearningProps> = ({ onNavigate, initialTab, onTabChange }) => {
  const [activeTab, setActiveTab] = useState<'core' | 'extended'>(initialTab || 'core');
  const [showMoreRhymes, setShowMoreRhymes] = useState(false);
  const [selectedSafety, setSelectedSafety] = useState<any | null>(null);
  const [learningProgress, setLearningProgress] = useState<number>(0);
  const [completedLessons, setCompletedLessons] = useState<number>(0);
  const [totalLessons, setTotalLessons] = useState<number>(5);
  const [loading, setLoading] = useState(false);

  // 获取学习进度
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const response = await progressApi.getProgress();
        if (response) {
          const completed = response.filter(item => item.completed).length;
          setCompletedLessons(completed);
          setTotalLessons(response.length > 0 ? response.length : 5);
          
          // 计算总体进度
          if (response.length > 0) {
            const totalProgress = response.reduce((sum, item) => sum + item.progress, 0);
            const averageProgress = Math.round(totalProgress / response.length);
            setLearningProgress(averageProgress);
          }
        }
      } catch (error) {
        console.error('获取学习进度失败:', error);
        // 使用默认值
        setCompletedLessons(4);
        setTotalLessons(5);
        setLearningProgress(80);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabToggle = useCallback((tab: 'core' | 'extended') => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  }, [onTabChange]);

  const nurseryRhymes = [
    { title: '律动儿歌', icon: 'child_care', color: 'bg-tertiary/10', iconColor: 'text-tertiary' },
    { title: '趣味故事', icon: 'theater_comedy', color: 'bg-purple-50', iconColor: 'text-purple-500' },
    { title: '动物朋友', icon: 'pets', color: 'bg-pink-50', iconColor: 'text-pink-500' }
  ];

  const safetyItems = [
    { label: '防溺水', desc: '游泳守则', icon: 'pool', color: 'text-blue-500', bg: 'bg-blue-50', longDesc: '小朋友，夏天游泳要去正规场所，一定要有爸爸妈妈陪同哦！' },
    { label: '防拐骗', desc: '保护自己', icon: 'admin_panel_settings', color: 'text-red-500', bg: 'bg-red-50', longDesc: '不吃陌生人的东西，不跟陌生人走。记住家长的电话很重要！' },
    { label: '防火安全', desc: '紧急处理', icon: 'fire_extinguisher', color: 'text-orange-500', bg: 'bg-orange-50', longDesc: '不玩火，遇到火情要捂住口鼻贴近地面逃生，拨打119。' },
    { label: '防诈骗', desc: '识破骗局', icon: 'phonelink_lock', color: 'text-purple-500', bg: 'bg-purple-50', longDesc: '陌生电话不要信，网络中奖是骗局。保护好自己的小秘密！' }
  ];

  return (
    <div className="flex flex-col min-h-screen px-6 pt-12 pb-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full shadow-bouncy flex items-center justify-center transform hover:scale-105 transition-transform cursor-pointer">
            <img alt="User" className="w-10 h-10 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsYvFGGfTEcr8eeBY60uN_pRXnqYm71l-TfdCNrv30DtqmPzjeSaTSOxRXQQYWoui3DOaQsl_XQm0EFVIcqpQhhyKFWiLwPghEm-RyjEDhOl5jORpfjID18Pdq_LxwjFDykGEnnAWnmUWVgsz5XBu-3Kja6v0I_gmnlNk4v2LWhrSTxju19xWByzxz2yxV8xKa_SIC3z9NxJ_wEoPuywTVQ0dXIP01H4E0v87UGxHhdalDVCjzBQIlKp79XhJAbtNPfYCc-KiMsuw"/>
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">我的学习中心</h2>
            <h1 className="text-2xl font-black text-gray-800 leading-none">学习小明星</h1>
          </div>
        </div>
        <button className="w-12 h-12 bg-white rounded-full shadow-bouncy flex items-center justify-center text-secondary">
          <span className="material-icons-round text-3xl">auto_awesome</span>
        </button>
      </header>

      {/* Segmented Control */}
      <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center mb-8">
        <button 
          onClick={() => handleTabToggle('core')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'core' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'}`}
        >
          常规教学
        </button>
        <button 
          onClick={() => handleTabToggle('extended')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'extended' ? 'bg-white text-tertiary shadow-sm' : 'text-gray-500'}`}
        >
          拓展学习
        </button>
      </div>

      {activeTab === 'core' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {/* Progress Section */}
          <div className="bg-primary rounded-3xl p-6 relative overflow-hidden shadow-lg text-white">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-20 rounded-full"></div>
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold opacity-90 tracking-wide">课程进度</h3>
                <p className="text-3xl font-black mt-1">{completedLessons}/{totalLessons} 课时</p>
              </div>
              <div className="w-16 h-16 relative flex items-center justify-center">
                <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                  <circle className="text-white opacity-30" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="12"></circle>
                  <circle 
                    className="text-white" 
                    cx="50" 
                    cy="50" 
                    fill="transparent" 
                    r="40" 
                    stroke="currentColor" 
                    strokeDasharray="251.2" 
                    strokeDashoffset={251.2 - (251.2 * learningProgress / 100)} 
                    strokeLinecap="round" 
                    strokeWidth="12"
                  ></circle>
                </svg>
                <span className="absolute text-sm font-bold">{learningProgress}%</span>
              </div>
            </div>
            <div className="mt-4 bg-white/20 rounded-full h-3 w-full overflow-hidden">
              <div className="bg-white h-full rounded-full" style={{ width: `${learningProgress}%` }}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div 
              onClick={() => onNavigate(Page.LESSON_DETAIL, HELLO_LESSON)}
              className="group relative cursor-pointer transform transition-transform hover:scale-[1.02] active:scale-95"
            >
              <div className="absolute inset-0 bg-primary/20 translate-y-2 rounded-3xl"></div>
              <div className="relative bg-white border-4 border-primary/30 rounded-3xl p-6 h-48 flex items-center justify-between overflow-hidden">
                <div className="z-10 flex flex-col justify-center h-full max-w-[50%]">
                  <div className="bg-primary/10 w-max px-3 py-1 rounded-full mb-2">
                    <span className="text-primary font-bold text-[10px] uppercase tracking-widest">数字逻辑</span>
                  </div>
                  <h3 className="text-3xl font-black text-gray-800 mb-2">数学</h3>
                  <p className="text-sm font-bold text-gray-400 leading-tight">数数、加法和有趣的谜题！</p>
                </div>
                <div className="absolute right-[-10px] bottom-[-10px] w-36 h-36 floating">
                  <img alt="Math" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoFsOIwjBeGT0a6OB_m-nGbtYVlODIl_Tl0Yy4AMYD7ldKdrIupeBSNh8GS9LkiwMFW8TB1aWud2HSAHDGi8V40gpLMilWuvMQ6SDIn72YaveKt0TTM52hX9c5bqFCDSPks-VEUq7C3T3I684XnfrLBBJMpqHem2QWlSLObTng9sLZW37U3J6PRCyuAkgZUxd57EnGdm7gcakzaYN8BFflNlDmjBgBLvvcWMucr0c80E7I9neOjhjVZ5SqA2Ny-fCN3QnGFM6bXXk"/>
                </div>
              </div>
            </div>

            <div className="group relative cursor-pointer transform transition-transform hover:scale-[1.02] active:scale-95">
              <div className="absolute inset-0 bg-tertiary/20 translate-y-2 rounded-3xl"></div>
              <div className="relative bg-white border-4 border-tertiary/30 rounded-3xl p-6 h-48 flex items-center justify-between overflow-hidden">
                <div className="z-10 flex flex-col justify-center h-full max-w-[50%]">
                  <div className="bg-tertiary/10 w-max px-3 py-1 rounded-full mb-2">
                    <span className="text-tertiary font-bold text-[10px] uppercase tracking-widest">阅读故事</span>
                  </div>
                  <h3 className="text-3xl font-black text-gray-800 mb-2">语文</h3>
                  <p className="text-sm font-bold text-gray-400 leading-tight">学习汉字并阅读故事。</p>
                </div>
                <div className="absolute right-[-10px] bottom-[-10px] w-36 h-36 floating" style={{ animationDelay: '1s' }}>
                  <img alt="Reading" className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2N5HECJ7OhHAfEgHVAS032W74j6aXforqfINICjaXvHscgmxHaX1ceGDqdrKXCLyykjfIpPd4tfTHXy3tgu-7QqotFqJoiSABjl9T3ZWloiI3Q6yH-r-Ru7mvFLul_z39q45aTaqEb1O5J9Zjr4L0Hxf7VcSpPL73UbVQtR6kPsSv1gfSSBUEClQ7P0gHGamdjU4S0Nd8fyGDLm94VGqBzAGS0BE9t2LfwbczLJKJZ2D8HM4J-Hkt8g5TMvi4T9poIm-CAp3Dids"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                <span className="material-icons-round text-tertiary">music_note</span>
                趣味儿歌
              </h3>
              <button 
                onClick={() => setShowMoreRhymes(true)}
                className="text-primary text-xs font-bold uppercase tracking-widest"
              >
                更多
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {nurseryRhymes.map((item, i) => (
                <div key={i} className="flex-shrink-0 w-36 bg-white rounded-[2rem] p-4 shadow-soft border border-gray-100 flex flex-col items-center hover:scale-105 active:scale-95 transition-all cursor-pointer">
                  <div className={`w-full h-24 rounded-2xl ${item.color} flex items-center justify-center mb-3`}>
                    <span className={`material-icons-round text-5xl ${item.iconColor}`}>{item.icon}</span>
                  </div>
                  <span className="font-bold text-gray-800 text-sm">{item.title}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-2 mb-4">
              <span className="material-icons-round text-danger">security</span>
              安全知识
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {safetyItems.map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedSafety(item)}
                  className="bg-white p-4 rounded-3xl shadow-soft border border-gray-100 flex flex-col gap-2 relative overflow-hidden group cursor-pointer active:scale-95 transition-all"
                >
                  <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center ${item.color}`}>
                    <span className="material-icons-round text-2xl">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-black text-gray-800 text-sm">{item.label}</h4>
                    <p className="text-[10px] font-bold text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* More Rhymes Modal */}
      {showMoreRhymes && (
        <div 
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-end animate-in fade-in duration-300"
          onClick={() => setShowMoreRhymes(false)}
        >
          <div 
            className="bg-white w-full max-w-md mx-auto rounded-t-[3rem] p-8 animate-in slide-in-from-bottom-full duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
            <h2 className="text-2xl font-black text-gray-800 mb-6 text-center">全部儿歌 🎵</h2>
            <div className="grid grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto hide-scrollbar pb-8">
              {nurseryRhymes.map((item, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-3xl flex flex-col items-center">
                   <div className={`w-16 h-16 rounded-full ${item.color} flex items-center justify-center mb-2`}>
                    <span className={`material-icons-round text-3xl ${item.iconColor}`}>{item.icon}</span>
                  </div>
                  <span className="font-bold text-sm text-gray-700">{item.title}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowMoreRhymes(false)}
              className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-transform mt-4"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* Safety Detail Modal */}
      {selectedSafety && (
        <div 
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300"
          onClick={() => setSelectedSafety(null)}
        >
          <div 
            className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center transform animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`w-20 h-20 ${selectedSafety.bg} rounded-3xl flex items-center justify-center mx-auto mb-6 ${selectedSafety.color}`}>
              <span className="material-icons-round text-5xl">{selectedSafety.icon}</span>
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-4">{selectedSafety.label}</h2>
            <p className="text-gray-500 font-bold leading-relaxed mb-8">
              {selectedSafety.longDesc}
            </p>
            <button 
              onClick={() => setSelectedSafety(null)}
              className="w-full bg-danger text-white font-black py-4 rounded-2xl shadow-lg shadow-danger/20 active:scale-95 transition-transform"
            >
              我知道了！
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Learning);
