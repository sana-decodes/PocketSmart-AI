import React from 'react';
import { Sparkles, Shield, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white">
                Pocket<span className="text-amber-400">Smart</span> AI
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              AI-powered budget planning assistant delivering personalized, cost-effective recommendations across home decor, celebrations, and jewelry styling.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>INR Indian Market Pricing & Real Vendor Integrations</span>
            </div>
          </div>

          {/* Product Modules */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Smart Planners
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate?.('home-planner')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Home Interior Budget Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('party-planner')}
                  className="hover:text-amber-400 transition-colors"
                >
                  AI Party & Event Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('jewelry-planner')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Multimodal Jewelry Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('history')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Personalized Recommendation History
                </button>
              </li>
            </ul>
          </div>

          {/* Connected Platforms */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              Supported Platforms
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Amazon India & Flipkart</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>IKEA India, Myntra & Ajio</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                <span>Swiggy, Zomato & BigBasket</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                <span>Tanishq, CaratLane, BlueStone & Melorra</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                <span>OYO Rooms, MakeMyTrip & BookMyShow</span>
              </li>
            </ul>
          </div>

          {/* AI Architecture */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              AI Architecture
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Powered by Google Gemini 1.5 Flash / 3.8 Flash Pro multimodal model for context-aware budget allocation, outfit analysis, and live platform query generation.
            </p>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-[11px] text-slate-300">
              <div className="font-semibold text-amber-400 mb-1">Student Project Reference</div>
              <div>PocketSmart AI: Intelligent Cross-Platform Recommendation System</div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} PocketSmart AI. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with precision for smart financial lifestyle planning</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
