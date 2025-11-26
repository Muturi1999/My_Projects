/**
 * React hooks for CMS API.
 */
'use client';

import { useState, useEffect } from 'react';
import { cmsApi } from '@/lib/api';
import type { Homepage, Navigation, Footer, ServiceGuarantee } from '@/lib/api/types';

export function useHomepage() {
  const [homepage, setHomepage] = useState<Homepage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchHomepage() {
      try {
        setLoading(true);
        const data = await cmsApi.getHomepage();
        setHomepage(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch homepage'));
        setHomepage(null);
      } finally {
        setLoading(false);
      }
    }

    fetchHomepage();
  }, []);

  return { homepage, loading, error };
}

export function useNavigation() {
  const [navigation, setNavigation] = useState<Navigation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchNavigation() {
      try {
        setLoading(true);
        const data = await cmsApi.getNavigation();
        setNavigation(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch navigation'));
        setNavigation(null);
      } finally {
        setLoading(false);
      }
    }

    fetchNavigation();
  }, []);

  return { navigation, loading, error };
}

export function useFooter() {
  const [footer, setFooter] = useState<Footer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchFooter() {
      try {
        setLoading(true);
        const data = await cmsApi.getFooter();
        setFooter(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch footer'));
        setFooter(null);
      } finally {
        setLoading(false);
      }
    }

    fetchFooter();
  }, []);

  return { footer, loading, error };
}

export function useServiceGuarantees() {
  const [guarantees, setGuarantees] = useState<ServiceGuarantee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchGuarantees() {
      try {
        setLoading(true);
        const response = await cmsApi.getServiceGuarantees();
        setGuarantees(response.results);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch service guarantees'));
        setGuarantees([]);
      } finally {
        setLoading(false);
      }
    }

    fetchGuarantees();
  }, []);

  return { guarantees, loading, error };
}

