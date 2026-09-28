import {
  User,
  HomeBudgetInput,
  HomeBudgetResult,
  PartyBudgetInput,
  PartyBudgetResult,
  JewelryBudgetInput,
  JewelryBudgetResult,
  HistoryItem,
} from './types';

export async function loginUser(username: string, password: string): Promise<{ access_token: string; user: User }> {
  const res = await fetch('/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ detail: 'Login failed' }));
    throw new Error(data.detail || 'Login failed');
  }
  return res.json();
}

export async function registerUser(username: string, email: string, password: string, fullName?: string): Promise<{ message: string }> {
  const res = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, full_name: fullName }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ detail: 'Registration failed' }));
    throw new Error(data.detail || 'Registration failed');
  }
  return res.json();
}

export async function logoutUser(): Promise<void> {
  await fetch('/logout', { method: 'POST' });
}

export async function getSessionInfo(): Promise<{ username: string; user: User; session_duration: number } | null> {
  try {
    const res = await fetch('/session-info');
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function generateHomeBudget(input: HomeBudgetInput): Promise<HomeBudgetResult> {
  const res = await fetch('/home-budget', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ detail: 'Failed to generate home budget' }));
    throw new Error(data.detail || 'Failed to generate home budget');
  }
  return res.json();
}

export async function generatePartyBudget(input: PartyBudgetInput): Promise<PartyBudgetResult> {
  const res = await fetch('/party-budget', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ detail: 'Failed to generate party budget' }));
    throw new Error(data.detail || 'Failed to generate party budget');
  }
  return res.json();
}

export async function generateJewelryBudget(input: JewelryBudgetInput): Promise<JewelryBudgetResult> {
  const res = await fetch('/jewelry-budget', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ detail: 'Failed to generate jewelry recommendations' }));
    throw new Error(data.detail || 'Failed to generate jewelry recommendations');
  }
  return res.json();
}

export async function getRecommendationHistory(): Promise<HistoryItem[]> {
  const res = await fetch('/recommendation-history');
  if (!res.ok) {
    throw new Error('Failed to fetch recommendation history');
  }
  const data = await res.json();
  return data.history || [];
}

export async function getRecommendationDetails(id: string): Promise<HistoryItem> {
  const res = await fetch(`/recommendation-details/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch recommendation details');
  }
  return res.json();
}
