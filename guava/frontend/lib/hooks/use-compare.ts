"use client";

import { useEffect, useState } from "react";

const COMPARE_STORAGE_KEY = "compare";
const COMPARE_EVENT = "compare:update";
const MAX_COMPARE_ITEMS = 6;

function safeParseIds(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function readCompareIds(): string[] {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(COMPARE_STORAGE_KEY);
  return safeParseIds(stored);
}

export function writeCompareIds(ids: string[]) {
  if (typeof window === "undefined") return;
  // Limit to max items
  const limitedIds = ids.slice(0, MAX_COMPARE_ITEMS);
  window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(limitedIds));
  // Dispatch asynchronously so listeners update after the current render commit
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent(COMPARE_EVENT, { detail: limitedIds }));
  }, 0);
}

export function useCompare() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(readCompareIds());

    const handler = (event: Event) => {
      const custom = event as CustomEvent<string[]>;
      if (Array.isArray(custom.detail)) {
        setIds(custom.detail);
      } else {
        setIds(readCompareIds());
      }
    };

    window.addEventListener(COMPARE_EVENT, handler);
    return () => {
      window.removeEventListener(COMPARE_EVENT, handler);
    };
  }, []);

  const add = (productId: string): boolean => {
    // Check if already at max
    if (ids.length >= MAX_COMPARE_ITEMS) {
      return false; // Cannot add more
    }
    
    // Check if already exists
    if (ids.includes(productId)) {
      return true; // Already in compare
    }

    setIds((prev) => {
      const next = [...prev, productId];
      writeCompareIds(next);
      return next;
    });
    return true;
  };

  const remove = (productId: string) => {
    setIds((prev) => {
      const next = prev.filter((id) => id !== productId);
      writeCompareIds(next);
      return next;
    });
  };

  const toggle = (productId: string): boolean => {
    if (ids.includes(productId)) {
      remove(productId);
      return true;
    } else {
      return add(productId);
    }
  };

  const clear = () => {
    writeCompareIds([]);
    setIds([]);
  };

  const isInCompare = (productId: string) => {
    return ids.includes(productId);
  };

  return {
    ids,
    count: ids.length,
    add,
    remove,
    toggle,
    clear,
    isInCompare,
    maxItems: MAX_COMPARE_ITEMS,
    canAddMore: ids.length < MAX_COMPARE_ITEMS,
  };
}

