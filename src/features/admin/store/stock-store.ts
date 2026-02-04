import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface StockHistoryEntry {
  id: string;
  productId: string;
  productName: string;
  previousStock: number;
  newStock: number;
  reason?: string;
  createdAt: string;
}

interface StockStore {
  history: StockHistoryEntry[];
  lowStockThreshold: number;

  addEntry: (entry: Omit<StockHistoryEntry, 'id' | 'createdAt'>) => void;
  getHistoryByProduct: (productId: string) => StockHistoryEntry[];
  setLowStockThreshold: (value: number) => void;
  clearHistory: () => void;
}

const generateId = () =>
  `stock-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const LOW_STOCK_THRESHOLD_DEFAULT = 10;

export const useStockStore = create<StockStore>()(
  persist(
    (set, get) => ({
      history: [],
      lowStockThreshold: LOW_STOCK_THRESHOLD_DEFAULT,

      addEntry: (entry) => {
        const newEntry: StockHistoryEntry = {
          ...entry,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          history: [newEntry, ...state.history].slice(0, 500),
        }));
      },

      getHistoryByProduct: (productId) => {
        return get().history.filter((e) => e.productId === productId);
      },

      setLowStockThreshold: (value) => {
        set({ lowStockThreshold: Math.max(0, value) });
      },

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'admin-stock-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        history: state.history,
        lowStockThreshold: state.lowStockThreshold,
      }),
    }
  )
);
