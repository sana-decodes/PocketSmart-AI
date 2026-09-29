import React from 'react';
import { LogOut, LogIn, ShoppingBag, Sun, Moon } from 'lucide-react';
import { User, CurrencyCode } from '../types';
import { usePocket } from '../context/PocketContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  onLogout,
}) => {
  const { currency, setCurrency, theme, toggleTheme, savedItems, setIsBasketOpen } = usePocket();

  return (
    <header className="bg-[#0F172A] text-[#F8FAFC] sticky top-0 z-40 shadow-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onNavigate('landing')}
          >
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-blue-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
              PocketSmart AI
            </span>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentPage === 'landing'
                  ? 'bg-[#1E293B] text-[#A78BFA] border border-purple-500/20 shadow-xs'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]/60'
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentPage === 'dashboard'
                  ? 'bg-[#1E293B] text-[#A78BFA] border border-purple-500/20 shadow-xs'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]/60'
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => onNavigate('home-planner')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentPage === 'home-planner'
                  ? 'bg-[#1E293B] text-blue-400 border border-blue-500/40 shadow-xs font-bold'
                  : 'text-[#94A3B8] hover:text-blue-300 hover:bg-[#1E293B]/60'
              }`}
            >
              Home Decor
            </button>

            <button
              onClick={() => onNavigate('party-planner')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentPage === 'party-planner'
                  ? 'bg-[#1E293B] text-pink-400 border border-pink-500/40 shadow-xs font-bold'
                  : 'text-[#94A3B8] hover:text-pink-300 hover:bg-[#1E293B]/60'
              }`}
            >
              Party & Events
            </button>

            <button
              onClick={() => onNavigate('jewelry-planner')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentPage === 'jewelry-planner'
                  ? 'bg-[#1E293B] text-cyan-400 border border-cyan-500/40 shadow-xs font-bold'
                  : 'text-[#94A3B8] hover:text-cyan-300 hover:bg-[#1E293B]/60'
              }`}
            >
              Jewelry
            </button>

            <button
              onClick={() => onNavigate('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentPage === 'history'
                  ? 'bg-[#1E293B] text-[#A78BFA] border border-purple-500/20 shadow-xs'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]/60'
              }`}
            >
              History
            </button>
          </nav>

          {/* Zone 3: Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Selector */}
            <div className="flex items-center bg-[#1E293B] rounded-lg p-0.5 border border-slate-700/80">
              {(['INR', 'USD', 'EUR'] as CurrencyCode[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all ${
                    currency === c
                      ? 'bg-[#7C3AED] text-[#F8FAFC] shadow-xs'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                  title={`Switch to ${c}`}
                >
                  {c === 'INR' ? '₹' : c === 'USD' ? '$' : '€'}
                </button>
              ))}
            </div>

            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-[#1E293B] hover:bg-slate-700/60 text-[#94A3B8] hover:text-[#F8FAFC] border border-slate-700/80 transition-all flex items-center justify-center cursor-pointer group"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-purple-500 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Pocket Basket Toggle */}
            <button
              onClick={() => setIsBasketOpen(true)}
              className="relative p-2 rounded-lg bg-[#1E293B] hover:bg-slate-700/60 text-[#94A3B8] hover:text-[#F8FAFC] border border-slate-700/80 transition-colors flex items-center gap-1.5"
              title="Open Pocket Basket"
            >
              <ShoppingBag className="w-4 h-4 text-[#A78BFA]" />
              {savedItems.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#7C3AED] text-[#F8FAFC] text-[10px] font-black flex items-center justify-center shadow-xs">
                  {savedItems.length}
                </span>
              )}
            </button>

            {/* User Auth Controls */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs font-semibold text-[#94A3B8]">
                  {currentUser.username}
                </span>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#94A3B8] hover:text-[#EF4444] bg-[#1E293B] hover:bg-slate-800 rounded-lg border border-slate-700/80 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#F8FAFC] bg-[#7C3AED] hover:bg-[#8B5CF6] rounded-lg shadow-md shadow-purple-600/20 transition-all active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => onNavigate('landing')}
            className={`py-1 px-2 font-medium ${currentPage === 'landing' ? 'text-[#A78BFA]' : 'text-[#94A3B8]'}`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`py-1 px-2 font-medium ${currentPage === 'dashboard' ? 'text-[#A78BFA]' : 'text-[#94A3B8]'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('home-planner')}
            className={`py-1 px-2 font-medium ${currentPage === 'home-planner' ? 'text-blue-400 font-bold' : 'text-[#94A3B8]'}`}
          >
            Decor
          </button>
          <button
            onClick={() => onNavigate('party-planner')}
            className={`py-1 px-2 font-medium ${currentPage === 'party-planner' ? 'text-pink-400 font-bold' : 'text-[#94A3B8]'}`}
          >
            Party
          </button>
          <button
            onClick={() => onNavigate('jewelry-planner')}
            className={`py-1 px-2 font-medium ${currentPage === 'jewelry-planner' ? 'text-cyan-400 font-bold' : 'text-[#94A3B8]'}`}
          >
            Jewelry
          </button>
          <button
            onClick={() => onNavigate('history')}
            className={`py-1 px-2 font-medium ${currentPage === 'history' ? 'text-[#A78BFA]' : 'text-[#94A3B8]'}`}
          >
            History
          </button>
        </div>
      </div>
    </header>
  );
};
