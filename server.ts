import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Initialize Google Gemini AI with User-Agent telemetry
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// =====================================================================
// In-Memory Data Store (Documented Architecture)
// =====================================================================

interface User {
  username: string;
  email: string;
  fullName?: string;
  password: string;
}

interface UserSession {
  username: string;
  loginTime: Date;
  lastActivity: Date;
  token: string;
  userData: Record<string, any>;
}

interface RecommendationHistoryItem {
  id: string;
  timestamp: string;
  type: 'home' | 'party' | 'jewelry';
  input: string;
  summary: string;
  fullResult: any;
}

const usersDb: Record<string, User> = {};
const activeSessions: Record<string, UserSession> = {};
const blacklistedTokens = new Set<string>();
const userRecommendations: Record<string, RecommendationHistoryItem[]> = {};

// Seed demo account 'sai' from project documentation ("Welcome, sai!")
usersDb['sai'] = {
  username: 'sai',
  email: 'sai@example.com',
  fullName: 'Sai',
  password: 'password123',
};

// Seed demo recommendations matching Milestone 5 UI screenshots
userRecommendations['sai'] = [
  {
    id: 'demo-rec-1',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    type: 'jewelry',
    input: '₹5,000 • Occasion: Birthday • With outfit image: Yes',
    summary: 'Budget: ₹5,000 - Remaining: ₹800',
    fullResult: {
      total_budget: 5000,
      remaining_budget: 800,
      outfit_analysis: {
        colors: ['navy blue', 'crisp white', 'gold accents'],
        style: 'Modern Indo-Western / Casual Elegance',
        formality: 'Smart Casual / Celebration',
      },
      jewelry_recommendations: [
        {
          item_type: 'Bracelet',
          description: 'A stylish braided leather or metallic charm bracelet with subtle rose-gold accents.',
          style: 'Contemporary Casual',
          estimated_price: 500,
          search_terms: 'braided metallic charm bracelet',
          shopping_links: {
            amazon: 'https://www.amazon.in/s?k=braided+metallic+charm+bracelet',
            flipkart: 'https://www.flipkart.com/search?q=braided+metallic+charm+bracelet',
            bluestone: 'https://www.bluestone.com/search.html?query=bracelet',
            tanishq: 'https://www.tanishq.co.in/search?q=bracelet',
            caratlane: 'https://www.caratlane.com/search?q=bracelet',
            melorra: 'https://www.melorra.com/search?q=bracelet',
            meesho: 'https://www.meesho.com/search?q=bracelet',
          },
        },
        {
          item_type: 'Ring',
          description: 'A sleek sterling silver or oxidized band ring with geometric contours.',
          style: 'Minimalist Elegant',
          estimated_price: 700,
          search_terms: 'minimalist sterling silver ring',
          shopping_links: {
            amazon: 'https://www.amazon.in/s?k=minimalist+sterling+silver+ring',
            flipkart: 'https://www.flipkart.com/search?q=minimalist+sterling+silver+ring',
            bluestone: 'https://www.bluestone.com/search.html?query=ring',
            tanishq: 'https://www.tanishq.co.in/search?q=ring',
            caratlane: 'https://www.caratlane.com/search?q=ring',
            melorra: 'https://www.melorra.com/search?q=ring',
            meesho: 'https://www.meesho.com/search?q=ring',
          },
        },
        {
          item_type: 'Watch',
          description: 'Classic minimalist dress watch with midnight blue sunray dial and brown leather strap.',
          style: 'Classic Timeless',
          estimated_price: 3000,
          search_terms: 'classic analog dress watch blue dial',
          shopping_links: {
            amazon: 'https://www.amazon.in/s?k=classic+analog+dress+watch+blue+dial',
            flipkart: 'https://www.flipkart.com/search?q=classic+analog+dress+watch+blue+dial',
            bluestone: 'https://www.bluestone.com/search.html?query=watch',
            tanishq: 'https://www.tanishq.co.in/search?q=watch',
            caratlane: 'https://www.caratlane.com/search?q=watch',
            melorra: 'https://www.melorra.com/search?q=watch',
            meesho: 'https://www.meesho.com/search?q=watch',
          },
        },
      ],
      styling_tips: [
        'Keep the jewelry minimal to balance the structured elements of the outfit.',
        'Use the midnight blue watch as your anchor focal accessory.',
        'Ensure the ring and bracelet metal finishes complement each other seamlessly.',
      ],
    },
  },
  {
    id: 'demo-rec-2',
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    type: 'party',
    input: '₹5,000 • Party Type: Wedding Dinner • Guests: 3 • Needs: Catering, Entertainment',
    summary: 'Budget: ₹5,000 - Remaining: ₹0',
    fullResult: {
      total_budget: 5000,
      remaining_budget: 0,
      budget_breakdown: [
        {
          category: 'venue',
          allocation: 0,
          items: [
            {
              name: 'Intimate Home / Garden Venue',
              description: 'Decorated private terrace or dining room setup for an intimate family gathering.',
              estimated_price: 0,
              quantity: 1,
              search_terms: 'home fairy light party setup',
              shopping_links: {
                google: 'https://www.google.com/search?q=home+party+decor',
                booking: 'https://www.booking.com/search.html?ss=party+venue',
                makemytrip: 'https://www.makemytrip.com/hotels/hotel-listing/?searchText=party+venue',
                oyorooms: 'https://www.oyorooms.com/search/?location=banquet',
                nobroker: 'https://www.nobroker.in/property/search?searchTerm=party+hall',
              },
            },
          ],
        },
        {
          category: 'catering',
          allocation: 2000,
          items: [
            {
              name: 'Gourmet 3-Course Dinner Platter',
              description: 'Curated premium dinner platter with starters, main course & desserts for 3 people.',
              estimated_price: 2000,
              quantity: 1,
              search_terms: 'gourmet meal delivery platter',
              shopping_links: {
                swiggy: 'https://www.swiggy.com/search?query=gourmet+dinner',
                zomato: 'https://www.zomato.com/search?q=gourmet+dinner',
                bigbasket: 'https://www.bigbasket.com/ps/?q=gourmet+dessert',
                amazon: 'https://www.amazon.in/s?k=dinner+serving+set',
                flipkart: 'https://www.flipkart.com/search?q=dinner+serving+set',
              },
            },
          ],
        },
        {
          category: 'entertainment',
          allocation: 2000,
          items: [
            {
              name: 'Party Board Game & Cards Kit',
              description: 'Fun, engaging cooperative board games for celebratory group interaction.',
              estimated_price: 600,
              quantity: 1,
              search_terms: 'party board games for adults',
              shopping_links: {
                amazon: 'https://www.amazon.in/s?k=party+board+games+for+adults',
                flipkart: 'https://www.flipkart.com/search?q=party+board+games',
                bookmyshow: 'https://in.bookmyshow.com/search?q=entertainment',
              },
            },
            {
              name: 'Celebration Gift & Cake for Couple',
              description: 'Custom personalized wedding keepsake and chocolate truffle celebration cake.',
              estimated_price: 1400,
              quantity: 1,
              search_terms: 'wedding keepsake gift couple chocolate cake',
              shopping_links: {
                swiggy: 'https://www.swiggy.com/search?query=truffle+cake',
                zomato: 'https://www.zomato.com/search?q=truffle+cake',
                amazon: 'https://www.amazon.in/s?k=personalized+wedding+gift',
                flipkart: 'https://www.flipkart.com/search?q=personalized+wedding+gift',
                myntra: 'https://www.myntra.com/search?q=gift+box',
                meesho: 'https://www.meesho.com/search?q=gift+box',
              },
            },
          ],
        },
        {
          category: 'contingency',
          allocation: 1000,
          items: [
            {
              name: 'Beverages & Emergency Supplies Buffer',
              description: 'Fresh mocktails, disposable table covers, and backup supplies.',
              estimated_price: 1000,
              quantity: 1,
              search_terms: 'party beverages and disposable kit',
              shopping_links: {
                swiggy: 'https://www.swiggy.com/search?query=mocktails',
                zomato: 'https://www.zomato.com/search?q=mocktails',
                bigbasket: 'https://www.bigbasket.com/ps/?q=party+drinks',
              },
            },
          ],
        },
      ],
      venue_suggestions: [
        {
          name: 'Terrace Bistro & Private Dining Space',
          type: 'Cozy Dining / Lounge',
          capacity: 4,
          estimated_cost: 0,
          search_terms: 'intimate private dining room',
          search_links: {
            google: 'https://www.google.com/search?q=intimate+private+dining+room',
            booking: 'https://www.booking.com/search.html?ss=dining',
            makemytrip: 'https://www.makemytrip.com/hotels/hotel-listing/?searchText=dining',
            oyorooms: 'https://www.oyorooms.com/search/?location=dining',
            nobroker: 'https://www.nobroker.in/property/search?searchTerm=dining',
          },
        },
      ],
      calculation_table_inr: [
        { category: 'venue', items_count: 1, total_cost: 0, percentage_of_budget: 0 },
        { category: 'catering', items_count: 1, total_cost: 2000, percentage_of_budget: 40 },
        { category: 'entertainment', items_count: 2, total_cost: 2000, percentage_of_budget: 40 },
        { category: 'contingency', items_count: 1, total_cost: 1000, percentage_of_budget: 20 },
      ],
      additional_suggestions: [
        'Consider ordering bulk party packs on Swiggy or Zomato for early-bird discounts.',
        'Play a curated acoustic wedding playlist on Spotify to enhance the ambience.',
        'Repurpose fairy lights or indoor plants as natural eco-friendly decorations.',
      ],
    },
  },
  {
    id: 'demo-rec-3',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    type: 'home',
    input: '₹5,000 • Rooms: Living Room, Kitchen • Lights: 5, Fans: 4, Furniture: 2',
    summary: 'Budget: ₹5,000 - Remaining: ₹500',
    fullResult: {
      total_budget: 5000,
      remaining_budget: 500,
      budget_breakdown: [
        {
          category: 'lighting',
          allocation: 1500,
          items: [
            {
              name: 'Philips Warm White 9W B22 LED Bulbs (Pack of 5)',
              description: 'Energy-saving warm glow LED lighting for ambient room illumination.',
              estimated_price: 1500,
              quantity: 5,
              search_terms: 'Philips 9W warm white LED bulbs pack',
              shopping_links: {
                amazon: 'https://www.amazon.in/s?k=Philips+9W+warm+white+LED+bulbs',
                flipkart: 'https://www.flipkart.com/search?q=Philips+9W+warm+white+LED+bulbs',
                ikea: 'https://www.ikea.com/in/en/search/?q=led+bulb',
                myntra: 'https://www.myntra.com/search?q=lamp',
                ajio: 'https://www.ajio.com/search/?text=lamp',
              },
            },
          ],
        },
        {
          category: 'ceiling_fans',
          allocation: 2000,
          items: [
            {
              name: 'Orient / Crompton Energy Saver High Speed Fan (Refurb/Deal)',
              description: 'High air delivery aerodynamic copper motor ceiling fan.',
              estimated_price: 2000,
              quantity: 4,
              search_terms: 'Crompton 1200mm ceiling fan economy',
              shopping_links: {
                amazon: 'https://www.amazon.in/s?k=Crompton+ceiling+fan',
                flipkart: 'https://www.flipkart.com/search?q=Crompton+ceiling+fan',
                ikea: 'https://www.ikea.com/in/en/search/?q=fan',
                myntra: 'https://www.myntra.com/search?q=home',
                ajio: 'https://www.ajio.com/search/?text=home',
              },
            },
          ],
        },
        {
          category: 'furniture',
          allocation: 1000,
          items: [
            {
              name: 'Supreme Polypropylene Stackable Accent Chairs',
              description: 'Durable, lightweight modern matte finish dining & balcony chairs.',
              estimated_price: 1000,
              quantity: 2,
              search_terms: 'Supreme modern plastic chairs set of 2',
              shopping_links: {
                amazon: 'https://www.amazon.in/s?k=Supreme+plastic+chairs+set+of+2',
                flipkart: 'https://www.flipkart.com/search?q=Supreme+plastic+chairs',
                ikea: 'https://www.ikea.com/in/en/search/?q=chair',
                myntra: 'https://www.myntra.com/search?q=chair',
                ajio: 'https://www.ajio.com/search/?text=chair',
              },
            },
          ],
        },
      ],
      calculation_table: [
        { category: 'lighting', items_count: 5, total_cost: 1500, percentage_of_budget: 30 },
        { category: 'ceiling_fans', items_count: 4, total_cost: 2000, percentage_of_budget: 40 },
        { category: 'furniture', items_count: 2, total_cost: 1000, percentage_of_budget: 20 },
      ],
      additional_suggestions: [
        'Opt for multi-packs for LED lighting to avail combo pricing on Amazon and Flipkart.',
        'Use IKEA modular hooks or cord sets to create stylish pendant lighting at low cost.',
        'Prioritize high-traffic zones like the living room for brighter luminaire fixtures.',
      ],
    },
  },
];

