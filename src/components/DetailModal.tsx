import React from 'react';
import { X, ExternalLink, Sparkles, CheckCircle2, ShoppingBag, MapPin, IndianRupee } from 'lucide-react';
import { HistoryItem } from '../types';

interface DetailModalProps {
  item: HistoryItem | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const result = item.fullResult || {};

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
              item.type === 'home'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : item.type === 'party'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                : 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
            }`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white capitalize">
                  {item.type} Budget Recommendation Details
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {item.type}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Generated on {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm">
          {/* Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500 font-medium">Input Query</div>
              <div className="font-semibold text-slate-900 mt-0.5">{item.input}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 font-medium">Budget Status</div>
              <div className="font-bold text-emerald-600 mt-0.5">{item.summary}</div>
            </div>
          </div>

          {/* Outfit Analysis if Jewelry */}
          {result.outfit_analysis && (
            <div className="bg-pink-50/60 border border-pink-200 rounded-xl p-4">
              <h4 className="font-bold text-pink-900 text-sm mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-500" />
                Outfit Style & Palette Analysis
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Detected Colors:</span>
                  <div className="font-semibold text-slate-900 mt-0.5">
                    {result.outfit_analysis.colors?.join(', ') || 'Neutral / Versatile'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Style Vibe:</span>
                  <div className="font-semibold text-slate-900 mt-0.5">
                    {result.outfit_analysis.style || 'Celebration Classic'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Formality:</span>
                  <div className="font-semibold text-slate-900 mt-0.5">
                    {result.outfit_analysis.formality || 'Festive'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Item Breakdown */}
          {result.budget_breakdown && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
                Allocated Items Breakdown
              </h4>
              <div className="space-y-3">
                {result.budget_breakdown.map((cat: any, idx: number) => (
                  <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-100/80 px-4 py-2 flex items-center justify-between font-semibold text-xs text-slate-800 uppercase tracking-wider">
                      <span>Category: {cat.category}</span>
                      <span className="text-blue-700 font-bold">
                        ₹{cat.allocation?.toLocaleString('en-IN') || 0}
                      </span>
                    </div>
                    <div className="divide-y divide-slate-100 p-2">
                      {cat.items?.map((prod: any, pIdx: number) => (
                        <div key={pIdx} className="p-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div>
                            <div className="font-semibold text-slate-900">{prod.name}</div>
                            <div className="text-slate-500 text-[11px]">{prod.description}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-emerald-700 whitespace-nowrap">
                              ₹{prod.estimated_price?.toLocaleString('en-IN')}
                            </span>
                            {prod.shopping_links && (
                              <div className="flex items-center gap-1">
                                {Object.entries(prod.shopping_links).map(([platform, url]: any) => (
                                  <a
                                    key={platform}
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold rounded border border-slate-200 transition-colors uppercase"
                                    title={`Search on ${platform}`}
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
                ))}
              </div>
            </div>
          )}

          {/* Jewelry Recommendations */}
          {result.jewelry_recommendations && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-600" />
                Jewelry Recommendations
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {result.jewelry_recommendations.map((jewel: any, jIdx: number) => (
                  <div key={jIdx} className="border border-pink-100 bg-pink-50/20 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{jewel.item_type}</span>
                        <span className="bg-pink-100 text-pink-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {jewel.style}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">{jewel.description}</p>
                    </div>
                    <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                      <div className="font-extrabold text-sm text-pink-700">
                        ₹{jewel.estimated_price?.toLocaleString('en-IN')}
                      </div>
                      {jewel.shopping_links && (
                        <div className="flex flex-wrap items-center gap-1">
                          {Object.entries(jewel.shopping_links).slice(0, 4).map(([brand, url]: any) => (
                            <a
                              key={brand}
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-0.5 bg-white hover:bg-pink-100 text-pink-800 text-[10px] font-medium rounded border border-pink-200 transition-colors capitalize"
                            >
                              {brand}
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

          {/* Additional Suggestions */}
          {(result.additional_suggestions || result.styling_tips) && (
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4">
              <h4 className="font-bold text-blue-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Smart Planning Advice & Styling Tips
              </h4>
              <ul className="space-y-1.5 text-xs text-blue-950">
                {(result.additional_suggestions || result.styling_tips || []).map((tip: string, tIdx: number) => (
                  <li key={tIdx} className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <span>PocketSmart AI Recommendation Record #{item.id.slice(0, 10)}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
