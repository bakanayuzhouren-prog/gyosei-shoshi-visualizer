import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg leading-none">行政書士 図解マスター</h1>
            <p className="text-xs text-slate-500 font-medium">Gyosei Shoshi Visualizer</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-sm text-slate-500">
          <a href="#" className="hover:text-indigo-600 transition-colors">使い方</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">履歴</a>
        </div>
      </div>
    </header>
  );
};

export default Header;