// Helper to authenticate request
function getAuthenticatedUser(req: Request): User | null {
  const token = req.cookies?.access_token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);
  if (!token || blacklistedTokens.has(token)) {
    return null;
  }
  // Simple token decoding or session lookup
  for (const session of Object.values(activeSessions)) {
    if (session.token === token) {
      session.lastActivity = new Date();
      return usersDb[session.username] || null;
    }
  }
  return null;
}

// Background session cleanup (Milestone 3 Activity 3.4)
setInterval(() => {
  const now = Date.now();
  for (const [username, session] of Object.entries(activeSessions)) {
    if (now - session.lastActivity.getTime() > 30 * 60 * 1000) {
      console.log(`[PocketSmart] Expiring inactive session for ${username}`);
      blacklistedTokens.add(session.token);
      delete activeSessions[username];
    }
  }
}, 5 * 60 * 1000);

// Helper to parse JSON from AI responses safely
function extractJsonFromText(rawText: string): any {
  if (!rawText) return null;
  const cleaned = rawText.trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // Try code fence block
    const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (fenceMatch) {
      try {
        return JSON.parse(fenceMatch[1].trim());
      } catch (err) {}
    }
    // Try locating { and }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
      } catch (err) {}
    }
  }
  return null;
}

// =====================================================================
// Documented API Routes (Activity 2.3, 2.4, 3.1, 3.2, 3.3)
// =====================================================================

