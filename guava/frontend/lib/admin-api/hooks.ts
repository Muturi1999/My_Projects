/**
 * React hooks for admin API operations
 * Provides easy-to-use hooks for CRUD operations with optimistic updates
 */

import { useState, useCallback } from 'react';
import { adminApiClient } from './client';

export function useAdminCreate<T = any>(
  endpoint: string,
  onSuccess?: (data: T) => void,
  onError?: (error: string) => void
) {
  const [loading, setLoading] = useState(false);

  const create = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create');
      }

      const result = await response.json();
      onSuccess?.(result);
      return result;
    } catch (error: any) {
      const message = error.message || 'Failed to create';
      onError?.(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [endpoint, onSuccess, onError]);

  return { create, loading };
}

export function useAdminUpdate<T = any>(
  endpoint: string,
  onSuccess?: (data: T) => void,
  onError?: (error: string) => void
) {
  const [loading, setLoading] = useState(false);

  const update = useCallback(async (id: string, data: any) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update');
      }

      const result = await response.json();
      onSuccess?.(result);
      return result;
    } catch (error: any) {
      const message = error.message || 'Failed to update';
      onError?.(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [endpoint, onSuccess, onError]);

  return { update, loading };
}

export function useAdminDelete(
  endpoint: string,
  onSuccess?: () => void,
  onError?: (error: string) => void
) {
  const [loading, setLoading] = useState(false);

  const remove = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/${endpoint}?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete');
      }

      onSuccess?.();
    } catch (error: any) {
      const message = error.message || 'Failed to delete';
      onError?.(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [endpoint, onSuccess, onError]);

  return { remove, loading };
}

