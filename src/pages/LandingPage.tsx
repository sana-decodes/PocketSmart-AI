import React, { useState } from 'react';
import { ArrowRight, Sparkles, Sliders } from 'lucide-react';
import { usePocket } from '../context/PocketContext';
import heroInteriorImg from '../assets/images/hero_modern_interior_1790586585904.jpg';
import partyVenueImg from '../assets/images/party_celebration_venue_1790586602131.jpg';
import jewelryCraftImg from '../assets/images/luxury_jewelry_craft_1790586615187.jpg';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { formatPrice } = usePocket();
  const [simulatedBudget, setSimulatedBudget] = useState<number>(65000);
  const [activeCategory, setActiveCategory] = useState<'home' | 'party' | 'jewelry'>('home');

  // Dynamic simulation math
  const homeAllocation = {
    lighting: Math.round(simulatedBudget * 0.22),
    fans: Math.round(simulatedBudget * 0.28),
    furniture: Math.round(simulatedBudget * 0.38),
    buffer: Math.round(simulatedBudget * 0.12),
  };

  const partyAllocation = {
    catering: Math.round(simulatedBudget * 0.45),
    venue: Math.round(simulatedBudget * 0.25),
    decor: Math.round(simulatedBudget * 0.18),
    buffer: Math.round(simulatedBudget * 0.12),
  };

  const jewelryAllocation = {
    statement: Math.round(simulatedBudget * 0.55),
    accents: Math.round(simulatedBudget * 0.32),
    buffer: Math.round(simulatedBudget * 0.13),
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0F172A] text-[#F8FAFC] pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Background Subtle Ambient Radial */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(124,58,237,0.22),rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#7c3aed_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#A78BFA] mb-4 tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span>Next-Generation Multimodal Budget Intelligence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#F8FAFC] mb-6 leading-[1.08] text-balance">
                Precision budgeting for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F8FAFC] via-[#A78BFA] to-[#7C3AED]">
                  home, events & jewelry.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl mb-8 leading-relaxed">
                PocketSmart AI eliminates financial guesswork using Google Gemini. It models realistic Indian retail pricing across IKEA, Amazon, Swiggy, and Tanishq—balancing aesthetic tastes with strict fiscal parameters.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => onNavigate('register')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#7C3AED] hover:bg-[#8B5CF6] text-[#F8FAFC] font-bold text-sm sm:text-base shadow-xl shadow-purple-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('home-planner')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1E293B] hover:bg-slate-700/60 text-[#A78BFA] font-semibold text-sm sm:text-base border border-purple-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Launch Live Planner</span>
                </button>
              </div>

              {/* Unboxed Metadata Stats */}
              <div className="mt-12 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-6 text-xs text-[#94A3B8]">
                <div>
                  <span className="text-lg font-black text-[#F8FAFC] font-mono tabular-nums block">₹5K – ₹10L+</span>
                  <span>Dynamic Range</span>
                </div>
                <span className="text-slate-700" aria-hidden="true">/</span>
                <div>
                  <span className="text-lg font-black text-[#A78BFA] font-mono tabular-nums block">8+ Platforms</span>
                  <span>Amazon, IKEA, Tanishq</span>
                </div>
                <span className="text-slate-700" aria-hidden="true">/</span>
                <div>
                  <span className="text-lg font-black text-[#38BDF8] font-mono tabular-nums block">Multimodal</span>
                  <span>Vision Outfit Matching</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-800 group">
                <img
                  src={heroInteriorImg}
                  alt="Modern Scandinavian Indian Living Room with warm lighting"
                  referrerPolicy="no-referrer"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/95 via-[#0F172A]/50 to-transparent flex flex-col justify-end p-6">
                  <span className="text-xs font-bold text-[#A78BFA] uppercase tracking-wider mb-1">
                    Scenario 1 Showcase
                  </span>
                  <h3 className="text-lg font-bold text-[#F8FAFC]">
                    Scandinavian Minimalist Interior
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    Automated cost distribution across energy-efficient BLDC fans, modular lighting, and durable dining pieces.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Budget Simulator Widget */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full -mt-8 relative z-20">
        <div className="bg-[#1E293B] rounded-3xl shadow-xl border border-slate-800 p-6 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#A78BFA] uppercase tracking-wider mb-1">
                <Sliders className="w-3.5 h-3.5" />
                <span>Interactive Live Allocation Simulator</span>
              </div>
              <h2 className="text-2xl font-black text-[#F8FAFC] tracking-tight">
                Preview Real-Time AI Resource Allocation
              </h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                Adjust your target budget to see how PocketSmart optimizes your spending distribution.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center bg-[#0F172A] p-1.5 rounded-xl border border-slate-800 shrink-0">
              <button
                onClick={() => setActiveCategory('home')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeCategory === 'home'
                    ? 'bg-[#7C3AED] text-[#F8FAFC] shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                Home Interior
              </button>
              <button
                onClick={() => setActiveCategory('party')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeCategory === 'party'
                    ? 'bg-[#7C3AED] text-[#F8FAFC] shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                Party & Event
              </button>
              <button
                onClick={() => setActiveCategory('jewelry')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeCategory === 'jewelry'
                    ? 'bg-[#7C3AED] text-[#F8FAFC] shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                Jewelry Styling
              </button>
            </div>
          </div>

          {/* Slider Control */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#94A3B8] uppercase">Target Budget</span>
              <span className="text-2xl font-black text-[#A78BFA] font-mono tabular-nums">
                {formatPrice(simulatedBudget)}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="300000"
              step="5000"
              value={simulatedBudget}
              onChange={(e) => setSimulatedBudget(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1.5">
              <span>{formatPrice(10000)}</span>
              <span>{formatPrice(150000)}</span>
              <span>{formatPrice(300000)}</span>
            </div>
          </div>

          {/* Real-time Category Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {activeCategory === 'home' && (
              <>
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800">
                  <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block">Lighting (22%)</span>
                  <span className="text-lg font-black text-[#F8FAFC] font-mono tabular-nums block mt-1">{formatPrice(homeAllocation.lighting)}</span>
                  <span className="text-[11px] text-slate-500 mt-1 block">Warm LEDs & strip kits</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800">
                  <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block">Ceiling Fans (28%)</span>
                  <span className="text-lg font-black text-[#F8FAFC] font-mono tabular-nums block mt-1">{formatPrice(homeAllocation.fans)}</span>
                  <span className="text-[11px] text-slate-500 mt-1 block">BLDC energy savers</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800">
                  <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block">Furniture (38%)</span>
                  <span className="text-lg font-black text-[#F8FAFC] font-mono tabular-nums block mt-1">{formatPrice(homeAllocation.furniture)}</span>
                  <span className="text-[11px] text-slate-500 mt-1 block">Modular tables & chairs</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                  <span className="text-[11px] font-semibold text-[#22C55E] uppercase tracking-wider block">Buffer (12%)</span>
                  <span className="text-lg font-black text-[#22C55E] font-mono tabular-nums block mt-1">{formatPrice(homeAllocation.buffer)}</span>
                  <span className="text-[11px] text-emerald-400/80 mt-1 block">Safe cushion reserve</span>
                </div>
              </>
            )}

            {activeCategory === 'party' && (
              <>
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800">
                  <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block">Catering (45%)</span>
                  <span className="text-lg font-black text-[#F8FAFC] font-mono tabular-nums block mt-1">{formatPrice(partyAllocation.catering)}</span>
                  <span className="text-[11px] text-slate-500 mt-1 block">Buffet & beverages</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800">
                  <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block">Venue (25%)</span>
                  <span className="text-lg font-black text-[#F8FAFC] font-mono tabular-nums block mt-1">{formatPrice(partyAllocation.venue)}</span>
                  <span className="text-[11px] text-slate-500 mt-1 block">Hall or terrace space</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800">
                  <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block">Decor & Sound (18%)</span>
                  <span className="text-lg font-black text-[#F8FAFC] font-mono tabular-nums block mt-1">{formatPrice(partyAllocation.decor)}</span>
                  <span className="text-[11px] text-slate-500 mt-1 block">Fairy lights & audio</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                  <span className="text-[11px] font-semibold text-[#22C55E] uppercase tracking-wider block">Buffer (12%)</span>
                  <span className="text-lg font-black text-[#22C55E] font-mono tabular-nums block mt-1">{formatPrice(partyAllocation.buffer)}</span>
                  <span className="text-[11px] text-emerald-400/80 mt-1 block">Emergency add-ons</span>
                </div>
              </>
            )}

            {activeCategory === 'jewelry' && (
              <>
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 col-span-2">
                  <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block">Hero Statement Piece (55%)</span>
                  <span className="text-lg font-black text-[#F8FAFC] font-mono tabular-nums block mt-1">{formatPrice(jewelryAllocation.statement)}</span>
                  <span className="text-[11px] text-slate-500 mt-1 block">Necklace, choker, or watch</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800">
                  <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider block">Complementary Accents (32%)</span>
                  <span className="text-lg font-black text-[#F8FAFC] font-mono tabular-nums block mt-1">{formatPrice(jewelryAllocation.accents)}</span>
                  <span className="text-[11px] text-slate-500 mt-1 block">Earrings, rings, bangles</span>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                  <span className="text-[11px] font-semibold text-[#22C55E] uppercase tracking-wider block">Buffer (13%)</span>
                  <span className="text-lg font-black text-[#22C55E] font-mono tabular-nums block mt-1">{formatPrice(jewelryAllocation.buffer)}</span>
                  <span className="text-[11px] text-emerald-400/80 mt-1 block">Making charge cushion</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* "Our Smart Budget Planners" Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-bold text-[#A78BFA] tracking-wider uppercase mb-2">
            Tailored Domain Modules
          </div>
          <h2 className="text-3xl font-black text-[#F8FAFC] tracking-tight sm:text-4xl text-balance">
            Our Smart Budget Planners
          </h2>
          <p className="mt-3 text-[#94A3B8] text-sm sm:text-base">
            Select a specialized planner. Input your budget and constraints, and watch our AI allocate every rupee with direct shopping queries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Home Interior (Purple accent #8B5CF6) */}
          <div className="bg-[#1E293B] rounded-3xl overflow-hidden shadow-sm border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between group">
            <div className="relative h-48 overflow-hidden bg-slate-900">
              <img
                src={heroInteriorImg}
                alt="Interior Design"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#0F172A]/90 backdrop-blur-xs text-[#A78BFA] text-[10px] font-bold px-2.5 py-1 rounded-lg border border-purple-500/30">
                Scenario 1 · Home
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">
                  Home Interior Budget Planner
                </h3>
                <p className="text-[#94A3B8] text-xs sm:text-sm leading-relaxed mb-4">
                  Define your budget, room selections (Living Room, Kitchen, Bedroom), and fixture counts. Gemini optimizes lighting, BLDC fans, and furniture across IKEA and Amazon India.
                </p>
                <div className="text-xs text-slate-400 space-y-1 mb-6">
                  <div>· Itemized cost breakdown with % of budget</div>
                  <div>· Pre-calibrated queries for IKEA & Flipkart</div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('home-planner')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#7C3AED] hover:bg-[#8B5CF6] text-[#F8FAFC] font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Launch Home Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Party Planner (Pink accent #EC4899) */}
          <div className="bg-[#1E293B] rounded-3xl overflow-hidden shadow-sm border border-slate-800 hover:border-pink-500/40 transition-all flex flex-col justify-between group">
            <div className="relative h-48 overflow-hidden bg-slate-900">
              <img
                src={partyVenueImg}
                alt="Celebration Venue"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#0F172A]/90 backdrop-blur-xs text-pink-400 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-pink-500/30">
                Scenario 2 · Events
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">
                  AI Party & Event Planner
                </h3>
                <p className="text-[#94A3B8] text-xs sm:text-sm leading-relaxed mb-4">
                  Organize birthdays, weddings, or corporate dinners. Allocates catering, sound, and decorations with venue capacity suggestions and direct links to Swiggy, Zomato, and OYO.
                </p>
                <div className="text-xs text-slate-400 space-y-1 mb-6">
                  <div>· Automated contingency buffer calculation</div>
                  <div>· Capacity-rated venue suggestions</div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('party-planner')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#7C3AED] hover:bg-[#8B5CF6] text-[#F8FAFC] font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Launch Party Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Jewelry Planner (Cyan accent #22D3EE) */}
          <div className="bg-[#1E293B] rounded-3xl overflow-hidden shadow-sm border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group">
            <div className="relative h-48 overflow-hidden bg-slate-900">
              <img
                src={jewelryCraftImg}
                alt="Luxury Jewelry"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#0F172A]/90 backdrop-blur-xs text-[#38BDF8] text-[10px] font-bold px-2.5 py-1 rounded-lg border border-cyan-500/30">
                Scenario 3 · Jewelry
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">
                  Jewelry Planner (Multimodal AI)
                </h3>
                <p className="text-[#94A3B8] text-xs sm:text-sm leading-relaxed mb-4">
                  Upload an outfit photo or select an occasion. Gemini's visual reasoning detects neckline cuts, fabric hues, and formality to suggest matching jewelry from Tanishq and CaratLane.
                </p>
                <div className="text-xs text-slate-400 space-y-1 mb-6">
                  <div>· Visual color & aesthetic classification</div>
                  <div>· Curated styling tips per neckline & tone</div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('jewelry-planner')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#7C3AED] hover:bg-[#8B5CF6] text-[#F8FAFC] font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Launch Jewelry Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Claim-to-Proof Adjacency Testimonials */}
      <section className="py-16 bg-[#0F172A] border-t border-slate-800/80 text-[#F8FAFC] px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#F8FAFC]">
              Proven Financial Impact Across Indian Households
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-2">
              See how verified homeowners, event planners, and shoppers optimized their budgets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#1E293B] border border-slate-800 flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-[#F8FAFC] leading-relaxed mb-4">
                "Saved ₹28,400 furnishing our 2BHK flat in Bengaluru. The combo suggestions for Crompton BLDC fans and IKEA modular tables were completely spot on."
              </p>
              <div className="pt-4 border-t border-slate-800 text-xs">
                <div className="font-bold text-[#F8FAFC]">Arjun Venkatraman</div>
                <div className="text-[#94A3B8]">Software Architect · Whitefield, Bengaluru</div>
                <div className="text-[#22C55E] font-mono font-bold mt-1">Potential Savings: 21% under estimate</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#1E293B] border border-slate-800 flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-[#F8FAFC] leading-relaxed mb-4">
                "Planned my parents' 25th anniversary dinner for 60 guests. The buffer reserve caught unexpected audio equipment costs without derailing the catering."
              </p>
              <div className="pt-4 border-t border-slate-800 text-xs">
                <div className="font-bold text-[#F8FAFC]">Pooja Deshmukh</div>
                <div className="text-[#94A3B8]">Brand Director · Pune</div>
                <div className="text-[#22C55E] font-mono font-bold mt-1">Remaining Budget: ₹4,200 preserved</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#1E293B] border border-slate-800 flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-[#F8FAFC] leading-relaxed mb-4">
                "Uploaded my reception lehenga photo. Gemini recommended emerald teardrop earrings from CaratLane that matched the zardozi border perfectly."
              </p>
              <div className="pt-4 border-t border-slate-800 text-xs">
                <div className="font-bold text-[#F8FAFC]">Sneha Agarwal</div>
                <div className="text-[#94A3B8]">Fintech Consultant · Mumbai</div>
                <div className="text-[#22C55E] font-mono font-bold mt-1">Budget Optimized: ₹45K matched</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        <div className="bg-gradient-to-tr from-[#0F172A] via-[#1E293B] to-[#7C3AED]/30 text-[#F8FAFC] rounded-3xl p-10 sm:p-14 shadow-2xl border border-purple-500/20 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 text-[#F8FAFC]">
              Start Planning Your Budget Smarter Today
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8] mb-8">
              Join thousands of smart planners who allocate their funds with AI precision. No subscriptions, no ads, 100% free.
            </p>
            <button
              onClick={() => onNavigate('register')}
              className="px-8 py-3.5 rounded-xl bg-[#7C3AED] hover:bg-[#8B5CF6] text-[#F8FAFC] font-bold text-sm sm:text-base shadow-xl shadow-purple-600/30 transition-transform active:scale-95 inline-flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
