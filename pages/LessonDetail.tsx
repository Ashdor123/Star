
import { useState, useEffect } from 'react';
import { Lesson } from '../types';
import { progressApi } from '../src/services/api';

interface LessonDetailProps {
  lesson: Lesson;
  onBack: () => void;
}

const LessonDetail: React.FC<LessonDetailProps> = ({ lesson, onBack }) => {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  // 获取课程进度
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const response = await progressApi.getLessonProgress(lesson.id);
        if (response.progress) {
          setProgress(response.progress);
          setCompleted(response.completed);
        }
      } catch (error) {
        console.error('获取学习进度失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [lesson.id]);

  // 更新学习进度
  const updateProgress = async (newProgress: number, newCompleted: boolean = false) => {
    try {
      setLoading(true);
      await progressApi.updateProgress(lesson.id, {
        progress: newProgress,
        completed: newCompleted
      });
      setProgress(newProgress);
      setCompleted(newCompleted);
    } catch (error) {
      console.error('更新学习进度失败:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col h-full bg-background-light">
      <header className="flex justify-between items-center px-6 pt-12 pb-4 z-10">
        <button onClick={onBack} className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors">
          <span className="material-icons-round text-gray-600">arrow_back_ios_new</span>
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold text-gray-800 tracking-wide">每日词汇</h1>
          <span className="text-xs text-primary font-medium tracking-wide">第1级</span>
        </div>
        <button className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors">
          <span className="material-icons-round text-gray-600">settings</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col relative pb-20">
        <div className="px-4 mb-4">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-md border-2 border-white bg-black group">
            <img 
              alt="Video thumbnail" 
              className="w-full h-full object-cover opacity-80" 
              src={lesson.thumbnail}
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-12 h-12 bg-primary/90 text-white rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform backdrop-blur-sm">
                <span className="material-icons-round text-3xl ml-1">play_arrow</span>
              </button>
            </div>
            <div className="absolute bottom-2 left-2 right-2 h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-primary rounded-full"></div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-1 tracking-wide">{lesson.title}</h2>
            <p className="text-gray-500 text-base font-medium">"{lesson.pinyin}"</p>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-t-[2rem] shadow-inner px-4 pt-6 pb-3 mx-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-700 flex items-center gap-1.5">
              <span className="material-icons-round text-tertiary text-sm">lightbulb</span>
              动作分解
            </h3>
            <span className="px-2 py-0.5 bg-tertiary/10 text-tertiary text-xs font-bold rounded-full">分步教学</span>
          </div>

          {lesson.steps.map((step) => (
            <div key={step.id} className="flex gap-3 mb-4 items-start">
              <div className="flex-shrink-0 w-16 h-16 bg-background-light rounded-xl overflow-hidden border border-gray-100 p-1.5">
                <img alt={step.title} className="w-full h-full object-contain mix-blend-multiply" src={step.image} loading="lazy"/>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`w-5 h-5 ${step.id === 1 ? 'bg-primary' : 'bg-tertiary'} text-white rounded-full flex items-center justify-center text-xs font-bold`}>
                    {step.id}
                  </span>
                  <h4 className="font-bold text-gray-800 text-base">{step.title}</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </div>
          ))}

          <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100 flex gap-2 mb-3">
            <span className="text-xl">🌟</span>
            <div>
              <p className="text-xs font-bold text-yellow-800 mb-0.5">小贴士！</p>
              <p className="text-xs text-yellow-700 font-medium">{lesson.tip}</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-light via-background-light to-transparent pt-8 max-w-md mx-auto z-50">
        <div className="flex gap-3 items-center justify-center">
          <button 
            onClick={() => updateProgress(progress > 0 ? progress - 25 : 0)}
            className="flex-1 h-12 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
          >
            <span className="material-icons-round text-primary text-2xl">replay</span>
            <span className="text-base font-bold text-gray-700 tracking-wide">重复</span>
          </button>
          <button 
            onClick={async () => {
              await updateProgress(100, true);
              onBack();
            }}
            className="flex-[2] h-12 bg-primary rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-primary/30 active:scale-95 transition-transform"
          >
            <span className="text-base font-bold text-white tracking-wide">下一步</span>
            <span className="material-icons-round text-white text-2xl">arrow_forward</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LessonDetail;
