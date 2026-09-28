import React, { useState } from 'react';
import { Home, Sparkles, CheckCircle2, ShoppingBag, ExternalLink, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import { HomeBudgetInput, HomeBudgetResult } from '../types';
import { generateHomeBudget } from '../api';

interface HomePlannerPageProps {
  onNavigate: (page: string) => void;
}

export const HomePlannerPage: React.FC<HomePlannerPageProps> = ({ onNavigate }) => {
  const [budget, setBudget] = useState<number>(10000);
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
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Home Interior Budget Planner
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Optimize room decor, lighting, and furniture within your defined budget with Indian shopping links.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>IKEA, Amazon & Flipkart Ready</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Card 1: Budget & Rooms */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Budget & Room Selection
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Total Budget (INR ₹) *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  min={500}
                  step={500}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                  required
                />
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Typical range: ₹5,000 to ₹1,00,000+
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Rooms to Consider
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <label className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  livingRoom ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-600'
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
                  kitchen ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-600'
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
                  bedroom ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-600'
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

          {/* Card 2: Fixtures & Furniture Counts */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Item Quantities Needed
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Lights / Fixtures
                </label>
                <input
                  type="number"
                  value={lights}
                  onChange={(e) => setLights(Math.max(0, parseInt(e.target.value) || 0))}
                  min={0}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-center outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Ceiling Fans
                </label>
                <input
                  type="number"
                  value={fans}
                  onChange={(e) => setFans(Math.max(0, parseInt(e.target.value) || 0))}
                  min={0}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-center outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Furniture Pieces
                </label>
                <input
                  type="number"
                  value={furniture}
                  onChange={(e) => setFurniture(Math.max(0, parseInt(e.target.value) || 0))}
                  min={0}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-center outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Dining Tables
                </label>
                <input
                  type="number"
                  value={diningTables}
                  onChange={(e) => setDiningTables(Math.max(0, parseInt(e.target.value) || 0))}
                  min={0}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-center outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Additional Requirements / Preferences
              </label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="e.g. Modern minimalist look, warm yellow light bulbs, compact 4-seater wooden dining set"
                rows={2}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing Budget with Gemini AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Home Budget Recommendations</span>
            </>
          )}
        </button>
      </form>

      {/* Live AI Results View */}
      {result && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8 animate-in fade-in duration-300">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Plan Generated</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Your Personalized Home Budget Plan
            </h2>
          </div>

          {/* Budget Summary Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Budget
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                ₹{result.total_budget?.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5">
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Allocated Spending
              </div>
              <div className="text-2xl font-black text-emerald-800 mt-1">
                ₹{(result.total_budget - (result.remaining_budget || 0)).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5">
              <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                Remaining Buffer
              </div>
              <div className="text-2xl font-black text-blue-800 mt-1">
                ₹{(result.remaining_budget || 0).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Categorized Products Breakdown */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <span>Recommended Products & Shopping Links</span>
            </h3>

            {result.budget_breakdown?.map((cat, cIdx) => (
              <div key={cIdx} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
                  <span className="font-bold text-sm capitalize">
                    {cat.category.replace('_', ' ')}
                  </span>
                  <span className="text-amber-400 font-extrabold text-sm">
                    Allocation: ₹{cat.allocation?.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {cat.items?.map((item, iIdx) => (
                    <div key={iIdx} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                      <div className="max-w-xl">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                          {item.quantity && (
                            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
                              Qty: {item.quantity}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex flex-col md:items-end gap-2 shrink-0">
                        <div className="text-base font-extrabold text-emerald-700">
                          ₹{item.estimated_price?.toLocaleString('en-IN')}
                        </div>

                        {item.shopping_links && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {Object.entries(item.shopping_links).map(([store, url]) => (
                              <a
                                key={store}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 border border-slate-200 transition-colors inline-flex items-center gap-1"
                              >
                                <span>{store}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Suggestions */}
          {result.additional_suggestions?.length > 0 && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6">
              <h4 className="font-bold text-amber-900 text-sm mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Additional Suggestions & Money-Saving Tips
              </h4>
              <ul className="space-y-2 text-xs text-amber-950">
                {result.additional_suggestions.map((sug, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{sug}</span>
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
