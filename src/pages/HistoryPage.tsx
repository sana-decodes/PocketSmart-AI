import React, { useEffect, useState } from 'react';
import { History, Home, PartyPopper, Gem, Eye, Sparkles, Filter, ArrowLeft, RefreshCw } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <button
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Your Recommendation History
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Review, compare, and reuse past plans across Home, Party, and Jewelry domains.
              </p>
            </div>
          </div>

          <button
            onClick={fetchHistory}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors self-start sm:self-auto"
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
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Recommendations ({historyItems.length})
        </button>

        <button
          onClick={() => setFilterType('home')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filterType === 'home'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home Interior ({historyItems.filter((i) => i.type === 'home').length})</span>
        </button>

        <button
          onClick={() => setFilterType('party')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filterType === 'party'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'bg-white text-orange-800 hover:bg-orange-50 border border-orange-200'
          }`}
        >
          <PartyPopper className="w-3.5 h-3.5" />
          <span>Party Plans ({historyItems.filter((i) => i.type === 'party').length})</span>
        </button>

        <button
          onClick={() => setFilterType('jewelry')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            filterType === 'jewelry'
              ? 'bg-pink-600 text-white shadow-sm'
              : 'bg-white text-pink-800 hover:bg-pink-50 border border-pink-200'
          }`}
        >
          <Gem className="w-3.5 h-3.5" />
          <span>Jewelry ({historyItems.filter((i) => i.type === 'jewelry').length})</span>
        </button>
      </div>

      {/* History Grid Cards */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          Loading recommendation history...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <History className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">
            No Recommendations Found
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            You haven't generated any budget plans in this category yet.
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Launch a Planner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isHome = item.type === 'home';
            const isParty = item.type === 'party';
            const isJewelry = item.type === 'jewelry';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all flex flex-col justify-between hover:shadow-lg ${
                  isHome
                    ? 'border-emerald-200 hover:border-emerald-400'
                    : isParty
                    ? 'border-orange-200 hover:border-orange-400'
                    : 'border-pink-200 hover:border-pink-400'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isHome
                            ? 'bg-emerald-100 text-emerald-700'
                            : isParty
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-pink-100 text-pink-700'
                        }`}
                      >
                        {isHome && <Home className="w-4 h-4" />}
                        {isParty && <PartyPopper className="w-4 h-4" />}
                        {isJewelry && <Gem className="w-4 h-4" />}
                      </div>
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-900">
                        {item.type} Plan
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 font-medium">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Input Details */}
                  <div className="mb-4">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Query Details
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {item.input}
                    </p>
                  </div>

                  {/* Result Summary */}
                  <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Budget & Remaining
                    </div>
                    <div className="text-xs font-bold text-emerald-700 mt-0.5">
                      {item.summary}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <button
                  onClick={() => onViewDetail(item)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 ${
                    isHome
                      ? 'bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200'
                      : isParty
                      ? 'bg-orange-50 hover:bg-orange-600 text-orange-800 hover:text-white border border-orange-200'
                      : 'bg-pink-50 hover:bg-pink-600 text-pink-800 hover:text-white border border-pink-200'
                  }`}
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
