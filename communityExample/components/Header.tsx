
import React from 'react';
import { Search, Menu, Bell, Moon, Languages, ChevronDown } from 'lucide-react';
import { CURRENT_USER } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="flex items-center gap-6 flex-1 max-w-2xl">
        <button className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-all border border-gray-100">
          <Menu size={20} />
        </button>
        
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-[#f8fafc] border border-gray-100 rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#00ADEF]/10 focus:border-[#00ADEF] outline-none transition-all placeholder-gray-400"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white border border-gray-100 rounded-lg px-1.5 py-0.5 shadow-sm">
             <span className="text-[10px] text-gray-400 font-mono">⌘</span>
             <span className="text-[10px] text-gray-400 font-mono uppercase">K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100">
            <div className="flex items-center gap-1.5 px-1">
              <span className="text-xs font-bold text-gray-600">EN</span>
            </div>
          </button>
          <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-full border border-gray-100 transition-all">
            <Moon size={18} />
          </button>
          <div className="relative">
            <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-full border border-gray-100 transition-all">
              <Bell size={18} />
            </button>
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#FFB800] border-2 border-white rounded-full"></span>
          </div>
        </div>

        <div className="flex items-center gap-3 pl-5 border-l border-gray-100 cursor-pointer group">
          <img
            src={CURRENT_USER.avatar}
            alt="Profile"
            className="w-10 h-10 rounded-xl border-2 border-white shadow-sm ring-1 ring-gray-100 group-hover:ring-[#00ADEF] transition-all"
          />
          <div className="hidden sm:block">
            <div className="flex items-center gap-1">
              <p className="text-[13px] font-bold text-gray-800 tracking-tight">{CURRENT_USER.name}</p>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
            <p className="text-[10px] text-[#00ADEF] font-bold uppercase tracking-wider">Lvl 12 Student</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
