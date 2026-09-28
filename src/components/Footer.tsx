import React from 'react';
import { Shield } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0F172A] text-[#94A3B8] border-t border-slate-800/80 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div>
            <div className="text-[#F8FAFC] font-extrabold text-base mb-2">
              Pocket<span className="text-[#A78BFA]">Smart</span> <span className="text-xs text-[#38BDF8] font-bold">AI</span>
            </div>
            <p className="text-[#94A3B8] leading-relaxed mb-3">
              Intelligent budget planning delivering personalized spending allocations across home interiors, events, and jewelry styling with direct e-commerce search integrations.
            </p>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Shield className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>Calibrated for Indian market retail pricing</span>
            </div>
          </div>

          {/* Product Modules */}
          <div>
            <div className="text-[#F8FAFC] font-semibold uppercase tracking-wider mb-3">
              Planners
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate?.('home-planner')}
                  className="hover:text-[#A78BFA] transition-colors"
                >
                  Home Interior Budget Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('party-planner')}
                  className="hover:text-[#A78BFA] transition-colors"
                >
                  Party & Event Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('jewelry-planner')}
                  className="hover:text-[#A78BFA] transition-colors"
                >
                  Jewelry Styling Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('history')}
                  className="hover:text-[#A78BFA] transition-colors"
                >
                  Recommendation History
                </button>
              </li>
            </ul>
          </div>

          {/* Connected Platforms */}
          <div>
            <div className="text-[#F8FAFC] font-semibold uppercase tracking-wider mb-3">
              Retail Integrations
            </div>
            <ul className="space-y-1.5 text-[#94A3B8]">
              <li>Amazon India & Flipkart</li>
              <li>IKEA India & Ajio</li>
              <li>Swiggy & Zomato</li>
              <li>Tanishq, CaratLane & BlueStone</li>
              <li>OYO Rooms & MakeMyTrip</li>
            </ul>
          </div>

          {/* About */}
          <div>
            <div className="text-[#F8FAFC] font-semibold uppercase tracking-wider mb-3">
              About
            </div>
            <p className="text-[#94A3B8] leading-relaxed">
              Designed to eliminate financial guesswork and empower smart consumer decision-making. No advertisements or hidden fees.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500">
          <div>
            © {new Date().getFullYear()} PocketSmart AI. All rights reserved.
          </div>
          <div>
            Smart budget planning & cross-platform recommendations
          </div>
        </div>
      </div>
    </footer>
  );
};