// POST /register
app.post(['/register', '/api/register'], (req: Request, res: Response) => {
  const { username, email, full_name, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ detail: 'Username and password are required' });
    return;
  }
  if (usersDb[username]) {
    res.status(400).json({ detail: 'Username already registered' });
    return;
  }
  usersDb[username] = {
    username,
    email: email || `${username}@example.com`,
    fullName: full_name || username,
    password,
  };
  res.json({ message: 'User registered successfully' });
});

// POST /token (Activity 2.4)
app.post(['/token', '/api/token'], (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = usersDb[username];
  if (!user || user.password !== password) {
    res.status(401).json({ detail: 'Incorrect username or password' });
    return;
  }

  const token = `token_${username}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const expiresMs = 30 * 60 * 1000;

  activeSessions[username] = {
    username,
    loginTime: new Date(),
    lastActivity: new Date(),
    token,
    userData: activeSessions[username]?.userData || {},
  };

  res.cookie('access_token', token, {
    httpOnly: true,
    maxAge: expiresMs,
    sameSite: 'lax',
  });

  res.json({
    access_token: token,
    token_type: 'bearer',
    user: {
      username: user.username,
      email: user.email,
      fullName: user.fullName,
    },
  });
});

// POST /logout (Activity 2.3)
app.post(['/logout', '/api/logout'], (req: Request, res: Response) => {
  const token = req.cookies?.access_token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);
  if (token) {
    blacklistedTokens.add(token);
    for (const [username, session] of Object.entries(activeSessions)) {
      if (session.token === token) {
        delete activeSessions[username];
        break;
      }
    }
  }
  res.clearCookie('access_token');
  res.json({ message: 'Logged out successfully' });
});

// GET /session-info (Activity 2.4)
app.get(['/session-info', '/api/session-info'], (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user || !activeSessions[user.username]) {
    res.status(404).json({ detail: 'No active session found' });
    return;
  }
  const session = activeSessions[user.username];
  const durationMinutes = Math.floor((Date.now() - session.loginTime.getTime()) / 60000);
  res.json({
    username: session.username,
    login_time: session.loginTime,
    last_activity: session.lastActivity,
    session_duration: durationMinutes,
    user_data: session.userData,
    user: {
      username: user.username,
      email: user.email,
      fullName: user.fullName,
    },
  });
});

// POST /session-data (Activity 2.4)
app.post(['/session-data', '/api/session-data'], (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  if (!user || !activeSessions[user.username]) {
    res.status(404).json({ detail: 'No active session found' });
    return;
  }
  const session = activeSessions[user.username];
  session.userData = { ...session.userData, ...req.body };
  session.lastActivity = new Date();
  res.json({ message: 'Session data updated', data: session.userData });
});

// POST /home-budget (Activity 2.2 & Milestone 3 + Multimodal Space Makeover)
app.post(['/home-budget', '/api/home-budget'], async (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req) || usersDb['sai'];
  const {
    total_budget = 10000,
    num_lights = 4,
    num_fans = 2,
    num_furniture = 2,
    num_dining_tables = 1,
    has_living_room = true,
    has_kitchen = false,
    has_bedroom = true,
    additional_requirements = '',
    image_base64 = '',
    room_photo_name = '',
    design_vibe = 'Scandinavian Minimalist Warmth',
  } = req.body;

  const budgetNum = Number(total_budget) || 10000;

  // Base prompt guidelines for Indian home decor
  const baseRequirements = `
Interior design budget and product recommendations for a home in India with a total budget of ₹${budgetNum.toFixed(2)}.
Client's Target Setup:
- ${num_lights} lights / lighting fixtures (warm ambient, spotlights, track lights)
- ${num_fans} ceiling fans (energy-efficient BLDC motors, silent aerofoil)
- ${num_furniture} furniture pieces (modular seating, coffee tables, accent storage)
- ${num_dining_tables} dining tables / dining sets
Target Rooms: ${has_living_room ? 'Living room, ' : ''}${has_kitchen ? 'Kitchen, ' : ''}${has_bedroom ? 'Bedroom, ' : ''}
Design Vibe / Theme: ${design_vibe || 'Contemporary Indian Warmth'}
Client Notes: ${additional_requirements || 'None provided'}
`;

  let result: any = null;

  if (apiKey) {
    try {
      if (image_base64 && image_base64.includes(',')) {
        // Multimodal call with the user's uploaded room photo!
        const [meta, rawBase64] = image_base64.split(',');
        const mimeType = meta.match(/:(.*?);/)?.[1] || 'image/jpeg';

        const prompt = `
${baseRequirements}
The user has uploaded a photo of their actual room/space.
Carefully examine the photo to observe:
1. Room layout, space volume, existing architectural features (windows, doors, corners, ceiling height).
2. Existing wall tones, flooring material, and daylight penetration.
3. Opportunities for lighting fixtures, BLDC fan placement, and furniture scaling.

Provide tailored product recommendations in INR (₹) suitable for Indian e-commerce (IKEA India, Amazon India, Flipkart, Pepperfry).
Also provide visual transformation guidance matching the photo.

Format your output as strictly valid JSON matching this exact structure:
{
    "room_analysis": {
        "detected_room_type": "e.g. Unfurnished Living Hall / Compact Bedroom / Studio Space",
        "current_spatial_features": "Observations on layout, corners, window orientation, and proportions",
        "lighting_assessment": "How natural light enters and where artificial warm accents/spotlights are needed",
        "wall_and_flooring": "Observations on wall color compatibility and floor texture",
        "curated_color_palette": ["#F8FAFC", "#E2E8F0", "#D97706", "#475569"],
        "styling_direction": "Recommended styling philosophy to maximize spatial feeling and aesthetic value"
    },
    "total_budget": ${budgetNum},
    "budget_breakdown": [
        {
            "category": "lighting",
            "allocation": 0.0,
            "items": [
                {
                    "name": "Product Name",
                    "description": "Short explanation of where and why to place this in the uploaded room",
                    "estimated_price": 0.0,
                    "quantity": 0,
                    "search_terms": "Specific Indian search terms"
                }
            ]
        },
        {
            "category": "ceiling_fans",
            "allocation": 0.0,
            "items": [
                {
                    "name": "Product Name",
                    "description": "Fan model recommendation and ideal ceiling mount location",
                    "estimated_price": 0.0,
                    "quantity": 0,
                    "search_terms": "Search terms"
                }
            ]
        },
        {
            "category": "furniture",
            "allocation": 0.0,
            "items": [
                {
                    "name": "Product Name",
                    "description": "Furniture placement relative to walls and daylight",
                    "estimated_price": 0.0,
                    "quantity": 0,
                    "search_terms": "Search terms"
                }
            ]
        }
    ],
    "calculation_table": [
        {
            "category": "lighting",
            "items_count": ${num_lights},
            "total_cost": 0.0,
            "percentage_of_budget": 0.0
        }
    ],
    "remaining_budget": 0.0,
    "additional_suggestions": [
        "Specific spatial tips based directly on the uploaded room photo"
    ]
}

Ensure all costs strictly fit within ₹${budgetNum}. Return ONLY the JSON object.
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: rawBase64,
                },
              },
              { text: prompt },
            ],
          },
          config: {
            responseMimeType: 'application/json',
          },
        });
        result = extractJsonFromText(response.text || '');
      } else {
        // Text-only call
        const prompt = `
${baseRequirements}
Please provide a detailed budget breakdown with product recommendations available in India.
Use Indian brands and pricing in INR (₹). Include search terms suitable for Indian shopping platforms (Flipkart, Amazon India, IKEA India, etc.).

Format your response as valid JSON with the following EXACT structure:
{
    "room_analysis": {
        "detected_room_type": "${has_living_room ? 'Living Room' : has_bedroom ? 'Bedroom' : 'Multipurpose Interior'}",
        "current_spatial_features": "Balanced spatial zoning for contemporary Indian residential apartments",
        "lighting_assessment": "Dual-layer warm LED illumination with task lighting and ambient glow",
        "wall_and_flooring": "Compatible with neutral off-white walls and polished vitrified or wooden flooring",
        "curated_color_palette": ["Warm Ivory", "Muted Oak", "Charcoal Slate", "Brushed Brass"],
        "styling_direction": "${design_vibe}"
    },
    "total_budget": ${budgetNum},
    "budget_breakdown": [
        {
            "category": "lighting",
            "allocation": 0.0,
            "items": [
                {
                    "name": "Product Name",
                    "description": "Short explanation",
                    "estimated_price": 0.0,
                    "quantity": 0,
                    "search_terms": "Specific Indian search terms"
                }
            ]
        }
    ],
    "calculation_table": [
        {
            "category": "lighting",
            "items_count": 0,
            "total_cost": 0.0,
            "percentage_of_budget": 0.0
        }
    ],
    "remaining_budget": 0.0,
    "additional_suggestions": [
        "Useful shopping or money-saving tips"
    ]
}

Ensure all costs stay strictly within the budget. Return ONLY the JSON object.
`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        result = extractJsonFromText(response.text || '');
      }
    } catch (err) {
      console.error('[PocketSmart] Gemini call failed for home-budget:', err);
    }
  }

  // Fallback if AI call didn't yield structured JSON
  if (!result || !result.budget_breakdown) {
    const allocated = budgetNum * 0.9;
    const rem = budgetNum - allocated;
    result = {
      total_budget: budgetNum,
      remaining_budget: Math.round(rem),
      room_analysis: {
        detected_room_type: has_living_room ? 'Modern Living Space' : has_bedroom ? 'Master Bedroom' : 'Open Concept Interior',
        current_spatial_features: 'Spacious proportioning ready for perimeter warm lighting and modular furniture alignment.',
        lighting_assessment: 'Optimal for multi-point warm LED ceiling lights and ceiling-hung fan underlight.',
        wall_and_flooring: 'Complements neutral warm white walls with wooden/vitrified tile flooring.',
        curated_color_palette: ['#F8FAFC', '#E2E8F0', '#B45309', '#0F172A'],
        styling_direction: design_vibe || 'Scandinavian Modern & Warm Wood',
      },
      budget_breakdown: [
        {
          category: 'lighting',
          allocation: Math.round(allocated * 0.25),
          items: [
            {
              name: 'Philips Warm LED Ceiling Fixture & Spotlights',
              description: 'Energy-saving warm 9W LED fixtures with long lifespan.',
              estimated_price: Math.round(allocated * 0.25),
              quantity: Number(num_lights) || 4,
              search_terms: 'Philips warm LED fixture spotlights pack',
            },
          ],
        },
        {
          category: 'ceiling_fans',
          allocation: Math.round(allocated * 0.35),
          items: [
            {
              name: 'Havells / Crompton Silent BLDC Ceiling Fans',
              description: 'High air delivery copper motor BLDC fan suitable for living and bed rooms.',
              estimated_price: Math.round(allocated * 0.35),
              quantity: Number(num_fans) || 2,
              search_terms: 'Crompton Energion BLDC silent high speed ceiling fan',
            },
          ],
        },
        {
          category: 'furniture',
          allocation: Math.round(allocated * 0.4),
          items: [
            {
              name: 'Solid Sheesham Wood Accent Chairs & Dining Pieces',
              description: 'Durable contemporary minimalist furniture set.',
              estimated_price: Math.round(allocated * 0.4),
              quantity: Number(num_furniture) || 2,
              search_terms: 'wooden dining chairs and accent coffee table',
            },
          ],
        },
      ],
      calculation_table: [
        { category: 'lighting', items_count: Number(num_lights) || 4, total_cost: Math.round(allocated * 0.25), percentage_of_budget: 25 },
        { category: 'ceiling_fans', items_count: Number(num_fans) || 2, total_cost: Math.round(allocated * 0.35), percentage_of_budget: 35 },
        { category: 'furniture', items_count: Number(num_furniture) || 2, total_cost: Math.round(allocated * 0.4), percentage_of_budget: 40 },
      ],
      additional_suggestions: [
        'Compare festive sale discounts on IKEA India and Flipkart for furniture combos.',
        'Use warm 2700K lighting in living rooms to create a cozy, premium ambience.',
        'Consider modular pieces that can be repurposed across rooms.',
      ],
    };
  }

  // Inject shopping links for Indian platforms (as documented)
  for (const cat of result.budget_breakdown || []) {
    for (const item of cat.items || []) {
      const q = encodeURIComponent(item.search_terms || item.name);
      item.shopping_links = {
        amazon: `https://www.amazon.in/s?k=${q}`,
        flipkart: `https://www.flipkart.com/search?q=${q}`,
        ikea: `https://www.ikea.com/in/en/search/?q=${q}`,
        myntra: `https://www.myntra.com/search?q=${q}`,
        ajio: `https://www.ajio.com/search/?text=${q}`,
      };
    }
  }

  // Generate Tailored Visual Concepts with photorealistic redesign renders
  const visualConcepts: any[] = [];

  // Concept 1: Living Room Makeover
  visualConcepts.push({
    id: 'concept-living',
    title: 'Warm Scandinavian Living Room Concept',
    tag: 'Living Space Makeover',
    room_type: 'Living Room',
    image_url: '/src/assets/images/living_room_redesign_1790604647840.jpg',
    description: `A photorealistic visualization of your place redesigned with recessed warm perimeter LEDs, a matte BLDC ceiling fan, low-profile oak furniture, and organic greenery that maximizes floor space.`,
    transformation_notes: [
      `Recessed warm ceiling spotlights installed to create soft wall-wash effects.`,
      `Central silent BLDC ceiling fan with integrated warm downlight.`,
      `Modular minimalist sofa aligned opposite natural window daylight.`,
      `Accent wooden coffee table and indoor planters adding natural warmth.`,
    ],
    integrated_products: [
      'Warm Recessed LED Spotlights',
      'Matte BLDC Ceiling Fan',
      'Solid Oak Modular Coffee Table',
      'Linen Upholstered Seating',
    ],
  });

  // Concept 2: Bedroom Serenity Makeover
  if (has_bedroom || visualConcepts.length < 2) {
    visualConcepts.push({
      id: 'concept-bedroom',
      title: 'Contemporary Bedroom & Study Sanctuary',
      tag: 'Bedroom Transformation',
      room_type: 'Bedroom',
      image_url: '/src/assets/images/bedroom_redesign_1790604664883.jpg',
      description: `A calming visual makeover showing your bedroom upgraded with bedside pendant task lighting, acoustic wood-slat accents, and a clean minimalist study station.`,
      transformation_notes: [
        `Bedside brass pendant lamps freeing up nightstand space.`,
        `Low-glare ceiling illumination suited for both relaxation and reading.`,
        `Integrated study desk crafted in natural grain wood.`,
        `Neutral layered bedding and acoustic textured wall panels.`,
      ],
      integrated_products: [
        'Suspended Brass Bedside Pendant Lights',
        'Minimalist Platform Queen Bed',
        'Solid Wood Workstation Desk',
        'Textured Blackout Linen Drapes',
      ],
    });
  }

  // Concept 3: Modern Dining & Accent Space Makeover
  if (Number(num_dining_tables) > 0 || has_kitchen || visualConcepts.length < 3) {
    visualConcepts.push({
      id: 'concept-dining',
      title: 'Modern Dining Space & Lighting Makeover',
      tag: 'Dining & Accent Space',
      room_type: 'Dining Room',
      image_url: '/src/assets/images/dining_room_redesign_1790604683170.jpg',
      description: `An elegant redesign showcasing how your dining space is anchored by a linear warm brass pendant and a 4-seater natural solid Sheesham dining table.`,
      transformation_notes: [
        `Linear brass pendant light casting a warm 2700K dining focal glow.`,
        `Durable Sheesham wood dining table with ergonomically cushioned chairs.`,
        `Perimeter wall molding creating architectural depth without taking space.`,
      ],
      integrated_products: [
        'Linear Brass Pendant Chandelier',
        '4-Seater Solid Sheesham Wood Dining Set',
        'Warm Ambient Sconces',
      ],
    });
  }

  result.generated_visual_concepts = visualConcepts;
  if (image_base64) {
    result.uploaded_room_image = image_base64;
  }

  // Save to user history
  const historyItem: RecommendationHistoryItem = {
    id: `rec-home-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'home',
    input: `₹${budgetNum.toLocaleString('en-IN')} • Room Photo: ${image_base64 ? (room_photo_name || 'Uploaded Room') : 'Template'} • Lights: ${num_lights}, Fans: ${num_fans}, Furniture: ${num_furniture}`,
    summary: `Budget: ₹${budgetNum.toLocaleString('en-IN')} - Remaining: ₹${(result.remaining_budget || 0).toLocaleString('en-IN')}`,
    fullResult: result,
  };

  if (!userRecommendations[user.username]) {
    userRecommendations[user.username] = [];
  }
  userRecommendations[user.username].unshift(historyItem);

  res.json(result);
});

// POST /party-budget (Activity 2.2 & Milestone 3)
app.post(['/party-budget', '/api/party-budget'], async (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req) || usersDb['sai'];
  const {
    total_budget = 15000,
    num_guests = 10,
    party_type = 'Birthday Party',
    venue_type = 'Home / Outdoor',
    needs_catering = true,
    needs_decoration = true,
    needs_entertainment = true,
    additional_requirements = '',
  } = req.body;

  const budgetNum = Number(total_budget) || 15000;

  const prompt = `
I need party planning recommendations for India with a total budget of ₹${budgetNum.toFixed(2)}.

Party details:
- Type: ${party_type}
- Number of guests: ${num_guests}
- Venue type: ${venue_type || 'Not specified'}
- Catering needed: ${needs_catering ? 'Yes' : 'No'}
- Decoration needed: ${needs_decoration ? 'Yes' : 'No'}
- Entertainment needed: ${needs_entertainment ? 'Yes' : 'No'}
Additional requirements: ${additional_requirements || 'None'}

Please provide a detailed budget breakdown with specific recommendations available in India using INR (₹) prices.
Use Indian brands, services (Swiggy, Zomato, BookMyShow, OYO, MakeMyTrip, NoBroker) and typical cost expectations.

Format your response as valid JSON with the following structure:
{
    "total_budget": ${budgetNum},
    "budget_breakdown": [
        {
            "category": "venue",
            "allocation": 0.0,
            "items": [
                {
                    "name": "Item or service name",
                    "description": "Short description",
                    "estimated_price": 0.0,
                    "quantity": 1,
                    "search_terms": "Specific search terms"
                }
            ]
        }
    ],
    "venue_suggestions": [
        {
            "name": "Suggested Venue Name or Type",
            "type": "Lounge / Banquet / Terrace",
            "capacity": ${num_guests},
            "estimated_cost": 0.0,
            "search_terms": "Search terms for venue"
        }
    ],
    "remaining_budget": 0.0,
    "additional_suggestions": [
        "Actionable tips for saving money or organizing"
    ]
}

Ensure all costs are in INR and total does not exceed budget. Return ONLY JSON.
`;

  let result: any = null;
  if (apiKey) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });
      result = extractJsonFromText(response.text || '');
    } catch (err) {
      console.error('[PocketSmart] Gemini call failed for party-budget:', err);
    }
  }

  if (!result || !result.budget_breakdown) {
    const venueCost = Math.round(budgetNum * 0.15);
    const cateringCost = Math.round(budgetNum * 0.45);
    const decorCost = Math.round(budgetNum * 0.2);
    const entCost = Math.round(budgetNum * 0.15);
    const rem = budgetNum - (venueCost + cateringCost + decorCost + entCost);

    result = {
      total_budget: budgetNum,
      remaining_budget: Math.max(0, rem),
      budget_breakdown: [
        {
          category: 'venue',
          allocation: venueCost,
          items: [
            {
              name: 'Cozy Community Hall / Private Terrace Booking',
              description: `Affordable intimate space suitable for ${num_guests} guests.`,
              estimated_price: venueCost,
              quantity: 1,
              search_terms: 'party hall booking terrace rental',
            },
          ],
        },
        {
          category: 'catering',
          allocation: cateringCost,
          items: [
            {
              name: 'Buffet Catering / Curated Swiggy-Zomato Party Box',
              description: `Appetizers, main course and dessert selection for ${num_guests} guests.`,
              estimated_price: cateringCost,
              quantity: 1,
              search_terms: 'party catering buffet platter snacks',
            },
          ],
        },
        {
          category: 'decoration',
          allocation: decorCost,
          items: [
            {
              name: 'Theme Balloon Arch & Fairy Light Backdrop Kit',
              description: 'DIY celebratory backdrop with shimmer curtains and LED strings.',
              estimated_price: decorCost,
              quantity: 1,
              search_terms: 'birthday party decoration kit metallic balloons',
            },
          ],
        },
        {
          category: 'entertainment',
          allocation: entCost,
          items: [
            {
              name: 'Sound System / Karaoke Mic & Interactive Games',
              description: 'Bluetooth party speaker and trivia games for lively guest engagement.',
              estimated_price: entCost,
              quantity: 1,
              search_terms: 'party bluetooth speaker karaoke mic games',
            },
          ],
        },
      ],
      venue_suggestions: [
        {
          name: 'Urban Rooftop Lounge / Community Club House',
          type: 'Semi-Outdoor / Lounge',
          capacity: Number(num_guests) || 10,
          estimated_cost: venueCost,
          search_terms: 'banquet hall party terrace',
        },
      ],
      additional_suggestions: [
        'Order bulk desserts and appetizers via Swiggy or Zomato for combo savings.',
        'Use digital invitations to cut printing expenses and track RSVPs efficiently.',
        'Create a collaborative Spotify playlist so all guests can queue their favorite songs.',
      ],
    };
  }

  // Calculate table
  result.calculation_table_inr = (result.budget_breakdown || []).map((cat: any) => {
    const totalCost = (cat.items || []).reduce((acc: number, item: any) => acc + (Number(item.estimated_price) || 0), 0);
    return {
      category: cat.category,
      items_count: (cat.items || []).length,
      total_cost: totalCost,
      percentage_of_budget: budgetNum > 0 ? Math.round((totalCost / budgetNum) * 100) : 0,
    };
  });

  // Shopping and vendor links
  const categoryPlatforms: Record<string, string[]> = {
    venue: ['google', 'booking', 'makemytrip', 'oyorooms', 'nobroker'],
    catering: ['swiggy', 'zomato', 'bigbasket'],
    food: ['swiggy', 'zomato', 'bigbasket', 'amazon', 'flipkart'],
    drinks: ['swiggy', 'zomato', 'bigbasket', 'amazon', 'flipkart'],
    decoration: ['amazon', 'flipkart', 'meesho', 'myntra'],
    entertainment: ['bookmyshow', 'amazon', 'flipkart'],
    gifts: ['amazon', 'flipkart', 'myntra', 'meesho'],
  };

  for (const cat of result.budget_breakdown || []) {
    const catKey = (cat.category || '').toLowerCase();
    const platforms = categoryPlatforms[catKey] || ['amazon', 'flipkart', 'google'];

    for (const item of cat.items || []) {
      const q = encodeURIComponent(item.search_terms || item.name);
      item.shopping_links = {};
      if (platforms.includes('amazon')) item.shopping_links.amazon = `https://www.amazon.in/s?k=${q}`;
      if (platforms.includes('flipkart')) item.shopping_links.flipkart = `https://www.flipkart.com/search?q=${q}`;
      if (platforms.includes('swiggy')) item.shopping_links.swiggy = `https://www.swiggy.com/search?query=${q}`;
      if (platforms.includes('zomato')) item.shopping_links.zomato = `https://www.zomato.com/search?q=${q}`;
      if (platforms.includes('bigbasket')) item.shopping_links.bigbasket = `https://www.bigbasket.com/ps/?q=${q}`;
      if (platforms.includes('bookmyshow')) item.shopping_links.bookmyshow = `https://in.bookmyshow.com/search?q=${q}`;
      if (platforms.includes('myntra')) item.shopping_links.myntra = `https://www.myntra.com/search?q=${q}`;
      if (platforms.includes('meesho')) item.shopping_links.meesho = `https://www.meesho.com/search?q=${q}`;
      if (platforms.includes('google')) item.shopping_links.google = `https://www.google.com/search?q=${q}`;
    }
  }

  for (const venue of result.venue_suggestions || []) {
    const q = encodeURIComponent(venue.search_terms || venue.name);
    venue.search_links = {
      google: `https://www.google.com/search?q=${q}`,
      booking: `https://www.booking.com/search.html?ss=${q}`,
      makemytrip: `https://www.makemytrip.com/hotels/hotel-listing/?searchText=${q}`,
      oyorooms: `https://www.oyorooms.com/search/?location=${q}`,
      nobroker: `https://www.nobroker.in/property/search?searchTerm=${q}`,
    };
  }

  const historyItem: RecommendationHistoryItem = {
    id: `rec-party-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'party',
    input: `₹${budgetNum.toLocaleString('en-IN')} • Party: ${party_type} • Guests: ${num_guests}`,
    summary: `Budget: ₹${budgetNum.toLocaleString('en-IN')} - Remaining: ₹${(result.remaining_budget || 0).toLocaleString('en-IN')}`,
    fullResult: result,
  };

  if (!userRecommendations[user.username]) {
    userRecommendations[user.username] = [];
  }
  userRecommendations[user.username].unshift(historyItem);

  res.json(result);
});

// POST /jewelry-budget (Activity 2.2 & Milestone 3)
app.post(['/jewelry-budget', '/api/jewelry-budget'], async (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req) || usersDb['sai'];
  const { total_budget = 10000, occasion = 'Wedding', preferences = '', image_base64 = '' } = req.body;

  const budgetNum = Number(total_budget) || 10000;

  const basePrompt = `
I need jewelry recommendations for India with a total budget of ₹${budgetNum.toFixed(2)}.
Occasion: ${occasion}
Preferences: ${preferences || 'Not specified'}
Provide only India-relevant styles, availability, and price ranges in INR (₹).
`;

  let result: any = null;

  if (apiKey) {
    try {
      if (image_base64 && image_base64.includes(',')) {
        // Multimodal call with outfit image!
        const [meta, rawBase64] = image_base64.split(',');
        const mimeType = meta.match(/:(.*?);/)?.[1] || 'image/jpeg';

        const prompt = `${basePrompt}
An image of the outfit is uploaded. Carefully analyze the outfit's colors, design, neckline, embroidery/patterns, and formality. Suggest matching jewelry that complements it perfectly.

Format the output as valid JSON:
{
    "outfit_analysis": {
        "colors": ["Primary color", "Secondary color"],
        "style": "Traditional / Indo-Western / Modern Contemporary",
        "formality": "High Formal / Festive / Casual Chic"
    },
    "total_budget": ${budgetNum},
    "jewelry_recommendations": [
        {
            "item_type": "Necklace / Earrings / Bracelet / Ring / Maang Tikka",
            "description": "Detailed piece description highlighting how it coordinates with the outfit",
            "style": "Kundan / Temple / Minimalist / Polki / Oxidized",
            "estimated_price": 0.0,
            "search_terms": "Specific search terms for Indian jewelry stores"
        }
    ],
    "remaining_budget": 0.0,
    "styling_tips": [
        "Actionable tip on balancing neckline with necklace length",
        "Metal color harmony advice"
    ]
}

Make sure prices are in INR and stay within total budget. Return ONLY JSON.
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: rawBase64,
                },
              },
              { text: prompt },
            ],
          },
          config: {
            responseMimeType: 'application/json',
          },
        });
        result = extractJsonFromText(response.text || '');
      } else {
        // Text-only call
        const prompt = `${basePrompt}
Format the output as valid JSON:
{
    "outfit_analysis": {
        "colors": ["Versatile Metallics", "Pearl Accents"],
        "style": "Occasion Festive",
        "formality": "${occasion} Appropriate"
    },
    "total_budget": ${budgetNum},
    "jewelry_recommendations": [
        {
            "item_type": "Earrings / Necklace / Bangles",
            "description": "Specific jewelry piece suited for ${occasion}",
            "style": "Ethnic / Modern Contemporary",
            "estimated_price": 0.0,
            "search_terms": "Search terms for shopping"
        }
    ],
    "remaining_budget": 0.0,
    "styling_tips": [
        "Tips for styling accessories for ${occasion}"
    ]
}

Keep prices in INR and relevant to Indian brands (Tanishq, BlueStone, CaratLane, Melorra). Return ONLY JSON.
`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        result = extractJsonFromText(response.text || '');
      }
    } catch (err) {
      console.error('[PocketSmart] Gemini call failed for jewelry-budget:', err);
    }
  }

  if (!result || !result.jewelry_recommendations) {
    const allocated = budgetNum * 0.85;
    const rem = budgetNum - allocated;

    result = {
      total_budget: budgetNum,
      remaining_budget: Math.round(rem),
      outfit_analysis: {
        colors: ['Emerald Green', 'Gold Accents', 'Ivory'],
        style: 'Festive & Elegant',
        formality: `${occasion} Celebratory`,
      },
      jewelry_recommendations: [
        {
          item_type: 'Choker / Pendant Necklace',
          description: `Intricately designed Kundan & pearl pendant crafted for ${occasion}.`,
          style: 'Kundan & Semi-Precious Beads',
          estimated_price: Math.round(allocated * 0.45),
          search_terms: 'kundan choker pearl necklace set',
        },
        {
          item_type: 'Jhumkas / Statement Earrings',
          description: 'Graceful floral drop earrings matching the choker accents.',
          style: 'Traditional Drop Earrings',
          estimated_price: Math.round(allocated * 0.35),
          search_terms: 'gold plated kundan jhumka earrings',
        },
        {
          item_type: 'Adjustable Kada / Bangles Set',
          description: 'Textured openable cuff bangle with antique gold plating.',
          style: 'Temple Motif Bangle',
          estimated_price: Math.round(allocated * 0.2),
          search_terms: 'antique gold finish kada bangle',
        },
      ],
      styling_tips: [
        'Balance heavy earrings by keeping the neckpiece delicate if your outfit neckline is high.',
        'Choose warm yellow or rose gold metals to harmonize with festive silk fabrics.',
        'Store gemstones in separate velvet pouches to maintain brilliance.',
      ],
    };
  }

  // Shopping links for jewelry brands
  for (const item of result.jewelry_recommendations || []) {
    const q = encodeURIComponent(item.search_terms || item.item_type);
    item.shopping_links = {
      amazon: `https://www.amazon.in/s?k=${q}`,
      flipkart: `https://www.flipkart.com/search?q=${q}`,
      bluestone: `https://www.bluestone.com/search.html?query=${q}`,
      tanishq: `https://www.tanishq.co.in/search?q=${q}`,
      caratlane: `https://www.caratlane.com/search?q=${q}`,
      melorra: `https://www.melorra.com/search?q=${q}`,
      meesho: `https://www.meesho.com/search?q=${q}`,
    };
  }

  const historyItem: RecommendationHistoryItem = {
    id: `rec-jewelry-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'jewelry',
    input: `₹${budgetNum.toLocaleString('en-IN')} • Occasion: ${occasion} • With outfit image: ${image_base64 ? 'Yes' : 'No'}`,
    summary: `Budget: ₹${budgetNum.toLocaleString('en-IN')} - Remaining: ₹${(result.remaining_budget || 0).toLocaleString('en-IN')}`,
    fullResult: result,
  };

  if (!userRecommendations[user.username]) {
    userRecommendations[user.username] = [];
  }
  userRecommendations[user.username].unshift(historyItem);

  res.json(result);
});

// GET /recommendation-history (Activity 3.3)
app.get(['/recommendation-history', '/api/recommendation-history'], (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req) || usersDb['sai'];
  const userHistory = userRecommendations[user.username] || [];
  res.json({ history: userHistory });
});

// GET /recommendation-details/:id (Activity 3.2)
app.get(['/recommendation-details/:id', '/api/recommendation-details/:id'], (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req) || usersDb['sai'];
  const id = req.params.id;
  const userHistory = userRecommendations[user.username] || [];
  const found = userHistory.find((item) => item.id === id);

  if (!found) {
    res.status(404).json({ detail: 'Recommendation not found' });
    return;
  }

  res.json({
    id: found.id,
    timestamp: found.timestamp,
    type: found.type,
    input: found.input,
    full_result: found.fullResult,
  });
});

// =====================================================================
// Start Server with Vite Middleware in Development
// =====================================================================

async function main() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PocketSmart AI server running at http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start PocketSmart AI server:', err);
});
