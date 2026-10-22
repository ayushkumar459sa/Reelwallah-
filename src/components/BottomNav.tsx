import React from 'react';
import { Home, Headphones, HelpCircle, FileCheck, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#101426]/95 backdrop-blur-xl border-t border-[#252D54] px-2 py-1.5 safe-area-bottom">
      <div className="flex items-center justify-around">
        {/* 1. Wall & Chat */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
            currentView === 'home' ? 'text-[#37D9F5]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${currentView === 'home' ? 'bg-[#7857FF]/25 scale-110 shadow-sm shadow-[#37D9F5]/30' : ''}`}>
            <Home className={`w-5 h-5 ${currentView === 'home' ? 'text-[#37D9F5]' : 'text-slate-400'}`} />
          </div>
          <span className={`text-[10px] font-medium tracking-tight mt-0.5 ${currentView === 'home' ? 'font-bold text-white' : ''}`}>
            Wall
          </span>
          {currentView === 'home' && <span className="w-1 h-1 rounded-full bg-[#37D9F5] absolute -bottom-0.5" />}
        </button>

        {/* 2. Tests */}
        <button
          onClick={() => onNavigate('tests')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
            currentView === 'tests' ? 'text-[#37D9F5]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${currentView === 'tests' ? 'bg-[#7857FF]/25 scale-110 shadow-sm shadow-[#37D9F5]/30' : ''}`}>
            <FileCheck className={`w-5 h-5 ${currentView === 'tests' ? 'text-[#37D9F5]' : 'text-slate-400'}`} />
          </div>
          <span className={`text-[10px] font-medium tracking-tight mt-0.5 ${currentView === 'tests' ? 'font-bold text-white' : ''}`}>
            JEE Quiz
          </span>
          {currentView === 'tests' && <span className="w-1 h-1 rounded-full bg-[#37D9F5] absolute -bottom-0.5" />}
        </button>

        {/* 3. CENTER PROMINENT POST BUTTON */}
        <button
          onClick={() => onNavigate('home-post')}
          className="flex flex-col items-center justify-center -mt-4 group active:scale-90 transition-transform"
          title="Create New Post"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#7857FF] to-[#37D9F5] p-0.5 shadow-lg shadow-[#7857FF]/50 flex items-center justify-center">
            <div className="w-full h-full bg-[#101426] group-hover:bg-transparent rounded-[14px] flex items-center justify-center transition-colors">
              <span className="text-xl font-black text-white leading-none">+</span>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-[#37D9F5] tracking-tight mt-0.5">
            Post
          </span>
        </button>

        {/* 4. Study Rooms */}
        <button
          onClick={() => onNavigate('rooms')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
            currentView === 'rooms' ? 'text-[#37D9F5]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${currentView === 'rooms' ? 'bg-[#7857FF]/25 scale-110 shadow-sm shadow-[#37D9F5]/30' : ''}`}>
            <Headphones className={`w-5 h-5 ${currentView === 'rooms' ? 'text-[#37D9F5]' : 'text-slate-400'}`} />
          </div>
          <span className={`text-[10px] font-medium tracking-tight mt-0.5 ${currentView === 'rooms' ? 'font-bold text-white' : ''}`}>
            Rooms
          </span>
          {currentView === 'rooms' && <span className="w-1 h-1 rounded-full bg-[#37D9F5] absolute -bottom-0.5" />}
        </button>

        {/* 5. Doubts */}
        <button
          onClick={() => onNavigate('doubts')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
            currentView === 'doubts' ? 'text-[#37D9F5]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${currentView === 'doubts' ? 'bg-[#7857FF]/25 scale-110 shadow-sm shadow-[#37D9F5]/30' : ''}`}>
            <HelpCircle className={`w-5 h-5 ${currentView === 'doubts' ? 'text-[#37D9F5]' : 'text-slate-400'}`} />
          </div>
          <span className={`text-[10px] font-medium tracking-tight mt-0.5 ${currentView === 'doubts' ? 'font-bold text-white' : ''}`}>
            Doubts
          </span>
          {currentView === 'doubts' && <span className="w-1 h-1 rounded-full bg-[#37D9F5] absolute -bottom-0.5" />}
        </button>
      </div>
    </nav>
  );
};
