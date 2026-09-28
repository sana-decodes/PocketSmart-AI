import React, { useState, useRef } from 'react';
import { Gem, Sparkles, CheckCircle2, Upload, X, ExternalLink, RefreshCw, AlertCircle, ArrowLeft, Shirt, Bookmark, BookmarkCheck, ShoppingBag, Printer } from 'lucide-react';
import { JewelryBudgetInput, JewelryBudgetResult } from '../types';
import { generateJewelryBudget } from '../api';
import { usePocket } from '../context/PocketContext';

interface JewelryPlannerPageProps {
  onNavigate: (page: string) => void;
}

export const JewelryPlannerPage: React.FC<JewelryPlannerPageProps> = ({ onNavigate }) => {
  const { formatPrice, addItem, removeItem, isItemSaved, setIsBasketOpen } = usePocket();

  const [budget, setBudget] = useState<number>(35000);
  const [occasion, setOccasion] = useState<string>('Wedding Reception');
  const [preferences, setPreferences] = useState<string>('Gold, emerald, and Kundan finish to complement rich silk');
  const [imageBase64, setImageBase64] = useState<string>('');
  const [imageName, setImageName] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<JewelryBudgetResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file is too large. Please select an image under 5MB.');
        return;
      }
      setImageName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageBase64('');
    setImageName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleApplyPresetOutfit = (presetName: string, occ: string, pref: string, b: number, primaryColor: string, secondaryColor: string) => {
    setBudget(b);
    setOccasion(occ);
    setPreferences(pref);
    setImageName(presetName);

    // Create a vector SVG outfit representation
    const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#0f172a"/><path d="M150 90 L250 90 L290 220 L110 220 Z" fill="${primaryColor}"/><path d="M110 220 L290 220 L350 380 L50 380 Z" fill="${secondaryColor}"/><circle cx="200" cy="155" r="28" fill="#f59e0b"/></svg>`;
    const sampleBase64 = `data:image/svg+xml;base64,${btoa(svgData)}`;
    setImageBase64(sampleBase64);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (budget <= 0) {
      setError('Please enter a valid budget greater than ₹0');
      return;
    }

    setIsLoading(true);
    setError(null);

    const inputData: JewelryBudgetInput = {
      total_budget: budget,
      occasion,
      preferences,
      image_base64: imageBase64,
    };

    try {
      const data = await generateJewelryBudget(inputData);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate jewelry recommendations');
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
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-[#38BDF8] border border-cyan-500/30 flex items-center justify-center font-bold">
              <Gem className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#F8FAFC] tracking-tight">
                Jewelry Budget Planner & Stylist
              </h1>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Multimodal color harmony matching with optional dress upload and direct links to Tanishq, CaratLane, and BlueStone.
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
        {/* Outfit Presets */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#94A3B8]">1-Click Test Outfits:</span>
          <button
            type="button"
            onClick={() => handleApplyPresetOutfit('Emerald Kanjivaram Silk', 'Wedding Reception', 'Traditional temple gold with emerald accents', 40000, '#047857', '#b45309')}
            className="px-2.5 py-1 rounded-lg bg-[#1E293B] border border-slate-700 hover:border-cyan-400 text-[#F8FAFC] text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Emerald Silk Saree (₹40K)</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPresetOutfit('Ruby Velvet Lehenga', 'Sangeet / Bridal', 'Polki Kundan statement choker & jhumkas', 75000, '#991b1b', '#d97706')}
            className="px-2.5 py-1 rounded-lg bg-[#1E293B] border border-slate-700 hover:border-cyan-400 text-[#F8FAFC] text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
            <span>Ruby Velvet Lehenga (₹75K)</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPresetOutfit('Pastel Georgette Anarkali', 'Festive Gathering', 'Rose gold & pearl subtle elegance', 25000, '#f472b6', '#38bdf8')}
            className="px-2.5 py-1 rounded-lg bg-[#1E293B] border border-slate-700 hover:border-cyan-400 text-[#F8FAFC] text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-pink-400 inline-block" />
            <span>Pastel Anarkali (₹25K)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Card 1: Budget & Occasion */}
          <div className="bg-[#1E293B] rounded-3xl p-6 border border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-[#F8FAFC] text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
              <span className="w-2 h-2 rounded-full bg-[#22D3EE]"></span>
              Budget & Occasion Details
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
                Occasion Type *
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#0F172A] border border-slate-700 rounded-xl text-xs font-semibold text-[#F8FAFC] focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none"
              >
                <option value="Wedding Reception">Wedding Reception</option>
                <option value="Bridal / Sangeet">Bridal / Sangeet</option>
                <option value="Festive Diwali / Eid / Puja">Festive Diwali / Eid / Puja</option>
                <option value="Cocktail Party / Formal Dinner">Cocktail Party / Formal Dinner</option>
                <option value="Engagement Ceremony">Engagement Ceremony</option>
                <option value="Everyday Workwear / Casual">Everyday Workwear / Casual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                Styling Preferences (Optional)
              </label>
              <textarea
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="e.g. Prefer yellow gold, antique Kundan, lightweight drop earrings, minimal necklace"
                rows={3}
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-[#F8FAFC] placeholder-slate-500 focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none"
              />
            </div>
          </div>

          {/* Card 2: Outfit Photo Upload (Multimodal AI) */}
          <div className="bg-[#1E293B] rounded-3xl p-6 border border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-[#F8FAFC] text-sm flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#22D3EE]"></span>
                  <span>Outfit Image Upload (Multimodal AI)</span>
                </span>
                <span className="text-[10px] font-bold text-[#38BDF8] bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                  Optional
                </span>
              </h3>
              <p className="text-xs text-[#94A3B8] mt-2">
                Upload your dress/outfit photo. Gemini will analyze the fabric colors, neckline, and formality to recommend harmonious jewelry.
              </p>
            </div>

            {imageBase64 ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0F172A] flex items-center justify-center p-3">
                <img
                  src={imageBase64}
                  alt="Uploaded outfit"
                  className="max-h-40 rounded-xl object-contain shadow-xs"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/90 text-[#F8FAFC] hover:bg-slate-800 transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-slate-900/90 text-[#F8FAFC] text-[10px] font-medium px-2 py-0.5 rounded border border-slate-700">
                  {imageName}
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-cyan-400/60 bg-[#0F172A] rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
              >
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-[#38BDF8] border border-cyan-500/30 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-[#F8FAFC]">
                  Click to browse dress image
                </div>
                <div className="text-[11px] text-[#94A3B8] mt-0.5">
                  PNG, JPG, WEBP up to 5MB
                </div>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
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
                <span>Gemini Analyzing Color Harmony...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#A78BFA]" />
                <span>Generate Jewelry Recommendations</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Results Section */}
      {result && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Action Header */}
          <div className="flex items-center justify-between bg-[#1E293B] p-4 rounded-2xl border border-slate-800 shadow-sm print:border-none">
            <span className="text-xs font-bold text-[#94A3B8]">
              Generated Jewelry Styling Plan
            </span>
            <button
              onClick={() => window.print()}
              className="py-1.5 px-3 rounded-xl border border-purple-500/30 bg-[#0F172A] hover:bg-slate-850 text-[#A78BFA] text-xs font-bold flex items-center gap-1.5 print:hidden transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Styling Plan</span>
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
                  Allocated Jewelry Cost
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

          {/* Multimodal Outfit Visual Analysis Card */}
          {result.outfit_analysis && (
            <div className="bg-[#1E293B] rounded-3xl p-6 border border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Shirt className="w-5 h-5 text-[#38BDF8]" />
                <h3 className="font-bold text-[#F8FAFC] text-sm">
                  Gemini Multimodal Visual Outfit Assessment
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800">
                  <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block">
                    Detected Dominant Colors
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {result.outfit_analysis.colors?.map((c, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-bold text-[#F8FAFC] bg-[#1E293B] border border-slate-700 px-2 py-0.5 rounded-lg"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800">
                  <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block">
                    Style Aesthetic
                  </span>
                  <div className="text-sm font-bold text-[#F8FAFC] mt-1">
                    {result.outfit_analysis.style || 'Traditional Fusion'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800">
                  <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block">
                    Formality Level
                  </span>
                  <div className="text-sm font-bold text-[#F8FAFC] mt-1">
                    {result.outfit_analysis.formality || 'Formal / Festive'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recommended Jewelry Items Grid */}
          <div>
            <h3 className="text-lg font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
              <Gem className="w-5 h-5 text-[#38BDF8]" />
              <span>Recommended Jewelry Pieces & Indian Jeweler Links</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.jewelry_recommendations?.map((item, idx) => {
                const saved = isItemSaved(item.item_type || `jewelry-${idx}`);
                return (
                  <div
                    key={idx}
                    className="bg-[#1E293B] rounded-3xl p-5 border border-slate-800 shadow-sm flex flex-col justify-between hover:border-cyan-500/40 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3 mb-3">
                        <div>
                          <span className="text-[10px] font-bold text-[#38BDF8] bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-lg uppercase tracking-wider">
                            {item.style || 'Matching Style'}
                          </span>
                          <h4 className="font-bold text-[#F8FAFC] text-sm mt-1">
                            {item.item_type}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#38BDF8] font-mono tabular-nums">
                            {formatPrice(item.estimated_price)}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (saved) {
                                removeItem(item.item_type);
                              } else {
                                addItem({
                                  name: item.item_type,
                                  category: item.style || 'Jewelry',
                                  source: 'jewelry',
                                  price: item.estimated_price,
                                  shoppingLinks: item.shopping_links,
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
                      </div>

                      <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                        {item.description}
                      </p>
                    </div>

                    {/* Direct Brand Links */}
                    {item.shopping_links && (
                      <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-2 text-[10px]">
                        {Object.entries(item.shopping_links).map(([brand, url]) => (
                          <a
                            key={brand}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-[#38BDF8] hover:text-cyan-300 bg-[#0F172A] border border-slate-700 px-2 py-1 rounded-md flex items-center gap-1 hover:border-cyan-500/40 transition-colors capitalize"
                          >
                            <span>{brand}</span>
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

          {/* Styling Tips */}
          {result.styling_tips && result.styling_tips.length > 0 && (
            <div className="bg-purple-950/20 rounded-3xl p-6 border border-purple-500/30">
              <h3 className="font-bold text-[#A78BFA] text-sm mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#A78BFA]" />
                <span>Jewelry Stylist Harmony & Neckline Advice</span>
              </h3>
              <ul className="space-y-2 text-xs text-[#F8FAFC]">
                {result.styling_tips.map((tip, idx) => (
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
