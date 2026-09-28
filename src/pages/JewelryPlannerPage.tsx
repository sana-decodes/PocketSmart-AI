import React, { useState, useRef } from 'react';
import { Gem, Sparkles, CheckCircle2, Upload, X, ExternalLink, RefreshCw, AlertCircle, ArrowLeft, Image as ImageIcon, Shirt } from 'lucide-react';
import { JewelryBudgetInput, JewelryBudgetResult } from '../types';
import { generateJewelryBudget } from '../api';

interface JewelryPlannerPageProps {
  onNavigate: (page: string) => void;
}

export const JewelryPlannerPage: React.FC<JewelryPlannerPageProps> = ({ onNavigate }) => {
  const [budget, setBudget] = useState<number>(10000);
  const [occasion, setOccasion] = useState<string>('Wedding');
  const [preferences, setPreferences] = useState<string>('Gold & Kundan traditional look');
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

  const handleSampleOutfit = () => {
    // A clean SVG base64 test image of a festive dress/lehenga so user can test multimodal anytime
    const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#1e3a8a"/><path d="M140 100 L260 100 L300 250 L100 250 Z" fill="#b91c1c"/><path d="M100 250 L300 250 L360 380 L40 380 Z" fill="#047857"/><circle cx="200" cy="180" r="30" fill="#fbbf24"/></svg>`;
    const sampleBase64 = `data:image/svg+xml;base64,${btoa(svgData)}`;
    setImageBase64(sampleBase64);
    setImageName('sample_festive_outfit.svg');
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
            <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold">
              <Gem className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Jewelry Budget Planner & Outfit Stylist
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                AI color harmony matching with optional dress image upload and brand recommendations from Tanishq, CaratLane, and BlueStone.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-50 border border-pink-200 text-pink-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            <span>Multimodal Vision Analysis</span>
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
          {/* Card 1: Budget & Occasion */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span>
              Budget & Occasion Details
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
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-pink-500 focus:bg-white outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Occasion
              </label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="Wedding">Wedding / Sangeet / Reception</option>
                <option value="Festival">Festival (Diwali, Eid, Navratri, Durga Puja)</option>
                <option value="Birthday">Birthday Celebration / Cocktail</option>
                <option value="Formal Dinner">Formal Gala / Corporate Event</option>
                <option value="Casual Daily">Everyday / Casual Smart</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Style Preferences & Materials
              </label>
              <textarea
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="e.g. Prefer rose gold or antique gold, avoid heavy necklaces, love pearl choker and minimalist rings"
                rows={3}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* Card 2: Outfit Image Upload (Multimodal AI) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                  Outfit Image (Optional Multimodal Input)
                </h3>
                <button
                  type="button"
                  onClick={handleSampleOutfit}
                  className="text-[11px] font-bold text-pink-600 hover:text-pink-700 underline"
                >
                  Load Sample Outfit
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="outfit-file-input"
              />

              {!imageBase64 ? (
                <label
                  htmlFor="outfit-file-input"
                  className="border-2 border-dashed border-slate-300 hover:border-pink-400 bg-slate-50 hover:bg-pink-50/20 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-slate-800 text-xs">
                    Click to upload dress or outfit photo
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                  <div className="mt-3 text-[10px] text-pink-700 bg-pink-100/60 font-semibold px-2.5 py-1 rounded-full">
                    Gemini Vision will match neckline, fabric & color
                  </div>
                </label>
              ) : (
                <div className="relative border border-slate-200 rounded-2xl p-3 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 truncate">
                      <ImageIcon className="w-4 h-4 text-pink-600 shrink-0" />
                      <span className="truncate">{imageName || 'Uploaded Outfit'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1 rounded-lg bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors shadow-sm"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-900/5 flex items-center justify-center border border-slate-200">
                    <img
                      src={imageBase64}
                      alt="Uploaded Outfit Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-500 mt-4 italic">
              Tip: Uploading a clear photo of your dress or lehenga allows Gemini to detect color undertones and suggest matching metal finishes.
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-8 py-3.5 bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-pink-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing Outfit & Budget with Gemini AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Get Personalized Jewelry Recommendations</span>
            </>
          )}
        </button>
      </form>

      {/* Live AI Results View */}
      {result && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8 animate-in fade-in duration-300">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-xs font-bold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-pink-600" />
              <span>Styling Analysis Complete</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Your Personalized Jewelry Recommendations
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

            <div className="bg-pink-50/70 border border-pink-200 rounded-2xl p-5">
              <div className="text-xs font-semibold text-pink-700 uppercase tracking-wider">
                Jewelry Allocation
              </div>
              <div className="text-2xl font-black text-pink-800 mt-1">
                ₹{(result.total_budget - (result.remaining_budget || 0)).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5">
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Remaining Balance
              </div>
              <div className="text-2xl font-black text-emerald-800 mt-1">
                ₹{(result.remaining_budget || 0).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Outfit Analysis Card */}
          {result.outfit_analysis && (
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-2xl p-6">
              <h3 className="font-bold text-pink-900 text-sm mb-3 flex items-center gap-2">
                <Shirt className="w-4 h-4 text-pink-600" />
                <span>AI Outfit Vision & Aesthetics Analysis</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="font-semibold text-slate-500">Color Palette Identified</div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {result.outfit_analysis.colors?.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-white text-slate-800 font-semibold border border-pink-200 shadow-xs">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-slate-500">Aesthetic Style</div>
                  <div className="font-bold text-slate-900 mt-1.5">
                    {result.outfit_analysis.style}
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-slate-500">Formality Level</div>
                  <div className="font-bold text-slate-900 mt-1.5">
                    {result.outfit_analysis.formality}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recommended Jewelry Items Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Gem className="w-5 h-5 text-pink-600" />
              <span>Recommended Jewelry Pieces</span>
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {result.jewelry_recommendations?.map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-pink-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="max-w-xl">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base">{item.item_type}</h4>
                      <span className="bg-pink-100 text-pink-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-pink-200">
                        {item.style}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex flex-col md:items-end gap-2 shrink-0">
                    <div className="text-lg font-black text-pink-700">
                      ₹{item.estimated_price?.toLocaleString('en-IN')}
                    </div>

                    {item.shopping_links && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {Object.entries(item.shopping_links).map(([brand, url]) => (
                          <a
                            key={brand}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 hover:bg-pink-600 hover:text-white text-slate-700 border border-slate-200 transition-colors inline-flex items-center gap-1 capitalize"
                          >
                            <span>{brand}</span>
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

          {/* Styling Tips Box */}
          {result.styling_tips?.length > 0 && (
            <div className="bg-pink-50/70 border border-pink-200 rounded-2xl p-6">
              <h4 className="font-bold text-pink-900 text-sm mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-600" />
                Styling & Coordination Tips
              </h4>
              <ul className="space-y-2 text-xs text-pink-950">
                {result.styling_tips.map((tip, tIdx) => (
                  <li key={tIdx} className="flex items-start gap-2">
                    <span className="text-pink-500 font-bold">•</span>
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
