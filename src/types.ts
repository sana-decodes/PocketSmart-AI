export interface User {
  username: string;
  email: string;
  fullName?: string;
}

export interface HomeBudgetInput {
  total_budget: number;
  num_lights: number;
  num_fans: number;
  num_furniture: number;
  num_dining_tables: number;
  has_living_room: boolean;
  has_kitchen: boolean;
  has_bedroom: boolean;
  additional_requirements?: string;
  image_base64?: string;
  room_photo_name?: string;
  design_vibe?: string;
}

export interface PartyBudgetInput {
  total_budget: number;
  num_guests: number;
  party_type: string;
  venue_type?: string;
  needs_catering: boolean;
  needs_decoration: boolean;
  needs_entertainment: boolean;
  additional_requirements?: string;
}

export interface JewelryBudgetInput {
  total_budget: number;
  occasion: string;
  preferences?: string;
  image_base64?: string;
}

export interface BudgetItem {
  name: string;
  description: string;
  estimated_price: number;
  quantity?: number;
  search_terms?: string;
  shopping_links?: Record<string, string>;
}

export interface BudgetCategory {
  category: string;
  allocation: number;
  items: BudgetItem[];
}

export interface VenueSuggestion {
  name: string;
  type: string;
  capacity: number;
  estimated_cost: number;
  search_terms?: string;
  search_links?: Record<string, string>;
}

export interface CalculationTableRow {
  category: string;
  items_count: number;
  total_cost: number;
  percentage_of_budget: number;
}

export interface RoomAnalysis {
  detected_room_type?: string;
  current_spatial_features?: string;
  lighting_assessment?: string;
  wall_and_flooring?: string;
  curated_color_palette?: string[];
  styling_direction?: string;
}

export interface GeneratedVisualConcept {
  id: string;
  title: string;
  tag: string;
  room_type: string;
  image_url: string;
  description: string;
  transformation_notes: string[];
  integrated_products: string[];
}

export interface HomeBudgetResult {
  total_budget: number;
  remaining_budget: number;
  budget_breakdown: BudgetCategory[];
  calculation_table?: CalculationTableRow[];
  additional_suggestions: string[];
  room_analysis?: RoomAnalysis;
  uploaded_room_image?: string;
  generated_visual_concepts?: GeneratedVisualConcept[];
}

export interface PartyBudgetResult {
  total_budget: number;
  remaining_budget: number;
  budget_breakdown: BudgetCategory[];
  venue_suggestions?: VenueSuggestion[];
  calculation_table_inr?: CalculationTableRow[];
  additional_suggestions: string[];
}

export interface JewelryItem {
  item_type: string;
  description: string;
  style: string;
  estimated_price: number;
  search_terms?: string;
  shopping_links?: Record<string, string>;
}

export interface OutfitAnalysis {
  colors: string[];
  style: string;
  formality: string;
}

export interface JewelryBudgetResult {
  total_budget: number;
  remaining_budget: number;
  outfit_analysis?: OutfitAnalysis;
  jewelry_recommendations: JewelryItem[];
  styling_tips: string[];
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  type: 'home' | 'party' | 'jewelry';
  input: string;
  summary: string;
  fullResult?: any;
}

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';
export type ThemeMode = 'dark' | 'light';

export interface SavedPocketItem {
  id: string;
  name: string;
  category: string;
  source: 'home' | 'party' | 'jewelry';
  price: number;
  shoppingLinks?: Record<string, string>;
  notes?: string;
  addedAt: string;
}

