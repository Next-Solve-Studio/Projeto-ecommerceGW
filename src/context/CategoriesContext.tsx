'use client';
import { createContext, useContext, useMemo } from 'react';
import type { Category } from '@/types/products';

interface CategoriesContextType {
  categories: Category[];
  categoryMap: Map<string, string>;
}

const CategoriesContext = createContext<CategoriesContextType | null>(null);

export function CategoriesProvider({
  categories,
  children,
}: {
  categories: Category[];
  children: React.ReactNode;
}) {
  const value = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => {
        map.set(String(c.id_categ), c.name);
    });
    return { categories, categoryMap: map };
  }, [categories]);

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error('useCategories must be used within CategoriesProvider');
  return ctx;
}