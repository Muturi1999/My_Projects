"use client";

import { useEffect, useState } from "react";

const WISHLIST_STORAGE_KEY = "wishlist";
const WISHLIST_EVENT = "wishlist:update";

function safeParseIds(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function readWishlistIds(): string[] {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
  return safeParseIds(stored);
}

export function writeWishlistIds(ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
  // Dispatch asynchronously so listeners update after the current render commit
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent(WISHLIST_EVENT, { detail: ids }));
  }, 0);
}

export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(readWishlistIds());

    const handler = (event: Event) => {
      const custom = event as CustomEvent<string[]>;
      if (Array.isArray(custom.detail)) {
        setIds(custom.detail);
      } else {
        setIds(readWishlistIds());
      }
    };

    window.addEventListener(WISHLIST_EVENT, handler);
    return () => {
      window.removeEventListener(WISHLIST_EVENT, handler);
    };
  }, []);

  const toggle = (productId: string) => {
    setIds((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      writeWishlistIds(next);
      return next;
    });
  };

  const remove = (productId: string) => {
    setIds((prev) => {
      const next = prev.filter((id) => id !== productId);
      writeWishlistIds(next);
      return next;
    });
  };

  const clear = () => {
    writeWishlistIds([]);
    setIds([]);
  };

  return {
    ids,
    count: ids.length,
    toggle,
    remove,
    clear,
  };
}


