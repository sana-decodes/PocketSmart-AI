import React, { useEffect, useState } from 'react';
import { History, Home, PartyPopper, Gem, Eye, ArrowLeft, RefreshCw } from 'lucide-react';
import { HistoryItem } from '../types';
import { getRecommendationHistory } from '../api';

interface HistoryPageProps {
  onNavigate: (page: string) => void;
  onViewDetail: (item: HistoryItem) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onNavigate, onViewDetail }) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const items = await getRecommendationHistory();
      setHistoryItems(items);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredItems = historyItems.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <button
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#94A3B8] hover:text-[#F8FAFC] mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E293B] p-6 rounded-3xl border border-slate-800 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-[#A78BFA] border border-purple-500/30 flex items-center justify-center font-bold">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#F8FAFC] tracking-tight">
                Your Recommendation History
              </h1>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Review, compare, and reuse past plans across Home, Party, and Jewelry domains.
              </p>
            </div>
          </div>

          <button
            onClick={fetchHistory}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-[#A78BFA] border border-purple-500/30 text-xs font-semibold transition-colors self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            filterType === 'all'
              ? 'bg-[#7C3AED] text-[#F8FAFC] shadow-sm'
              : 'bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] border border-slate-700'
          }`}
        >
          All Recommendations ({historyItems.length})
        </button>

        <button
          onClick={() => setFilterType('home')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filterType === 'home'
              ? 'bg-[#7C3AED] text-[#F8FAFC] shadow-sm'
              : 'bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] border border-slate-700'
          }`}
        >
          <Home className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>Home Interior ({historyItems.filter((i) => i.type === 'home').length})</span>
        </button>

        <button
          onClick={() => setFilterType('party')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filterType === 'party'
              ? 'bg-[#7C3AED] text-[#F8FAFC] shadow-sm'
              : 'bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] border border-slate-700'
          }`}
        >
          <PartyPopper className="w-3.5 h-3.5 text-pink-400" />
          <span>Party Plans ({historyItems.filter((i) => i.type === 'party').length})</span>
        </button>

        <button
          onClick={() => setFilterType('jewelry')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filterType === 'jewelry'
              ? 'bg-[#7C3AED] text-[#F8FAFC] shadow-sm'
              : 'bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] border border-slate-700'
          }`}
        >
          <Gem className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Jewelry ({historyItems.filter((i) => i.type === 'jewelry').length})</span>
        </button>
      </div>

      {/* History Grid Cards */}
      {isLoading ? (
        <div className="py-20 text-center text-[#94A3B8] text-xs">
          Loading recommendation history...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-[#1E293B] rounded-3xl border border-slate-800 p-12 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-slate-500 flex items-center justify-center mx-auto mb-4 border border-slate-800">
            <History className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-[#F8FAFC] text-base mb-1">
            No Recommendations Found
          </h3>
          <p className="text-xs text-[#94A3B8] mb-6">
            You haven't generated any budget plans in this category yet.
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-5 py-2.5 bg-[#7C3AED] hover:bg-[#8B5CF6] text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/30 transition-all active:scale-95"
          >
            Launch a Planner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isHome = item.type === 'home';
            const isParty = item.type === 'party';

            return (
              <div
                key={item.id}
                className="bg-[#1E293B] rounded-2xl p-6 shadow-sm border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isHome
                            ? 'bg-purple-500/20 text-[#A78BFA] border border-purple-500/30'
                            : isParty
                            ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                            : 'bg-cyan-500/20 text-[#38BDF8] border border-cyan-500/30'
                        }`}
                      >
                        {isHome && <Home className="w-4 h-4" />}
                        {isParty && <PartyPopper className="w-4 h-4" />}
                        {!isHome && !isParty && <Gem className="w-4 h-4" />}
                      </div>
                      <span className="font-bold text-xs uppercase tracking-wider text-[#F8FAFC]">
                        {item.type} Plan
                      </span>
                    </div>

                    <span className="text-[11px] text-[#94A3B8] font-medium">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Input Details */}
                  <div className="mb-4">
                    <div className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                      Query Details
                    </div>
                    <p className="text-xs text-[#F8FAFC] leading-relaxed font-medium">
                      {item.input}
                    </p>
                  </div>

                  {/* Result Summary */}
                  <div className="mb-6 p-3 rounded-xl bg-[#0F172A] border border-slate-800">
                    <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                      Budget & Remaining
                    </div>
                    <div className="text-xs font-bold text-[#22C55E] mt-0.5">
                      {item.summary}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <button
                  onClick={() => onViewDetail(item)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#7C3AED] hover:bg-[#8B5CF6] text-white shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full Details</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
