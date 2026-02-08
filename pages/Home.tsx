
import React, { useState, useEffect, useCallback, memo } from 'react';
import { Page, Lesson } from '../types';
import { lessonApi } from '../src/services/api';

interface HomeProps {
  onNavigate: (page: Page, lesson?: Lesson, subTab?: 'core' | 'extended') => void;
  userAvatar: string;
  userName: string;
}

const Home: React.FC<HomeProps> = ({ onNavigate, userAvatar, userName }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMissingModal, setShowMissingModal] = useState(false);
  const [featuredLessons, setFeaturedLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 默认课程数据，当API获取失败时使用
  const DEFAULT_FRIEND_LESSON: Lesson = {
    id: 'friend',
    title: '朋友',
    pinyin: 'Péng Yǒu',
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF4nCOhtIRD-9wLm0eZcacYy1GeNboSLCJZ8qJNs_edxyoM5CV_1Te3bIvjggDaCC5Qeu7hljg95OHU_BE6En6VeJUkycJR8wB4nuTtlBV3q1bK-0bvS-QbDtafwu64Vqcu308iBAeZaueEctBxKJ_SHJ4BG6Hsn5-cvNNtrnKE0BLG3ukmLSLBQI_3qRLHCtcPwFRE9n79SCIuYd53zApSaJr5asG8ip2XS4wkaQcPag1tQU5Hec5OOPuf__nWX0W8yVVjj3ueDQ',
    tip: '表达“朋友”时，双手食指钩在一起，象征着紧密的联结。',
    steps: [
      {
        id: 1,
        title: '食指相对',
        description: '双手食指伸出，指尖相对。',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQbwAdqFwtM-sOnRWRQPZ4IqDPFq1em0bCRSVdkLfKuBY-SdVyystyvl9adxsKUzbwfrkJXCJoEtXn_DxXeFgnyK7CY4SaikuZ0XFFqjkMYP-iXLZVDJY_w-eZ0Fekjn0GPDKwbpJhwReJpjSnDulXQeACIG7_wMCmKLFGuvdLn6oEkdhBlRcA7LEm4tBfGyxkR295ny-eXsYaDzvc8FjYfyyiiY8I9NRGqlL9kDeSb_dFuvM7YFgUa76uxan5UgTlCzRrwK8KSx0'
      },
      {
        id: 2,
        title: '相钩结合',
        description: '左右食指互相钩在一起，轻轻拉动。',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU0ZIIUAtcPmeIdpgaaqI8K5Z5TqIm23Ot428zOcJfdvp3iWek3zXHVEJnV5F0_yqeOuF1ebpmAqBmgjXrBRj0wg5GWopkf6F-Ate36u4QHMT8d-jiaOSOaPBM3YtJWj1GAq79GsSJ4iWumFsuOkMk6xqtyjycKPbas51GwjlX64wM6SucwGfcjSIX4USk_wHv5EvMNNYfGKbWRBZGA3KcpJ-T1DefS4g94519woWNdUvrYi8Fa_KdwOltE-iiY3IJD5m7kYAOtJ8'
      }
    ]
  };

  const DEFAULT_HELLO_LESSON: Lesson = {
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

  // 从API获取推荐课程
  useEffect(() => {
    const fetchFeaturedLessons = async () => {
      try {
        setIsLoading(true);
        const response = await lessonApi.getFeaturedLessons();
        if (response.success && response.lessons) {
          setFeaturedLessons(response.lessons);
        }
      } catch (error) {
        console.error('获取推荐课程失败:', error);
        // 使用默认课程
        setFeaturedLessons([DEFAULT_FRIEND_LESSON, DEFAULT_HELLO_LESSON]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedLessons();
  }, []);

  // 获取每日一词（使用第一个推荐课程）
  const dailyLesson = featuredLessons.length > 0 ? featuredLessons[0] : DEFAULT_FRIEND_LESSON;

  const handleSearch = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    // 从推荐课程中查找匹配的课程
    const matchedLesson = featuredLessons.find(lesson => 
      lesson.title.includes(query) || 
      lesson.pinyin.toLowerCase().includes(query.toLowerCase())
    );

    if (matchedLesson) {
      onNavigate(Page.LESSON_DETAIL, matchedLesson);
    } else if (query.includes('你好')) {
      onNavigate(Page.LESSON_DETAIL, DEFAULT_HELLO_LESSON);
    } else if (query.includes('朋友')) {
      onNavigate(Page.LESSON_DETAIL, DEFAULT_FRIEND_LESSON);
    } else {
      setShowMissingModal(true);
    }
  }, [searchQuery, featuredLessons, onNavigate]);

  return (
    <div className="flex flex-col min-h-screen relative">
      <header className="flex justify-between items-center px-6 pt-8 pb-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
            嗨，<span className="text-primary">{userName}!</span> 👋
          </h1>
          <p className="text-gray-500 font-bold text-sm">让我们一起学手语吧！</p>
        </div>
        <div className="relative cursor-pointer" onClick={() => onNavigate(Page.PROFILE)}>
          <div className="w-12 h-12 bg-accent rounded-full border-4 border-white shadow-md overflow-hidden">
            <img alt="Avatar" className="w-full h-full object-cover" src={userAvatar} loading="lazy"/>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-secondary text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white text-yellow-900 shadow-sm">
            LV.3
          </div>
        </div>
      </header>

      <div className="px-6 mb-6">
        <form onSubmit={handleSearch} className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-3 border border-gray-100">
          <span className="material-icons-round text-gray-400 text-2xl ml-1">search</span>
          <input 
            className="bg-transparent border-none focus:ring-0 text-gray-800 w-full placeholder-gray-400 font-medium" 
            placeholder="搜索词语 (如: 你好, 朋友)..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="bg-primary text-white p-2 rounded-xl active:scale-90 transition-transform">
            <span className="material-icons-round">arrow_forward</span>
          </button>
        </form>
      </div>

      <div className="px-6 mb-8 flex items-center justify-between">
        <div className="flex-1 pr-4">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
            <h3 className="font-bold text-xl mb-1">每日一词</h3>
            <p className="text-indigo-100 text-sm mb-3">今天学习 "{dailyLesson.title}"！</p>
            <button 
              onClick={() => onNavigate(Page.LESSON_DETAIL, dailyLesson)}
              className="bg-white text-indigo-600 px-4 py-2 rounded-xl font-bold text-xs shadow-sm active:scale-95 transition-transform"
            >
              立即开始
            </button>
          </div>
        </div>
        <div className="w-28 flex justify-center">
          <div className="animate-bounce-slow relative">
            <img alt="Mascot" className="w-24 h-24 drop-shadow-xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7e5R8u2xiDc6tD6-xtIp7Zx3-ccq4qflGPMavW5bkzSf4mlt0jd4tI_OcGdIqp_uS1KwQrwm4HqfJvD5tV1N91bpeZ54HQmHKXA8sjijCUjUtZr_y9Ai4WOQa5249ULNLT6QLnasyxxJr39rSJ5gMmRMKUChD0xdj2g86gqQmp7Sbj9FReloHvPS-eLN2AyAOHr17cikoXpZ1cmHES8mVLHrLsGXIJ2n95CquLq_Am-RnNq4P8DWcIkmadgLiF3itBSN2diPaPKo" loading="lazy"/>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 space-y-6 overflow-y-auto pb-8 hide-scrollbar">
        <h2 className="text-xl font-bold text-gray-800 mb-2">四星手语</h2>
        <div className="grid grid-cols-2 gap-4">
          <div 
            onClick={() => onNavigate(Page.LEARNING, undefined, 'core')}
            className="col-span-2 bg-red-100 rounded-3xl p-1 relative overflow-hidden group hover:scale-[1.01] transition-transform cursor-pointer"
          >
            <div className="bg-white rounded-[1.3rem] p-5 h-full border-2 border-red-200">
              <div className="flex justify-between items-start mb-2">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                  <span className="material-icons-round text-3xl">school</span>
                </div>
                <span className="bg-red-50 text-red-500 text-xs font-bold px-2 py-1 rounded-lg">核心</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">常规教学</h3>
              <p className="text-xs text-gray-500 mb-3">数学，语文，英语</p>
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded-lg bg-gray-100 text-[10px] font-bold text-gray-600">🔢 123</span>
                <span className="px-2 py-1 rounded-lg bg-gray-100 text-[10px] font-bold text-gray-600">📝 ABC</span>
              </div>
            </div>
          </div>

          <div 
             onClick={() => onNavigate(Page.LEARNING, undefined, 'extended')}
            className="bg-orange-100 rounded-3xl p-1 relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <div className="bg-white rounded-[1.3rem] p-4 h-full border-2 border-orange-200 flex flex-col justify-between">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 mb-3">
                <span className="material-icons-round text-2xl">rocket_launch</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 leading-tight mb-1">拓展学习</h3>
                <p className="text-[10px] text-gray-500">故事，安全与文化</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => onNavigate(Page.CHALLENGE)}
            className="bg-yellow-100 rounded-3xl p-1 relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <div className="bg-white rounded-[1.3rem] p-4 h-full border-2 border-yellow-200 flex flex-col justify-between">
              <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600 mb-3">
                <span className="material-icons-round text-2xl">emoji_events</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800 leading-tight mb-1">关卡挑战</h3>
                <p className="text-[10px] text-gray-500">连线 & 填空游戏</p>
              </div>
            </div>
          </div>

          <div 
            onClick={() => onNavigate(Page.PROFILE)}
            className="col-span-2 bg-green-100 rounded-3xl p-1 relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <div className="bg-white rounded-[1.3rem] p-5 h-full border-2 border-green-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                    <span className="material-icons-round text-lg">public</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">我的世界</h3>
                </div>
                <p className="text-xs text-gray-500 ml-1">贴纸，笔记 & 漂流瓶</p>
              </div>
              <div className="bg-green-500 text-white rounded-full p-2 shadow-md">
                <span className="material-icons-round text-xl">arrow_forward</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showMissingModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setShowMissingModal(false)}
        >
          <div 
            className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center transform animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 relative">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                <span className="material-icons-round text-6xl text-primary/40">sentiment_dissatisfied</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-secondary rounded-full p-2 border-4 border-white shadow-sm">
                <span className="material-icons-round text-white">search_off</span>
              </div>
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-4">找不到哦！</h2>
            <p className="text-gray-500 font-bold leading-relaxed mb-8">
              小朋友，当前还未加入这个词哦
            </p>
            <button 
              onClick={() => setShowMissingModal(false)}
              className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-transform"
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Home);
