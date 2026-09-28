import React from 'react';
import { Home, PartyPopper, Gem, ArrowRight, CheckCircle2, Star, Sparkles, TrendingDown, ShieldCheck, Zap } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Next-Gen GenAI Budget Assistant</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            AI-Powered Budget Planning for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
              Everyday Needs
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            PocketSmart AI bridges multiple e-commerce ecosystems—from IKEA and Amazon to Swiggy, Zomato, and Tanishq—delivering personalized, budget-conscious recommendations for home decor, celebrations, and occasion styling.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('register')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-400/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-white font-semibold text-sm sm:text-base border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Demo Dashboard</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="mt-14 pt-8 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-black text-amber-400">₹10K - ₹5L+</div>
              <div className="text-xs text-slate-400 mt-0.5">Flexible Budgets in INR</div>
            </div>
            <div>
              <div className="text-2xl font-black text-blue-400">10+ Stores</div>
              <div className="text-xs text-slate-400 mt-0.5">IKEA, Amazon, Swiggy, Tanishq</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">Gemini AI</div>
              <div className="text-xs text-slate-400 mt-0.5">Multimodal Outfit & Space Logic</div>
            </div>
            <div>
              <div className="text-2xl font-black text-purple-400">100% Free</div>
              <div className="text-xs text-slate-400 mt-0.5">Student & Everyday Planner</div>
            </div>
          </div>
        </div>
      </section>

      {/* "Our Smart Budget Planners" Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-2">
            Tailored Domain Modules
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Our Smart Budget Planners
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Select a specialized planner. Enter your budget and constraints, and watch our AI allocate every rupee with curated vendor links.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Home Interior */}
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200/80 hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Home className="w-7 h-7" />
              </div>
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                Scenario 1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Home Interior Budget Planner
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Define your total budget, room types (Living Room, Kitchen, Bedroom), and fixture counts for lights, ceiling fans, and dining sets. Gemini allocates items across IKEA, Amazon, and Flipkart.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Itemized cost breakdown with percentage of budget</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Instant search query links for Indian platforms</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('home-planner')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Launch Home Planner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Party Planner */}
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200/80 hover:shadow-xl hover:border-orange-300 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <PartyPopper className="w-7 h-7" />
              </div>
              <div className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-1">
                Scenario 2
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                AI Party & Event Planner
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Input your event type (birthday, corporate, wedding dinner), guest count, and venue requirements. The AI allocates funds across catering, decor, and entertainment from Swiggy, Zomato, and OYO.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500" />
                  <span>Venue capacity & cost estimation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500" />
                  <span>Contingency reserves & printable plan format</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('party-planner')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-orange-600 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Launch Party Planner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Jewelry Planner */}
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200/80 hover:shadow-xl hover:border-pink-300 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Gem className="w-7 h-7" />
              </div>
              <div className="text-xs font-bold text-pink-700 uppercase tracking-wider mb-1">
                Scenario 3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Jewelry Budget & Outfit Stylist
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Enter your occasion and budget, with an optional outfit photo upload. Gemini analyzes neckline, colors, and formality to suggest matching jewelry from Tanishq, CaratLane, and BlueStone.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pink-500" />
                  <span>Multimodal AI dress & palette analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pink-500" />
                  <span>Occasion styling tips & price tags in INR</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('jewelry-planner')}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-pink-600 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Launch Jewelry Planner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section ("What Our Users Say") */}
      <section className="bg-slate-100/80 py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-2">
              Verified Real-World Testing
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Real reviews and success stories demonstrating how PocketSmart AI eliminates financial guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm italic leading-relaxed mb-6">
                  "Saved me ₹12,000 on my 2BHK living room revamp! The IKEA and Amazon product matching was spot-on with my budget, and the lighting breakdown made installation straightforward."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm">
                  SK
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Sarah K.</div>
                  <div className="text-slate-500 text-xs">Bangalore • Home Interior Planner</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm italic leading-relaxed mb-6">
                  "Organized my sister's birthday dinner without any financial guesswork. The Swiggy and Zomato allocations were perfect, and the contingency reserve saved us when extra guests arrived."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-sm">
                  MR
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Michael R.</div>
                  <div className="text-slate-500 text-xs">Mumbai • AI Party Planner</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm italic leading-relaxed mb-6">
                  "I uploaded a photo of my wedding reception lehenga and PocketSmart recommended the most stunning Kundan set within ₹15,000. The color coordination was remarkable!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-700 font-bold flex items-center justify-center text-sm">
                  PM
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Priya M.</div>
                  <div className="text-slate-500 text-xs">Delhi • Jewelry Budget Planner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Ready to Plan Smarter with AI?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base mb-8">
              Experience intelligent budget optimization across home, events, and accessories. Start planning in seconds.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('register')}
                className="px-8 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md transition-colors"
              >
                Create Free Account
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm border border-slate-700 transition-colors"
              >
                Sign In with Demo
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
