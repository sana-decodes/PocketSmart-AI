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
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#7C3AED]/25 rounded-3xl p-8 sm:p-10 text-[#F8FAFC] shadow-xl mb-10 border border-purple-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48 text-[#A78BFA]" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-[#A78BFA] text-xs font-semibold mb-4 border border-purple-400/30">
            <span>Personal Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-[#F8FAFC]">
            Welcome{currentUser ? `, ${currentUser.username}` : ''}!
          </h1>
          <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed">
            Ready to plan your next budget? Select a category below to get started with intelligent AI recommendations and smart Indian e-commerce links.
          </p>
        </div>
      </div>

      {/* 3 Smart Planner Cards */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-[#F8FAFC] tracking-tight">
            Our Smart Budget Planners
          </h2>
          <span className="text-xs font-semibold text-[#94A3B8]">
            Choose a domain to plan
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Home Planner Card (Purple accent #8B5CF6) */}
          <div className="bg-[#1E293B] rounded-2xl border border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between hover:border-purple-500/40 transition-all group">
            <div className="p-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-[#A78BFA] border border-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">
                Home Interior Planner
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Smart budget allocation for furniture, ceiling fans, ambient lighting, and dining setups across IKEA, Amazon India, and Flipkart.
              </p>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => onNavigate('home-planner')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#7C3AED] hover:bg-[#8B5CF6] text-[#F8FAFC] font-semibold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Party Planner Card (Pink accent #EC4899) */}
          <div className="bg-[#1E293B] rounded-2xl border border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between hover:border-pink-500/40 transition-all group">
            <div className="p-6">
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <PartyPopper className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">
                Party Budget Planner
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Calculate per-guest catering, venue selection, and decoration packages with links to Swiggy, Zomato, BookMyShow, and OYO.
              </p>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => onNavigate('party-planner')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#7C3AED] hover:bg-[#8B5CF6] text-[#F8FAFC] font-semibold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Jewelry Planner Card (Cyan accent #22D3EE / #38BDF8) */}
          <div className="bg-[#1E293B] rounded-2xl border border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 transition-all group">
            <div className="p-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-[#38BDF8] border border-cyan-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Gem className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">
                Jewelry Budget Planner
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Multimodal outfit image upload for color harmony, occasion matching, and jewelry options from Tanishq, CaratLane, and BlueStone.
              </p>
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => onNavigate('jewelry-planner')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#7C3AED] hover:bg-[#8B5CF6] text-[#F8FAFC] font-semibold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
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
          className="px-6 py-3 rounded-full bg-[#7C3AED] hover:bg-[#8B5CF6] text-[#F8FAFC] font-bold text-xs sm:text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <History className="w-4 h-4" />
          <span>View All Recommendation History</span>
        </button>
      </div>

      {/* Recent Activity Card */}
      <div className="bg-[#1E293B] rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-[#A78BFA]" />
            <h3 className="text-lg font-bold text-[#F8FAFC]">Recent Activity</h3>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-bold text-[#A78BFA] hover:text-purple-300 flex items-center gap-1 transition-colors"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoadingHistory ? (
          <div className="py-8 text-center text-xs text-[#94A3B8]">Loading recent activity...</div>
        ) : recentHistory.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#94A3B8]">
            No recommendation history found. Launch a planner above to get started!
          </div>
        ) : (
          <div className="space-y-4">
            {recentHistory.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-800/80 bg-[#0F172A] hover:border-purple-500/30 transition-all gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      item.type === 'home'
                        ? 'bg-purple-500/20 text-[#A78BFA] border border-purple-500/30'
                        : item.type === 'party'
                        ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                        : 'bg-cyan-500/20 text-[#38BDF8] border border-cyan-500/30'
                    }`}
                  >
                    {item.type === 'home' && <Home className="w-4 h-4" />}
                    {item.type === 'party' && <PartyPopper className="w-4 h-4" />}
                    {item.type === 'jewelry' && <Gem className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#F8FAFC] capitalize">
                        {item.type} Planner Query
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-[#94A3B8] mt-0.5 line-clamp-1">
                      {item.input}
                    </div>
                    <div className="text-xs font-semibold text-[#22C55E] mt-1">
                      {item.summary}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onViewDetail(item)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#1E293B] hover:bg-slate-700/60 text-[#A78BFA] border border-purple-500/30 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 self-start sm:self-center shrink-0"
                >
                  <Eye className="w-3.5 h-3.5 text-[#A78BFA]" />
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
