"use client";

import { useEffect, useState } from "react";

const ORDERS_STORAGE_KEY = "orders";
const ORDERS_EVENT = "orders:update";

export type OrderStatus = "placed" | "packaging" | "on-road" | "delivered";

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface OrderActivityEntry {
  id: string;
  label: string;
  description: string;
  timestamp: string;
  icon: "check" | "info";
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  placedAt: string;
  expectedDelivery?: string;
  status: OrderStatus;
  total: number;
  itemsCount: number;
  items: OrderItem[];
  activities: OrderActivityEntry[];
}

function safeParseOrders(raw: string | null): OrderRecord[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function readOrders(): OrderRecord[] {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(ORDERS_STORAGE_KEY);
  return safeParseOrders(stored);
}

export function writeOrders(orders: OrderRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent(ORDERS_EVENT, { detail: orders }));
  }, 0);
}

export function useOrders() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  useEffect(() => {
    setOrders(readOrders());

    const handler = (event: Event) => {
      const custom = event as CustomEvent<OrderRecord[]>;
      if (Array.isArray(custom.detail)) {
        setOrders(custom.detail);
      } else {
        setOrders(readOrders());
      }
    };

    window.addEventListener(ORDERS_EVENT, handler);
    return () => {
      window.removeEventListener(ORDERS_EVENT, handler);
    };
  }, []);

  const addOrder = (order: OrderRecord) => {
    setOrders((prev) => {
      const next = [order, ...prev];
      writeOrders(next);
      return next;
    });
  };

  return { orders, addOrder };
}


