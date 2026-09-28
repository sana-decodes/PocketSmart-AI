import React from 'react';
import { Home, Sparkles, PartyPopper, Gem, History, LogOut, User as UserIcon, LogIn, LayoutDashboard } from 'lucide-react';
import { User } from '../types';

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
  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate(currentUser ? 'dashboard' : 'landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-400 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Pocket<span className="text-amber-400">Smart</span>
                </span>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-400/30 uppercase tracking-wider">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
                AI Budget Planning & Smart Recommendations
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {currentUser && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-blue-400" />
                <span>Dashboard</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('home-planner')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'home-planner'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Home className="w-4 h-4 text-emerald-400" />
              <span>Home Planner</span>
            </button>

            <button
              onClick={() => onNavigate('party-planner')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'party-planner'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <PartyPopper className="w-4 h-4 text-orange-400" />
              <span>Party Planner</span>
            </button>

            <button
              onClick={() => onNavigate('jewelry-planner')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'jewelry-planner'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Gem className="w-4 h-4 text-pink-400" />
              <span>Jewelry Planner</span>
            </button>

            {currentUser && (
              <button
                onClick={() => onNavigate('history')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === 'history'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <History className="w-4 h-4 text-indigo-400" />
                <span>History</span>
              </button>
            )}
          </nav>

          {/* User Auth Controls */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                    {currentUser.username[0]}
                  </div>
                  <span className="text-xs font-semibold text-slate-200">
                    {currentUser.username}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-red-400 bg-slate-800 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors"
                >
                  <span>Get Started</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => onNavigate(currentUser ? 'dashboard' : 'landing')}
            className={`flex flex-col items-center py-1 px-2 rounded ${
              currentPage === 'dashboard' || currentPage === 'landing' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mb-0.5" />
            <span>Home</span>
          </button>
          <button
            onClick={() => onNavigate('home-planner')}
            className={`flex flex-col items-center py-1 px-2 rounded ${
              currentPage === 'home-planner' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span>Decor</span>
          </button>
          <button
            onClick={() => onNavigate('party-planner')}
            className={`flex flex-col items-center py-1 px-2 rounded ${
              currentPage === 'party-planner' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <PartyPopper className="w-4 h-4 mb-0.5" />
            <span>Party</span>
          </button>
          <button
            onClick={() => onNavigate('jewelry-planner')}
            className={`flex flex-col items-center py-1 px-2 rounded ${
              currentPage === 'jewelry-planner' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Gem className="w-4 h-4 mb-0.5" />
            <span>Jewelry</span>
          </button>
          {currentUser && (
            <button
              onClick={() => onNavigate('history')}
              className={`flex flex-col items-center py-1 px-2 rounded ${
                currentPage === 'history' ? 'text-amber-400 font-bold' : 'text-slate-400'
              }`}
            >
              <History className="w-4 h-4 mb-0.5" />
              <span>History</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
