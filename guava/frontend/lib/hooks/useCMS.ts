/**
 * React hooks for CMS data (local store only - no backend).
 */
'use client';

import { useState, useEffect } from 'react';
import type { Homepage, Navigation, Footer, ServiceGuarantee } from '@/lib/api/types';
import { 
  getHomepageCMS, 
  getNavigationCMS, 
  getFooterCMS,
  getServiceGuaranteesCMS 
} from '@/lib/data/cms/store';

export function useHomepage() {
  const [homepage, setHomepage] = useState<Homepage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const mock = getHomepageCMS() as unknown as Homepage;
    setHomepage(mock);
    setError(null);
    setLoading(false);
  }, []);

  return { homepage, loading, error };
}

export function useNavigation() {
  const [navigation, setNavigation] = useState<Navigation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const mock = getNavigationCMS() as unknown as Navigation;
    setNavigation(mock);
    setError(null);
    setLoading(false);
  }, []);

  return { navigation, loading, error };
}

export function useFooter() {
  const [footer, setFooter] = useState<Footer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const mock = getFooterCMS() as unknown as Footer;
    setFooter(mock);
    setError(null);
    setLoading(false);
  }, []);

  return { footer, loading, error };
}

export function useServiceGuarantees() {
  const [guarantees, setGuarantees] = useState<ServiceGuarantee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const cmsData = getServiceGuaranteesCMS();
    setGuarantees(cmsData.guarantees || []);
    setError(null);
    setLoading(false);
  }, []);

  return { guarantees, loading, error };
}

