"use client";

import { useEffect, useState } from "react";

const CART_STORAGE_KEY = "cart";
const CART_EVENT = "cart:update";

export interface CartItem {
  productId: string;
  quantity: number;
}

function safeParseCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        productId: String(item.productId),
        quantity: Number(item.quantity) || 1,
      }))
      .filter((item) => item.productId && item.quantity > 0);
  } catch {
    return [];
  }
}

export function readCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(CART_STORAGE_KEY);
  return safeParseCart(stored);
}

export function writeCartItems(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  // Dispatch asynchronously so listeners update after the current render commit
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: items }));
  }, 0);
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readCartItems());

    const handler = (event: Event) => {
      const custom = event as CustomEvent<CartItem[]>;
      if (Array.isArray(custom.detail)) {
        setItems(custom.detail);
      } else {
        setItems(readCartItems());
      }
    };

    window.addEventListener(CART_EVENT, handler);
    return () => {
      window.removeEventListener(CART_EVENT, handler);
    };
  }, []);

  const add = (productId: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      let next: CartItem[];
      if (existing) {
        next = prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        next = [...prev, { productId, quantity }];
      }
      writeCartItems(next);
      return next;
    });
  };

  const setQuantity = (productId: string, quantity: number) => {
    const safeQty = Math.max(0, Math.floor(quantity));
    setItems((prev) => {
      let next: CartItem[];
      if (safeQty === 0) {
        next = prev.filter((item) => item.productId !== productId);
      } else {
        next = prev.map((item) =>
          item.productId === productId ? { ...item, quantity: safeQty } : item
        );
      }
      writeCartItems(next);
      return next;
    });
  };

  const remove = (productId: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.productId !== productId);
      writeCartItems(next);
      return next;
    });
  };

  const clear = () => {
    writeCartItems([]);
    setItems([]);
  };

  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    count,
    add,
    setQuantity,
    remove,
    clear,
  };
}


