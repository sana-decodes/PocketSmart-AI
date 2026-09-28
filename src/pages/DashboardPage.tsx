import React, { useEffect, useState } from 'react';
import { Home, PartyPopper, Gem, History, ArrowRight, Clock, Sparkles, ChevronRight, Eye } from 'lucide-react';
import { User, HistoryItem } from '../types';
import { getRecommendationHistory } from '../api';

interface DashboardPageProps {
  currentUser: User | null;
  onNavigate: (page: string) => void;
  onViewDetail: (item: HistoryItem) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentUser,
  onNavigate,
  onViewDetail,
}) => {
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    async function loadHistory() {
      setIsLoadingHistory(true);
      try {
        const items = await getRecommendationHistory();
        setRecentHistory(items.slice(0, 3));
      } catch (err) {
        console.error('Failed to load history on dashboard:', err);
      } finally {
        setIsLoadingHistory(false);
      }
    }
    loadHistory();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-10 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48 text-amber-400" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-400/30">
            <span>Personal Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Welcome, <span className="text-amber-400">{currentUser?.username || 'sai'}</span>!
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Ready to plan your next budget? Select a category below to get started with intelligent AI recommendations and smart Indian e-commerce links.
          </p>
        </div>
      </div>

      {/* 3 Smart Planner Cards */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Our Smart Budget Planners
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            Choose a domain to plan
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Home Planner Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all group">
            <div className="p-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Home Interior Planner
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Smart budget allocation for furniture, ceiling fans, ambient lighting, and dining setups across IKEA, Amazon India, and Flipkart.
              </p>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => onNavigate('home-planner')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Party Planner Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all group">
            <div className="p-6">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <PartyPopper className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Party Budget Planner
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculate per-guest catering, venue selection, and decoration packages with links to Swiggy, Zomato, BookMyShow, and OYO.
              </p>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => onNavigate('party-planner')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-orange-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Jewelry Planner Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all group">
            <div className="p-6">
              <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Gem className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Jewelry Budget Planner
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multimodal outfit image upload for color harmony, occasion matching, and jewelry options from Tanishq, CaratLane, and BlueStone.
              </p>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => onNavigate('jewelry-planner')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-pink-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Centered History CTA Button */}
      <div className="flex justify-center mb-12">
        <button
          onClick={() => onNavigate('history')}
          className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <History className="w-4 h-4" />
          <span>View All Recommendation History</span>
        </button>
      </div>

      {/* Recent Activity Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoadingHistory ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading recent activity...</div>
        ) : recentHistory.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No recommendation history found. Launch a planner above to get started!
          </div>
        ) : (
          <div className="space-y-4">
            {recentHistory.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition-all gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      item.type === 'home'
                        ? 'bg-emerald-100 text-emerald-700'
                        : item.type === 'party'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-pink-100 text-pink-700'
                    }`}
                  >
                    {item.type === 'home' && <Home className="w-4 h-4" />}
                    {item.type === 'party' && <PartyPopper className="w-4 h-4" />}
                    {item.type === 'jewelry' && <Gem className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 capitalize">
                        {item.type} Planner Query
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                      {item.input}
                    </div>
                    <div className="text-xs font-semibold text-emerald-700 mt-1">
                      {item.summary}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onViewDetail(item)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 self-start sm:self-center shrink-0"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>View Details</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
