
import React from 'react';
import { Page } from '../types';

interface StoreProps {
  onNavigate: (page: Page) => void;
}

const Store: React.FC<StoreProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <span className="material-icons-round text-6xl text-gray-300">storefront</span>
      </div>
      <h1 className="text-2xl font-black text-gray-800 mb-2">星星商店</h1>
      <p className="text-gray-500 font-bold mb-8">正在装修中，敬请期待！</p>
      <button 
        onClick={() => onNavigate(Page.HOME)}
        className="bg-primary text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-primary/30 active:scale-95 transition-transform"
      >
        返回首页
      </button>
    </div>
  );
};

export default Store;
