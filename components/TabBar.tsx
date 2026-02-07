
import React from 'react';
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
    <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none">
      <div className="max-w-md mx-auto relative px-6 pb-6 pointer-events-auto">
        <div className="bg-white rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-gray-100 p-2 flex justify-between items-center h-[5.5rem] px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-16 h-full space-y-1 transition-all active:scale-90 ${
                activeTab === tab.id ? 'text-primary' : 'text-gray-400'
              }`}
            >
              <span className="material-icons-round text-[28px]">
                {tab.icon}
              </span>
              <span className="text-[11px] font-bold">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabBar;
