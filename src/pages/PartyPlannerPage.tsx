import React, { useState } from 'react';
import { PartyPopper, Sparkles, CheckCircle2, Printer, ExternalLink, RefreshCw, AlertCircle, ArrowLeft, Users, Utensils, Music, Bookmark, BookmarkCheck, ShoppingBag } from 'lucide-react';
import { PartyBudgetInput, PartyBudgetResult } from '../types';
import { generatePartyBudget } from '../api';
import { usePocket } from '../context/PocketContext';

interface PartyPlannerPageProps {
  onNavigate: (page: string) => void;
}

export const PartyPlannerPage: React.FC<PartyPlannerPageProps> = ({ onNavigate }) => {
  const { formatPrice, addItem, removeItem, isItemSaved, setIsBasketOpen } = usePocket();

  const [budget, setBudget] = useState<number>(35000);
  const [guests, setGuests] = useState<number>(25);
  const [partyType, setPartyType] = useState<string>('Birthday Party');
  const [venueType, setVenueType] = useState<string>('Outdoor Terrace / Lawn');
  const [needsCatering, setNeedsCatering] = useState<boolean>(true);
  const [needsDecoration, setNeedsDecoration] = useState<boolean>(true);
  const [needsEntertainment, setNeedsEntertainment] = useState<boolean>(true);
  const [requirements, setRequirements] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PartyBudgetResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const applyPreset = (b: number, g: number, p: string, v: string, req: string) => {
    setBudget(b);
    setGuests(g);
    setPartyType(p);
    setVenueType(v);
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

    const inputData: PartyBudgetInput = {
      total_budget: budget,
      num_guests: guests,
      party_type: partyType,
      venue_type: venueType,
      needs_catering: needsCatering,
      needs_decoration: needsDecoration,
      needs_entertainment: needsEntertainment,
      additional_requirements: requirements,
    };

    try {
      const data = await generatePartyBudget(inputData);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate party budget recommendations');
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
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center font-bold">
              <PartyPopper className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#F8FAFC] tracking-tight">
                Party & Event Budget Planner
              </h1>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Proportionate allocations for catering, venue, decor, and entertainment with Swiggy, Zomato, and OYO integrations.
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
        {/* Presets */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#94A3B8]">Quick Event Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset(12000, 10, 'Intimate Dinner Party', 'Home / Private Terrace', 'Fine dining buffet with starters and dessert')}
            className="px-2.5 py-1 rounded-lg bg-[#1E293B] border border-slate-700 hover:border-pink-400 text-[#F8FAFC] text-xs font-semibold transition-colors"
          >
            Intimate Dinner (₹12,000 · 10 Guests)
          </button>
          <button
            type="button"
            onClick={() => applyPreset(35000, 30, 'Birthday Party', 'Banquet Hall / Community Club', 'Photo booth, fairy lights, finger food & DJ sound')}
            className="px-2.5 py-1 rounded-lg bg-[#1E293B] border border-slate-700 hover:border-pink-400 text-[#F8FAFC] text-xs font-semibold transition-colors"
          >
            Birthday Bash (₹35,000 · 30 Guests)
          </button>
          <button
            type="button"
            onClick={() => applyPreset(120000, 80, 'Wedding Dinner / Reception', 'Resort Lawn / Hotel Ballroom', 'Full course live chaat counters, floral mandap & acoustic setup')}
            className="px-2.5 py-1 rounded-lg bg-[#1E293B] border border-slate-700 hover:border-pink-400 text-[#F8FAFC] text-xs font-semibold transition-colors"
          >
            Grand Banquet (₹1,20,000 · 80 Guests)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Card 1: Budget & Guests */}
          <div className="bg-[#1E293B] rounded-3xl p-6 border border-slate-800 shadow-sm space-y-5">
            <h3 className="font-bold text-[#F8FAFC] text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
              <span className="w-2 h-2 rounded-full bg-[#EC4899]"></span>
              Event Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    min={1000}
                    step={1000}
                    className="w-full pl-8 pr-4 py-2.5 bg-[#0F172A] border border-slate-700 rounded-xl text-sm font-semibold text-[#F8FAFC] focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none"
                    required
                  />
                </div>
                <div className="text-[11px] text-[#94A3B8] mt-1">
                  Display: {formatPrice(budget)}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                  Number of Guests *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Users className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    min={1}
                    max={500}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0F172A] border border-slate-700 rounded-xl text-sm font-semibold text-[#F8FAFC] focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none"
                    required
                  />
                </div>
                <div className="text-[11px] text-[#94A3B8] mt-1">
                  Per Guest: {formatPrice(Math.round(budget / Math.max(guests, 1)))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Occasion / Party Type *
              </label>
              <select
                value={partyType}
                onChange={(e) => setPartyType(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#0F172A] border border-slate-700 rounded-xl text-xs font-semibold text-[#F8FAFC] focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none"
              >
                <option value="Birthday Party">Birthday Party</option>
                <option value="Wedding Reception / Sangeet">Wedding Reception / Sangeet</option>
                <option value="Anniversary Celebration">Anniversary Celebration</option>
                <option value="Corporate Mixer / Team Dinner">Corporate Mixer / Team Dinner</option>
                <option value="Housewarming / Puja">Housewarming / Puja</option>
                <option value="Casual Gathering / Farewell">Casual Gathering / Farewell</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5">
                Preferred Venue Setting
              </label>
              <select
                value={venueType}
                onChange={(e) => setVenueType(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#0F172A] border border-slate-700 rounded-xl text-xs font-semibold text-[#F8FAFC] focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none"
              >
                <option value="Home / Private Terrace">Home / Private Terrace (₹0 Venue Cost)</option>
                <option value="Outdoor Terrace / Lawn">Outdoor Terrace / Lawn</option>
                <option value="Banquet Hall / Community Club">Banquet Hall / Community Club</option>
                <option value="Boutique Cafe / Restaurant PDR">Boutique Cafe / Restaurant PDR</option>
                <option value="Resort / Hotel Ballroom">Resort / Hotel Ballroom</option>
              </select>
            </div>
          </div>

          {/* Card 2: Services & Details */}
          <div className="bg-[#1E293B] rounded-3xl p-6 border border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-[#F8FAFC] text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
              <span className="w-2 h-2 rounded-full bg-[#EC4899]"></span>
              Services & Custom Requirements
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-2">
                Included Service Modules
              </label>
              <div className="space-y-2">
                <label className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer text-xs font-semibold transition-all ${
                  needsCatering ? 'bg-pink-500/10 border-pink-500/40 text-[#F8FAFC]' : 'bg-[#0F172A] border-slate-700 text-[#94A3B8]'
                }`}>
                  <input
                    type="checkbox"
                    checked={needsCatering}
                    onChange={(e) => setNeedsCatering(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded accent-[#7C3AED]"
                  />
                  <Utensils className="w-4 h-4 text-pink-400" />
                  <span>Catering & Refreshments (Swiggy / Zomato / Caterers)</span>
                </label>

                <label className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer text-xs font-semibold transition-all ${
                  needsDecoration ? 'bg-pink-500/10 border-pink-500/40 text-[#F8FAFC]' : 'bg-[#0F172A] border-slate-700 text-[#94A3B8]'
                }`}>
                  <input
                    type="checkbox"
                    checked={needsDecoration}
                    onChange={(e) => setNeedsDecoration(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded accent-[#7C3AED]"
                  />
                  <PartyPopper className="w-4 h-4 text-pink-400" />
                  <span>Event Decoration (Balloons, fairy lighting, backdrop)</span>
                </label>

                <label className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer text-xs font-semibold transition-all ${
                  needsEntertainment ? 'bg-pink-500/10 border-pink-500/40 text-[#F8FAFC]' : 'bg-[#0F172A] border-slate-700 text-[#94A3B8]'
                }`}>
                  <input
                    type="checkbox"
                    checked={needsEntertainment}
                    onChange={(e) => setNeedsEntertainment(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded accent-[#7C3AED]"
                  />
                  <Music className="w-4 h-4 text-pink-400" />
                  <span>Sound, DJ & Entertainment</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                Custom Menu / Theme Instructions
              </label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="e.g. Vegetarian Punjabi buffet, retro 90s theme, fairy light canopy"
                rows={3}
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
                <span>Gemini Planning Event...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#A78BFA]" />
                <span>Generate Smart Event Allocation</span>
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
              Generated Event Plan
            </span>
            <button
              onClick={() => window.print()}
              className="py-1.5 px-3 rounded-xl border border-purple-500/30 bg-[#0F172A] hover:bg-slate-850 text-[#A78BFA] text-xs font-bold flex items-center gap-1.5 print:hidden transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Event Plan</span>
            </button>
          </div>

          {/* Budget Summary Banner */}
          <div className="bg-[#1E293B] rounded-3xl p-6 border border-slate-800 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
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
                  Guest Count
                </span>
                <div className="text-2xl font-black text-[#A78BFA] mt-1 font-mono tabular-nums">
                  {guests}
                </div>
              </div>
              <div className="pt-4 sm:pt-0">
                <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Allocated Expense
                </span>
                <div className="text-2xl font-black text-[#F8FAFC] mt-1 font-mono tabular-nums">
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

          {/* Venue Suggestions */}
          {result.venue_suggestions && result.venue_suggestions.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
                <PartyPopper className="w-5 h-5 text-pink-400" />
                <span>Capacity-Matched Venue Suggestions</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {result.venue_suggestions.map((venue, idx) => {
                  const saved = isItemSaved(venue.name);
                  return (
                    <div
                      key={idx}
                      className="bg-[#1E293B] rounded-3xl p-5 border border-slate-800 shadow-sm flex flex-col justify-between hover:border-pink-500/40 transition-all"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded-lg uppercase tracking-wider">
                            {venue.type}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (saved) {
                                removeItem(venue.name);
                              } else {
                                addItem({
                                  name: venue.name,
                                  category: 'Venue',
                                  source: 'party',
                                  price: venue.estimated_cost,
                                  shoppingLinks: venue.search_links,
                                });
                              }
                            }}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              saved
                                ? 'bg-[#7C3AED]/20 border-purple-500/40 text-[#A78BFA]'
                                : 'bg-[#0F172A] border-slate-700 text-slate-500 hover:text-purple-300'
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
                        <h4 className="text-sm font-bold text-[#F8FAFC] mb-1">
                          {venue.name}
                        </h4>
                        <div className="text-xs text-[#94A3B8] space-y-1 mb-4 font-mono">
                          <div>Capacity: {venue.capacity} Guests</div>
                          <div>Estimated Cost: {formatPrice(venue.estimated_cost)}</div>
                        </div>
                      </div>

                      {venue.search_links && (
                        <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-2 text-[10px]">
                          {Object.entries(venue.search_links).map(([platform, url]) => (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-[#38BDF8] hover:text-cyan-300 bg-[#0F172A] border border-slate-700 px-2 py-1 rounded-md flex items-center gap-1 hover:border-cyan-500/40 transition-colors capitalize"
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
          )}

          {/* Itemized Categories */}
          <div>
            <h3 className="text-lg font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-pink-400" />
              <span>Catering, Decor & Entertainment Allocation</span>
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
                      <span className="text-xs font-bold text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded-lg font-mono tabular-nums">
                        {formatPrice(cat.allocation)}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {cat.items?.map((item, itemIdx) => {
                        const saved = isItemSaved(item.name);
                        return (
                          <div
                            key={itemIdx}
                            className="p-3 rounded-2xl bg-[#0F172A] border border-slate-800/80 space-y-1.5 hover:border-pink-500/30 transition-all"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="text-xs font-bold text-[#F8FAFC] leading-snug">
                                  {item.name}
                                </h4>
                                <span className="text-[11px] text-[#94A3B8] font-mono font-bold">
                                  {formatPrice(item.estimated_price)}
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
                                      source: 'party',
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

                            {item.shopping_links && (
                              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2 text-[10px]">
                                {Object.entries(item.shopping_links).map(([platform, url]) => (
                                  <a
                                    key={platform}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-[#38BDF8] hover:text-cyan-300 bg-[#1E293B] border border-slate-700 px-2 py-0.5 rounded-md flex items-center gap-1 hover:border-cyan-500/40 transition-colors capitalize"
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

          {/* Suggestions */}
          {result.additional_suggestions && result.additional_suggestions.length > 0 && (
            <div className="bg-purple-950/20 rounded-3xl p-6 border border-purple-500/30">
              <h3 className="font-bold text-[#A78BFA] text-sm mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#A78BFA]" />
                <span>Event Coordinator Advice & Cost Savings</span>
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
