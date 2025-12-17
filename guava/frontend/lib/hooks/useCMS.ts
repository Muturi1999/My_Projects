/**
 * React hooks for CMS API.
 */
'use client';

import { useState, useEffect } from 'react';
import type { Homepage, Navigation, Footer, ServiceGuarantee } from '@/lib/api/types';
import { cmsApi } from '@/lib/api';
import { getHomepageCMS, getNavigationCMS, getFooterCMS } from '@/lib/data/cms/store';

export function useHomepage() {
  const [homepage, setHomepage] = useState<Homepage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchHomepage() {
      // For now, avoid calling the CMS API (which is down) and use local CMS data only.
      setLoading(true);
      const mock = getHomepageCMS() as unknown as Homepage;
      setHomepage(mock);
      setError(null);
      setLoading(false);
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
        // Fallback to local mock navigation data
        const mock = getNavigationCMS() as unknown as Navigation;
        setNavigation(mock);
        setError(null);
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
        // Fallback to local mock footer data
        const mock = getFooterCMS() as unknown as Footer;
        setFooter(mock);
        setError(null);
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

