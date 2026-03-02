import { Page } from '../types';

interface TabBarProps {
  activeTab: Page;
  onTabChange: (page: Page) => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: Page.HOME, label: '首页', icon: 'home' },
    { id: Page.LEARNING, label: '学习', icon: 'school' },
    { id: Page.CHALLENGE, label: '闯关', icon: 'videogame_asset' },
    { id: Page.STORE, label: '商店', icon: 'storefront' },
    { id: Page.PROFILE, label: '我的', icon: 'face' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-md mx-auto px-4 pb-4 pt-2">
        <div className="bg-white rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-gray-100 p-2 flex justify-around items-center h-[4.5rem]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-all active:scale-90 touch-manipulation ${
                activeTab === tab.id ? 'text-orange-500' : 'text-gray-400'
              }`}
            >
              <span className="material-icons-round text-[26px]">
                {tab.icon}
              </span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabBar;
