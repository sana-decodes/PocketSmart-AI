import React, { useState } from 'react';
import { PartyPopper, Sparkles, CheckCircle2, Printer, ExternalLink, RefreshCw, AlertCircle, ArrowLeft, Users, Utensils, Music } from 'lucide-react';
import { PartyBudgetInput, PartyBudgetResult } from '../types';
import { generatePartyBudget } from '../api';

interface PartyPlannerPageProps {
  onNavigate: (page: string) => void;
}

export const PartyPlannerPage: React.FC<PartyPlannerPageProps> = ({ onNavigate }) => {
  const [budget, setBudget] = useState<number>(15000);
  const [guests, setGuests] = useState<number>(10);
  const [partyType, setPartyType] = useState<string>('Birthday Party');
  const [venueType, setVenueType] = useState<string>('Home / Private Terrace');
  const [needsCatering, setNeedsCatering] = useState<boolean>(true);
  const [needsDecoration, setNeedsDecoration] = useState<boolean>(true);
  const [needsEntertainment, setNeedsEntertainment] = useState<boolean>(true);
  const [requirements, setRequirements] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PartyBudgetResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handlePrint = () => {
    window.print();
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
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
              <PartyPopper className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Party & Event Budget Planner
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Proportionate allocations for catering, venue, decor, and entertainment with Swiggy, Zomato, and OYO integrations.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Swiggy, Zomato & OYO Integrated</span>
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
          {/* Card 1: Budget & Guests */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              Basic Event Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    min={1000}
                    step={1000}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Number of Guests *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Users className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    value={guests}
                    onChange={(e) => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Party Type
              </label>
              <select
                value={partyType}
                onChange={(e) => setPartyType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Birthday Party">Birthday Celebration</option>
                <option value="Wedding Dinner">Intimate Wedding Dinner</option>
                <option value="Anniversary Party">Anniversary Party</option>
                <option value="Corporate Mixer">Corporate Mixer / Team Dinner</option>
                <option value="Casual Gathering">Casual Friends Get-Together</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Venue Type
              </label>
              <select
                value={venueType}
                onChange={(e) => setVenueType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Home / Private Terrace">Home / Private Terrace (₹0 venue fee)</option>
                <option value="Community Club Hall">Community Club / Society Banquet Hall</option>
                <option value="Rooftop Lounge / Restaurant">Rooftop Lounge / Restaurant Booking</option>
                <option value="Farmhouse / Outdoor Lawn">Farmhouse / Lawn Rental</option>
              </select>
            </div>
          </div>

          {/* Card 2: Services & Details */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              Party Needs & Requirements
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Services Needed
              </label>
              <div className="space-y-2.5">
                <label className="flex items-center gap-3 p-2.5 bg-slate-50 hover:bg-orange-50/50 rounded-xl border border-slate-200 cursor-pointer transition-colors text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={needsCatering}
                    onChange={(e) => setNeedsCatering(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <Utensils className="w-4 h-4 text-orange-500" />
                  <span>Catering & Food Platters (Swiggy / Zomato / Caterers)</span>
                </label>

                <label className="flex items-center gap-3 p-2.5 bg-slate-50 hover:bg-orange-50/50 rounded-xl border border-slate-200 cursor-pointer transition-colors text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={needsDecoration}
                    onChange={(e) => setNeedsDecoration(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <PartyPopper className="w-4 h-4 text-orange-500" />
                  <span>Decoration, Backdrops & Lighting (Amazon / Meesho)</span>
                </label>

                <label className="flex items-center gap-3 p-2.5 bg-slate-50 hover:bg-orange-50/50 rounded-xl border border-slate-200 cursor-pointer transition-colors text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={needsEntertainment}
                    onChange={(e) => setNeedsEntertainment(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <Music className="w-4 h-4 text-orange-500" />
                  <span>Music, Board Games & Gifts (BookMyShow / Amazon)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Additional Requirements
              </label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="e.g. Vegetarian only, chocolate fudge cake, kids games included"
                rows={2}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Allocating Event Budget with Gemini AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Generate Party Budget Plan</span>
            </>
          )}
        </button>
      </form>

      {/* Live AI Results View */}
      {result && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
                <span>Party Plan Ready</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Your Party Budget Plan
              </h2>
            </div>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-2 transition-colors self-start"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print / Save Plan</span>
            </button>
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

            <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-5">
              <div className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
                Total Allocated Cost
              </div>
              <div className="text-2xl font-black text-orange-800 mt-1">
                ₹{(result.total_budget - (result.remaining_budget || 0)).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5">
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Emergency Contingency Buffer
              </div>
              <div className="text-2xl font-black text-emerald-800 mt-1">
                ₹{(result.remaining_budget || 0).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Venue Suggestions Card */}
          {result.venue_suggestions && result.venue_suggestions.length > 0 && (
            <div className="border border-blue-200 bg-blue-50/30 rounded-2xl p-6">
              <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>Venue Recommendations & Booking Links</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.venue_suggestions.map((venue, vIdx) => (
                  <div key={vIdx} className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-sm">{venue.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          Cap: {venue.capacity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Type: {venue.type}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-700">
                        Est: ₹{venue.estimated_cost?.toLocaleString('en-IN')}
                      </span>
                      {venue.search_links && (
                        <div className="flex items-center gap-1">
                          {Object.entries(venue.search_links).slice(0, 3).map(([platform, url]) => (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-600 hover:text-white text-[10px] font-bold uppercase tracking-wider text-slate-700 transition-colors"
                            >
                              {platform}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categorized Breakdown */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <PartyPopper className="w-5 h-5 text-orange-600" />
              <span>Event Services & Vendors Breakdown</span>
            </h3>

            {result.budget_breakdown?.map((cat, cIdx) => (
              <div key={cIdx} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
                  <span className="font-bold text-sm capitalize">
                    {cat.category}
                  </span>
                  <span className="text-amber-400 font-extrabold text-sm">
                    ₹{cat.allocation?.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {cat.items?.map((item, iIdx) => (
                    <div key={iIdx} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                      <div className="max-w-xl">
                        <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex flex-col md:items-end gap-2 shrink-0">
                        <div className="text-base font-extrabold text-orange-700">
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
                                className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 hover:bg-orange-600 hover:text-white text-slate-700 border border-slate-200 transition-colors inline-flex items-center gap-1"
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
            <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-6">
              <h4 className="font-bold text-orange-900 text-sm mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-600" />
                Planning Advice & Cost-Saving Tips
              </h4>
              <ul className="space-y-2 text-xs text-orange-950">
                {result.additional_suggestions.map((sug, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
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
