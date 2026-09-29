import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyCode, SavedPocketItem, ThemeMode } from '../types';

interface PocketContextType {
  currency: CurrencyCode;
  setCurrency: (curr: CurrencyCode) => void;
  formatPrice: (amountInINR: number) => string;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  savedItems: SavedPocketItem[];
  addItem: (item: Omit<SavedPocketItem, 'id' | 'addedAt'>) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  isItemSaved: (name: string) => boolean;
  totalSavedCostINR: number;
  isBasketOpen: boolean;
  setIsBasketOpen: (open: boolean) => void;
}

const EXCHANGE_RATES: Record<CurrencyCode, { rate: number; symbol: string }> = {
  INR: { rate: 1.0, symbol: '₹' },
  USD: { rate: 1 / 83.0, symbol: '$' },
  EUR: { rate: 1 / 90.0, symbol: '€' },
  GBP: { rate: 1 / 106.0, symbol: '£' },
};

const PocketContext = createContext<PocketContextType | undefined>(undefined);

export const PocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    return (localStorage.getItem('pocketsmart_currency') as CurrencyCode) || 'INR';
  });

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('pocketsmart_theme') as ThemeMode | null;
    if (saved === 'light' || saved === 'dark') return saved;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  const [savedItems, setSavedItems] = useState<SavedPocketItem[]>(() => {
    try {
      const stored = localStorage.getItem('pocketsmart_basket');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isBasketOpen, setIsBasketOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('pocketsmart_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('pocketsmart_theme', theme);
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    }
  }, [theme]);

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    localStorage.setItem('pocketsmart_basket', JSON.stringify(savedItems));
  }, [savedItems]);

  const setCurrency = (curr: CurrencyCode) => {
    setCurrencyState(curr);
  };

  const formatPrice = (amountInINR: number): string => {
    const { rate, symbol } = EXCHANGE_RATES[currency];
    const converted = amountInINR * rate;
    if (currency === 'INR') {
      return `₹${Math.round(converted).toLocaleString('en-IN')}`;
    }
    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const addItem = (item: Omit<SavedPocketItem, 'id' | 'addedAt'>) => {
    setSavedItems((prev) => {
      if (prev.some((p) => p.name.toLowerCase() === item.name.toLowerCase())) {
        return prev;
      }
      return [
        {
          ...item,
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          addedAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });
  };

  const removeItem = (id: string) => {
    setSavedItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clearItems = () => {
    setSavedItems([]);
  };

  const isItemSaved = (name: string): boolean => {
    return savedItems.some((p) => p.name.toLowerCase() === name.toLowerCase());
  };

  const totalSavedCostINR = savedItems.reduce((acc, curr) => acc + (curr.price || 0), 0);

  return (
    <PocketContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        theme,
        setTheme,
        toggleTheme,
        savedItems,
        addItem,
        removeItem,
        clearItems,
        isItemSaved,
        totalSavedCostINR,
        isBasketOpen,
        setIsBasketOpen,
      }}
    >
      {children}
    </PocketContext.Provider>
  );
};

export const usePocket = (): PocketContextType => {
  const context = useContext(PocketContext);
  if (!context) {
    throw new Error('usePocket must be used within a PocketProvider');
  }
  return context;
};
