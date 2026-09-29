import React, { useState, useRef } from 'react';
import {
  Home,
  Sparkles,
  CheckCircle2,
  ShoppingBag,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Printer,
  Upload,
  Image as ImageIcon,
  Palette,
  Eye,
  Maximize2,
  X,
  Layers,
  Sliders,
  Check,
} from 'lucide-react';
import { HomeBudgetInput, HomeBudgetResult, GeneratedVisualConcept } from '../types';
import { generateHomeBudget } from '../api';
import { usePocket } from '../context/PocketContext';

interface HomePlannerPageProps {
  onNavigate: (page: string) => void;
}

const DESIGN_VIBES = [
  { id: 'Scandinavian Minimalist Warmth', label: 'Scandinavian Warmth', desc: 'Light oak, beige tones & clean lines' },
  { id: 'Modern Indian Contemporary', label: 'Modern Indian', desc: 'Brass accents, warm neutrals & teak finishes' },
  { id: 'Japandi Earthy Serenity', label: 'Japandi Serenity', desc: 'Muted textures, organic woods & zen lighting' },
  { id: 'Warm Industrial Loft', label: 'Warm Industrial', desc: 'Matte black metal, track lights & rustic oak' },
];

export const HomePlannerPage: React.FC<HomePlannerPageProps> = ({ onNavigate }) => {
  const { formatPrice, addItem, removeItem, isItemSaved, setIsBasketOpen } = usePocket();

  const [budget, setBudget] = useState<number>(35000);
  const [lights, setLights] = useState<number>(4);
  const [fans, setFans] = useState<number>(2);
  const [furniture, setFurniture] = useState<number>(2);
  const [diningTables, setDiningTables] = useState<number>(1);
  const [livingRoom, setLivingRoom] = useState<boolean>(true);
  const [kitchen, setKitchen] = useState<boolean>(false);
  const [bedroom, setBedroom] = useState<boolean>(true);
  const [requirements, setRequirements] = useState<string>('');
  const [selectedVibe, setSelectedVibe] = useState<string>(DESIGN_VIBES[0].id);

  // Photo Upload State
  const [roomImageBase64, setRoomImageBase64] = useState<string>('');
  const [roomImageName, setRoomImageName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Modal view for enlarged concept image
  const [selectedConceptModal, setSelectedConceptModal] = useState<GeneratedVisualConcept | null>(null);
  const [compareMode, setCompareMode] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<HomeBudgetResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Image size exceeds 8MB. Please select a smaller photo.');
      return;
    }
    setError(null);
    setRoomImageName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setRoomImageBase64(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUseSampleRoom = async () => {
    try {
      const sampleUrl = '/src/assets/images/room_before_sample_1790604697786.jpg';
      const res = await fetch(sampleUrl);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onload = (e) => {
        setRoomImageBase64(e.target?.result as string);
        setRoomImageName('Sample_Unfurnished_Apartment.jpg');
      };
      reader.readAsDataURL(blob);
    } catch {
      setRoomImageBase64('/src/assets/images/room_before_sample_1790604697786.jpg');
      setRoomImageName('Sample_Apartment_Room.jpg');
    }
  };

  const clearUploadedImage = () => {
    setRoomImageBase64('');
    setRoomImageName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const applyPreset = (presetBudget: number, l: number, f: number, furn: number, d: number, req: string) => {
    setBudget(presetBudget);
    setLights(l);
    setFans(f);
    setFurniture(furn);
    setDiningTables(d);
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
      image_base64: roomImageBase64,
      room_photo_name: roomImageName,
      design_vibe: selectedVibe,
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
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-[#A78BFA] border border-purple-500/30 flex items-center justify-center font-bold">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-[#F8FAFC] tracking-tight">
                  Home Interior Makeover & Budget Planner
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#7C3AED]/20 text-[#A78BFA] border border-purple-500/30">
                  AI Visual Redesign
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Upload your room photo, pick your vibe, and get photorealistic visual redesign concepts with exact Indian e-commerce links.
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
      <form onSubmit={handleSubmit} className="mb-10 print:hidden space-y-6">
        {/* Preset Tiers */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#94A3B8]">Quick Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset(15000, 4, 1, 2, 0, 'Compact studio, energy efficient LED focus')}
            className="px-2.5 py-1 rounded-lg bg-[#1E293B] border border-slate-700 hover:border-purple-400 text-[#F8FAFC] text-xs font-semibold transition-colors"
          >
            Studio Compact (₹15,000)
          </button>
          <button
            type="button"
            onClick={() => applyPreset(45000, 6, 3, 3, 1, '2BHK family flat with warm ambient lighting & durable dining table')}
            className="px-2.5 py-1 rounded-lg bg-[#1E293B] border border-slate-700 hover:border-purple-400 text-[#F8FAFC] text-xs font-semibold transition-colors"
          >
            2BHK Family (₹45,000)
          </button>
          <button
            type="button"
            onClick={() => applyPreset(120000, 10, 4, 5, 1, '3BHK premium styling, smart RGB ceiling strips, designer wooden accents')}
            className="px-2.5 py-1 rounded-lg bg-[#1E293B] border border-slate-700 hover:border-purple-400 text-[#F8FAFC] text-xs font-semibold transition-colors"
          >
            3BHK Premium (₹1,20,000)
          </button>
        </div>

        {/* Feature Section: Room Photo Upload & Style Selector */}
        <div className="bg-[#1E293B] rounded-3xl p-6 border border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-bold text-[#F8FAFC] text-sm flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#A78BFA]" />
                <span>Upload Room Photo for Multimodal Visual Makeover</span>
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Our AI model inspects your actual walls, corners, ceiling, and lighting to generate tailored photorealistic transformation renders.
              </p>
            </div>
            {!roomImageBase64 && (
              <button
                type="button"
                onClick={handleUseSampleRoom}
                className="px-3 py-1.5 rounded-xl bg-[#0F172A] border border-purple-500/40 text-[#A78BFA] text-xs font-bold hover:bg-purple-950/30 transition-all flex items-center gap-1.5 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Try Sample Room Photo</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Box / Preview */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-2">
                Your Room Photo {roomImageBase64 ? '(Uploaded)' : '(Optional)'}
              </label>

              {roomImageBase64 ? (
                <div className="relative rounded-2xl overflow-hidden border border-purple-500/50 bg-[#0F172A] group">
                  <img
                    src={roomImageBase64}
                    alt="Uploaded Room Preview"
                    className="w-full h-48 object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-3">
                    <div className="text-xs">
                      <span className="text-purple-300 font-bold block truncate max-w-[200px]">
                        {roomImageName || 'Your uploaded room'}
                      </span>
                      <span className="text-[10px] text-slate-400">Ready for visual AI generation</span>
                    </div>
                    <button
                      type="button"
                      onClick={clearUploadedImage}
                      className="px-2.5 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <X className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files?.[0]) {
                      handleFileSelect(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                    isDragging
                      ? 'border-[#7C3AED] bg-purple-950/20'
                      : 'border-slate-700 hover:border-purple-500/50 bg-[#0F172A]'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[#A78BFA]">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#F8FAFC]">
                      Click to upload or drag & drop room photo
                    </span>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">
                      JPG, PNG, or WebP up to 8MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Design Vibe Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span>Select Design Aesthetic / Vibe</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DESIGN_VIBES.map((vibe) => (
                  <button
                    key={vibe.id}
                    type="button"
                    onClick={() => setSelectedVibe(vibe.id)}
                    className={`p-3 rounded-xl border text-left transition-all relative ${
                      selectedVibe === vibe.id
                        ? 'bg-[#7C3AED]/20 border-purple-500 text-white shadow-sm'
                        : 'bg-[#0F172A] border-slate-800 text-[#94A3B8] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F8FAFC]">{vibe.label}</span>
                      {selectedVibe === vibe.id && (
                        <Check className="w-3.5 h-3.5 text-[#A78BFA]" />
                      )}
                    </div>
                    <p className="text-[10px] text-[#94A3B8] mt-1 leading-snug">{vibe.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Budget & Rooms */}
          <div className="bg-[#1E293B] rounded-3xl p-6 border border-slate-800 shadow-sm space-y-5">
            <h3 className="font-bold text-[#F8FAFC] text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
              Budget & Room Selection
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
                  min={500}
                  step={500}
                  className="w-full pl-8 pr-4 py-2.5 bg-[#0F172A] border border-slate-700 rounded-xl text-sm font-semibold text-[#F8FAFC] focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none"
                  required
                />
              </div>
              <div className="text-[11px] text-[#94A3B8] mt-1">
                Active converted display: {formatPrice(budget)}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-2">
                Rooms to Consider
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <label className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  livingRoom ? 'bg-[#7C3AED]/20 border-purple-500/50 text-[#F8FAFC]' : 'bg-[#0F172A] border-slate-700 text-[#94A3B8]'
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
                  kitchen ? 'bg-[#7C3AED]/20 border-purple-500/50 text-[#F8FAFC]' : 'bg-[#0F172A] border-slate-700 text-[#94A3B8]'
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
                  bedroom ? 'bg-[#7C3AED]/20 border-purple-500/50 text-[#F8FAFC]' : 'bg-[#0F172A] border-slate-700 text-[#94A3B8]'
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

          {/* Card 2: Fixture Requirements */}
          <div className="bg-[#1E293B] rounded-3xl p-6 border border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-[#F8FAFC] text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
              Fixture & Item Quantities
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Lighting Fixtures
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={lights}
                  onChange={(e) => setLights(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs font-semibold text-[#F8FAFC] focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Ceiling Fans
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={fans}
                  onChange={(e) => setFans(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs font-semibold text-[#F8FAFC] focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Furniture Pieces
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={furniture}
                  onChange={(e) => setFurniture(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs font-semibold text-[#F8FAFC] focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                  Dining Tables
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={diningTables}
                  onChange={(e) => setDiningTables(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs font-semibold text-[#F8FAFC] focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1">
                Additional Design Notes (Optional)
              </label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="e.g. Prefer warm LED bulbs, Scandinavian wood tones, compact dining set"
                rows={2}
                className="w-full px-3 py-2 bg-[#0F172A] border border-slate-700 rounded-xl text-xs text-[#F8FAFC] placeholder-slate-500 focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-[#7C3AED] hover:bg-[#8B5CF6] text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI Analyzing Space & Generating Makeover Concepts...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#A78BFA]" />
                <span>Generate Smart Home Allocation & AI Photos</span>
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
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-[#F8FAFC]">
                Generated Transformation & Procurement Plan
              </span>
            </div>
            <button
              onClick={() => window.print()}
              className="py-1.5 px-3 rounded-xl border border-purple-500/30 bg-[#0F172A] hover:bg-slate-800 text-[#A78BFA] text-xs font-bold flex items-center gap-1.5 print:hidden transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Procurement Plan</span>
            </button>
          </div>

          {/* AI Visual Concepts Section */}
          {result.generated_visual_concepts && result.generated_visual_concepts.length > 0 && (
            <div className="bg-[#1E293B] rounded-3xl p-6 border border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#A78BFA]" />
                    <h2 className="text-lg font-bold text-[#F8FAFC]">
                      Photorealistic AI Makeover Concepts
                    </h2>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Visualizations of your room upgraded with recommended lighting, fans, and furniture layout.
                  </p>
                </div>
                {result.uploaded_room_image && (
                  <button
                    type="button"
                    onClick={() => setCompareMode(!compareMode)}
                    className="px-3 py-1.5 rounded-xl bg-[#0F172A] border border-purple-500/40 text-[#A78BFA] text-xs font-bold hover:bg-purple-950/30 transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{compareMode ? 'Show Concepts Only' : 'Compare with Uploaded Room'}</span>
                  </button>
                )}
              </div>

              {/* Compare Mode Banner */}
              {compareMode && result.uploaded_room_image && (
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-purple-500/30 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                      Before (Uploaded Room Photo)
                    </span>
                    <img
                      src={result.uploaded_room_image}
                      alt="Uploaded Room Before"
                      className="w-full h-56 object-cover rounded-xl border border-slate-700"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
                      After (AI Interior Makeover Render)
                    </span>
                    <img
                      src={result.generated_visual_concepts[0].image_url}
                      alt="AI Makeover Render"
                      className="w-full h-56 object-cover rounded-xl border border-purple-500/50"
                    />
                  </div>
                </div>
              )}

              {/* Gallery Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {result.generated_visual_concepts.map((concept) => (
                  <div
                    key={concept.id}
                    className="bg-[#0F172A] rounded-2xl overflow-hidden border border-slate-800 hover:border-purple-500/40 transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative overflow-hidden aspect-[4/3]">
                        <img
                          src={concept.image_url}
                          alt={concept.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-purple-300 border border-purple-500/30 backdrop-blur-sm">
                            {concept.tag}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedConceptModal(concept)}
                          className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-black/70 hover:bg-black text-white text-xs backdrop-blur-sm transition-all flex items-center gap-1 opacity-90 group-hover:opacity-100"
                          title="Enlarge image"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Expand</span>
                        </button>
                      </div>

                      <div className="p-4 space-y-2.5">
                        <h4 className="font-bold text-sm text-[#F8FAFC] leading-snug">
                          {concept.title}
                        </h4>
                        <p className="text-xs text-[#94A3B8] leading-relaxed">
                          {concept.description}
                        </p>

                        <div className="pt-2 border-t border-slate-800/80">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1.5">
                            Key Transformation Highlights
                          </span>
                          <ul className="space-y-1">
                            {concept.transformation_notes.map((note, idx) => (
                              <li key={idx} className="text-[11px] text-[#94A3B8] flex items-start gap-1.5">
                                <span className="text-purple-400 font-bold shrink-0">✓</span>
                                <span>{note}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <div className="pt-2 border-t border-slate-800/80">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                          Showcased Products:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {concept.integrated_products.map((prod, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-[#1E293B] text-slate-300 px-2 py-0.5 rounded-md border border-slate-800"
                            >
                              {prod}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spatial Room Analysis Card */}
          {result.room_analysis && (
            <div className="bg-[#1E293B] rounded-3xl p-6 border border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-[#F8FAFC] text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
                <Layers className="w-4 h-4 text-[#A78BFA]" />
                <span>AI Spatial Diagnostics & Styling Blueprint</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1">
                    Detected Room Category
                  </span>
                  <div className="text-xs font-bold text-purple-300">
                    {result.room_analysis.detected_room_type || 'Multipurpose Interior'}
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-1.5 leading-snug">
                    {result.room_analysis.current_spatial_features}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1">
                    Lighting & Shadows
                  </span>
                  <p className="text-[11px] text-[#94A3B8] leading-snug">
                    {result.room_analysis.lighting_assessment}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1">
                    Wall & Floor Synergy
                  </span>
                  <p className="text-[11px] text-[#94A3B8] leading-snug">
                    {result.room_analysis.wall_and_flooring}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-1">
                    Color Palette Recommendations
                  </span>
                  <div className="flex items-center gap-1.5 my-2">
                    {result.room_analysis.curated_color_palette?.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-6 h-6 rounded-lg border border-slate-700 shadow-sm"
                        style={{ backgroundColor: color.startsWith('#') ? color : '#CBD5E1' }}
                        title={color}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {result.room_analysis.curated_color_palette?.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          )}

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
                  Allocated Expense
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

          {/* Itemized Categories */}
          <div>
            <h3 className="text-lg font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#8B5CF6]" />
              <span>Itemized Recommendations & Indian Platform Links</span>
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
                      <span className="text-xs font-bold text-[#A78BFA] bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-lg font-mono tabular-nums">
                        {formatPrice(cat.allocation)}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {cat.items?.map((item, itemIdx) => {
                        const saved = isItemSaved(item.name);
                        return (
                          <div
                            key={itemIdx}
                            className="p-3 rounded-2xl bg-[#0F172A] border border-slate-800/80 space-y-2 hover:border-purple-500/30 transition-all"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="text-xs font-bold text-[#F8FAFC] leading-snug">
                                  {item.name}
                                </h4>
                                <span className="text-[11px] text-[#94A3B8] font-mono font-bold">
                                  Qty: {item.quantity || 1} · {formatPrice(item.estimated_price)}
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
                                      source: 'home',
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

                            {/* Direct Retail Links */}
                            {item.shopping_links && (
                              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2 text-[10px]">
                                {Object.entries(item.shopping_links).map(([platform, url]) => (
                                  <a
                                    key={platform}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-[#38BDF8] hover:text-cyan-300 bg-[#1E293B] border border-slate-700/80 px-2 py-0.5 rounded-md flex items-center gap-1 hover:border-cyan-500/40 transition-colors capitalize"
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

          {/* Calculation Table */}
          {result.calculation_table && result.calculation_table.length > 0 && (
            <div className="bg-[#1E293B] rounded-3xl p-6 border border-slate-800 shadow-sm">
              <h3 className="font-bold text-[#F8FAFC] text-sm mb-4">
                Allocation Calculation Table
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0F172A] border-b border-slate-800 text-[#94A3B8] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Items Count</th>
                      <th className="py-3 px-4">Total Cost</th>
                      <th className="py-3 px-4">% of Budget</th>
                      <th className="py-3 px-4">Visual Distribution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono">
                    {result.calculation_table.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-sans font-semibold capitalize text-[#F8FAFC]">
                          {row.category.replace(/_/g, ' ')}
                        </td>
                        <td className="py-3 px-4 tabular-nums text-[#94A3B8]">{row.items_count}</td>
                        <td className="py-3 px-4 font-bold text-[#F8FAFC] tabular-nums">
                          {formatPrice(row.total_cost)}
                        </td>
                        <td className="py-3 px-4 tabular-nums text-[#A78BFA]">
                          {row.percentage_of_budget}%
                        </td>
                        <td className="py-3 px-4 w-44">
                          <div className="w-full bg-[#0F172A] h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#7C3AED] h-full rounded-full transition-all"
                              style={{ width: `${Math.min(row.percentage_of_budget, 100)}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {result.additional_suggestions && result.additional_suggestions.length > 0 && (
            <div className="bg-purple-950/20 rounded-3xl p-6 border border-purple-500/30">
              <h3 className="font-bold text-[#A78BFA] text-sm mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#A78BFA]" />
                <span>Interior Designer & Cost Optimization Tips</span>
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

      {/* Lightbox / Modal for Expanded Concept */}
      {selectedConceptModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedConceptModal(null)}
        >
          <div
            className="bg-[#1E293B] border border-slate-700 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedConceptModal.image_url}
                alt={selectedConceptModal.title}
                className="w-full max-h-[60vh] object-cover"
              />
              <button
                onClick={() => setSelectedConceptModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#7C3AED]/20 text-[#A78BFA] border border-purple-500/30">
                  {selectedConceptModal.tag}
                </span>
                <h3 className="text-xl font-bold text-[#F8FAFC] mt-2">
                  {selectedConceptModal.title}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                  {selectedConceptModal.description}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-purple-300 block mb-2">
                  Transformation Details:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedConceptModal.transformation_notes.map((note, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#0F172A] border border-slate-800 text-xs text-[#F8FAFC] flex items-start gap-2">
                      <span className="text-purple-400 font-bold shrink-0">✓</span>
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

