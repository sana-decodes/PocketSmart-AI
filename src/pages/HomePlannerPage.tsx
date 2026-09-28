import React, { useState } from 'react';
import { Home, Sparkles, CheckCircle2, ShoppingBag, ExternalLink, RefreshCw, AlertCircle, ArrowLeft, Bookmark, BookmarkCheck, Printer } from 'lucide-react';
import { HomeBudgetInput, HomeBudgetResult } from '../types';
import { generateHomeBudget } from '../api';
import { usePocket } from '../context/PocketContext';

interface HomePlannerPageProps {
  onNavigate: (page: string) => void;
}

export const HomePlannerPage: React.FC<HomePlannerPageProps> = ({ onNavigate }) => {
  const { formatPrice, addItem, removeItem, isItemSaved, setIsBasketOpen } = usePocket();

  const [budget, setBudget] = useState<number>(35000);
  const [lights, setLights] = useState<number>(4);
  const [fans, setFans] = useState<number>(2);
  const [furniture, setFurniture] = useState<number>(2);
  const [diningTables, setDiningTables] = useState<number>(1);
  const [livingRoom, setLivingRoom] = useState<boolean>(true);
  const [kitchen, setKitchen] = useState<boolean>(false);
  const [bedroom, setBedroom] = useState<boolean>(true);
  const [requirements, setRequirements] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<HomeBudgetResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const applyPreset = (presetBudget: number, l: number, f: number, furn: number, d: number, req: string) => {
    setBudget(presetBudget);
    setLights(l);
    setFans(f);
    setFurniture(furn);
    setDiningTables(d);
    setRequirements(req);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (budget <= 0) {
      setError('Please enter a valid budget greater than ₹0');
      return;
    }

    setIsLoading(true);
    setError(null);

    const inputData: HomeBudgetInput = {
      total_budget: budget,
      num_lights: lights,
      num_fans: fans,
      num_furniture: furniture,
      num_dining_tables: diningTables,
      has_living_room: livingRoom,
      has_kitchen: kitchen,
      has_bedroom: bedroom,
      additional_requirements: requirements,
    };

    try {
      const data = await generateHomeBudget(inputData);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate home budget recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto print:p-0 print:bg-white print:text-black">
      {/* Page Header */}
      <div className="mb-8 print:hidden">
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
              <Home className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#F8FAFC] tracking-tight">
                Home Interior Budget Planner
              </h1>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Optimize room decor, lighting, and furniture within your budget with Indian e-commerce links.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBasketOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-purple-500/30 bg-[#0F172A] hover:bg-slate-800 text-[#A78BFA] text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>View Pocket Basket</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-950/20 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 print:hidden">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#EF4444]" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mb-10 print:hidden">
        {/* Preset Tiers */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#94A3B8]">Quick Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset(15000, 4, 1, 2, 0, 'Compact studio, energy efficient LED focus')}
            className="px-2.5 py-1 rounded-lg bg-[#1E293B] border border-slate-700 hover:border-purple-400 text-[#F8FAFC] text-xs font-semibold transition-colors"
          >
            Studio Compact (₹15,000)
          </button>
          <button
            type="button"
            onClick={() => applyPreset(45000, 6, 3, 3, 1, '2BHK family flat with warm ambient lighting & durable dining table')}
            className="px-2.5 py-1 rounded-lg bg-[#1E293B] border border-slate-700 hover:border-purple-400 text-[#F8FAFC] text-xs font-semibold transition-colors"
          >
            2BHK Family (₹45,000)
          </button>
          <button
            type="button"
            onClick={() => applyPreset(120000, 10, 4, 5, 1, '3BHK premium styling, smart RGB ceiling strips, designer wooden accents')}
            className="px-2.5 py-1 rounded-lg bg-[#1E293B] border border-slate-700 hover:border-purple-400 text-[#F8FAFC] text-xs font-semibold transition-colors"
          >
            3BHK Premium (₹1,20,000)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Card 1: Budget & Rooms */}
          <div className="bg-[#1E293B] rounded-3xl p-6 border border-slate-800 shadow-sm space-y-5">
            <h3 className="font-bold text-[#F8FAFC] text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
              Budget & Room Selection
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Total Budget (INR ₹) *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  min={500}
                  step={500}
                  className="w-full pl-8 pr-4 py-2.5 bg-[#0F172A] border border-slate-700 rounded-xl text-sm font-semibold text-[#F8FAFC] focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none"
                  required
                />
              </div>
              <div className="text-[11px] text-[#94A3B8] mt-1">
                Active converted display: {formatPrice(budget)}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-2">
                Rooms to Consider
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <label className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  livingRoom ? 'bg-[#7C3AED]/20 border-purple-500/50 text-[#F8FAFC]' : 'bg-[#0F172A] border-slate-700 text-[#94A3B8]'
                }`}>
                  <input
                    type="checkbox"
                    checked={livingRoom}
                    onChange={(e) => setLivingRoom(e.target.checked)}
                    className="sr-only"
                  />
                  <span>Living Room</span>
                </label>

                <label className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  kitchen ? 'bg-[#7C3AED]/20 border-purple-500/50 text-[#F8FAFC]' : 'bg-[#0F172A] border-slate-700 text-[#94A3B8]'
                }`}>
                  <input
                    type="checkbox"
                    checked={kitchen}
                    onChange={(e) => setKitchen(e.target.checked)}
                    className="sr-only"
                  />
                  <span>Kitchen</span>
                </label>

                <label className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  bedroom ? 'bg-[#7C3AED]/20 border-purple-500/50 text-[#F8FAFC]' : 'bg-[#0F172A] border-slate-700 text-[#94A3B8]'
                }`}>
                  <input
                    type="checkbox"
                    checked={bedroom}
                    onChange={(e) => setBedroom(e.target.checked)}
                    className="sr-only"
                  />
                  <span>Bedroom</span>
                </label>
              </div>
            </div>
          </div>

          {/* Card 2: Fixture Requirements */}
          <div className="bg-[#1E293B] rounded-3xl p-6 border border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-[#F8FAFC] text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
              Fixture & Item Quantities
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Lighting Fixtures
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={lights}
                  onChange={(e) => setLights(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs font-semibold text-[#F8FAFC] focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Ceiling Fans
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={fans}
                  onChange={(e) => setFans(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs font-semibold text-[#F8FAFC] focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Furniture Pieces
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={furniture}
                  onChange={(e) => setFurniture(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs font-semibold text-[#F8FAFC] focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Dining Tables
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={diningTables}
                  onChange={(e) => setDiningTables(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs font-semibold text-[#F8FAFC] focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                Additional Design Notes (Optional)
              </label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="e.g. Prefer warm LED bulbs, Scandinavian wood tones, compact dining set"
                rows={2}
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-[#F8FAFC] placeholder-slate-500 focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Gemini Analyzing Home Budget...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#A78BFA]" />
                <span>Generate Smart Home Allocation</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Results Section */}
      {result && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Printable Action Header */}
          <div className="flex items-center justify-between bg-[#1E293B] p-4 rounded-2xl border border-slate-800 shadow-sm print:border-none">
            <span className="text-xs font-bold text-[#94A3B8]">
              Generated Recommendation Plan
            </span>
            <button
              onClick={() => window.print()}
              className="py-1.5 px-3 rounded-xl border border-purple-500/30 bg-[#0F172A] hover:bg-slate-850 text-[#A78BFA] text-xs font-bold flex items-center gap-1.5 print:hidden transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Procurement Plan</span>
            </button>
          </div>

          {/* Budget Summary Banner */}
          <div className="bg-[#1E293B] rounded-3xl p-6 border border-slate-800 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
              <div className="pt-2 sm:pt-0">
                <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Target Budget
                </span>
                <div className="text-2xl font-black text-[#F8FAFC] mt-1 font-mono tabular-nums">
                  {formatPrice(result.total_budget)}
                </div>
              </div>
              <div className="pt-4 sm:pt-0">
                <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Allocated Expense
                </span>
                <div className="text-2xl font-black text-[#A78BFA] mt-1 font-mono tabular-nums">
                  {formatPrice(result.total_budget - (result.remaining_budget || 0))}
                </div>
              </div>
              <div className="pt-4 sm:pt-0">
                <span className="text-xs font-semibold text-[#22C55E] uppercase tracking-wider">
                  Remaining / Buffer
                </span>
                <div className="text-2xl font-black text-[#22C55E] mt-1 font-mono tabular-nums">
                  {formatPrice(result.remaining_budget || 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Categories */}
          <div>
            <h3 className="text-lg font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#8B5CF6]" />
              <span>Itemized Recommendations & Indian Platform Links</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.budget_breakdown?.map((cat, idx) => (
                <div
                  key={idx}
                  className="bg-[#1E293B] rounded-3xl p-5 border border-slate-800 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                      <span className="font-bold text-[#F8FAFC] capitalize text-sm">
                        {cat.category.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs font-bold text-[#A78BFA] bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-lg font-mono tabular-nums">
                        {formatPrice(cat.allocation)}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {cat.items?.map((item, itemIdx) => {
                        const saved = isItemSaved(item.name);
                        return (
                          <div
                            key={itemIdx}
                            className="p-3 rounded-2xl bg-[#0F172A] border border-slate-800/80 space-y-2 hover:border-purple-500/30 transition-all"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="text-xs font-bold text-[#F8FAFC] leading-snug">
                                  {item.name}
                                </h4>
                                <span className="text-[11px] text-[#94A3B8] font-mono font-bold">
                                  Qty: {item.quantity || 1} · {formatPrice(item.estimated_price)}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  if (saved) {
                                    removeItem(item.name);
                                  } else {
                                    addItem({
                                      name: item.name,
                                      category: cat.category,
                                      source: 'home',
                                      price: item.estimated_price,
                                      shoppingLinks: item.shopping_links,
                                    });
                                  }
                                }}
                                className={`p-1.5 rounded-lg border transition-colors ${
                                  saved
                                    ? 'bg-[#7C3AED]/20 border-purple-500/40 text-[#A78BFA]'
                                    : 'bg-[#1E293B] border-slate-700 text-slate-500 hover:text-purple-300'
                                }`}
                                title={saved ? 'Pinned to basket' : 'Pin to Pocket Basket'}
                              >
                                {saved ? (
                                  <BookmarkCheck className="w-3.5 h-3.5 text-[#A78BFA]" />
                                ) : (
                                  <Bookmark className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>

                            <p className="text-[11px] text-[#94A3B8] line-clamp-2">
                              {item.description}
                            </p>

                            {/* Direct Retail Links */}
                            {item.shopping_links && (
                              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2 text-[10px]">
                                {Object.entries(item.shopping_links).map(([platform, url]) => (
                                  <a
                                    key={platform}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-[#38BDF8] hover:text-cyan-300 bg-[#1E293B] border border-slate-700/80 px-2 py-0.5 rounded-md flex items-center gap-1 hover:border-cyan-500/40 transition-colors capitalize"
                                  >
                                    <span>{platform}</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculation Table */}
          {result.calculation_table && result.calculation_table.length > 0 && (
            <div className="bg-[#1E293B] rounded-3xl p-6 border border-slate-800 shadow-sm">
              <h3 className="font-bold text-[#F8FAFC] text-sm mb-4">
                Allocation Calculation Table
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0F172A] border-b border-slate-800 text-[#94A3B8] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Items Count</th>
                      <th className="py-3 px-4">Total Cost</th>
                      <th className="py-3 px-4">% of Budget</th>
                      <th className="py-3 px-4">Visual Distribution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono">
                    {result.calculation_table.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-sans font-semibold capitalize text-[#F8FAFC]">
                          {row.category.replace(/_/g, ' ')}
                        </td>
                        <td className="py-3 px-4 tabular-nums text-[#94A3B8]">{row.items_count}</td>
                        <td className="py-3 px-4 font-bold text-[#F8FAFC] tabular-nums">
                          {formatPrice(row.total_cost)}
                        </td>
                        <td className="py-3 px-4 tabular-nums text-[#A78BFA]">
                          {row.percentage_of_budget}%
                        </td>
                        <td className="py-3 px-4 w-44">
                          <div className="w-full bg-[#0F172A] h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#7C3AED] h-full rounded-full transition-all"
                              style={{ width: `${Math.min(row.percentage_of_budget, 100)}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {result.additional_suggestions && result.additional_suggestions.length > 0 && (
            <div className="bg-purple-950/20 rounded-3xl p-6 border border-purple-500/30">
              <h3 className="font-bold text-[#A78BFA] text-sm mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#A78BFA]" />
                <span>Interior Designer & Cost Optimization Tips</span>
              </h3>
              <ul className="space-y-2 text-xs text-[#F8FAFC]">
                {result.additional_suggestions.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-[#A78BFA]">·</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
