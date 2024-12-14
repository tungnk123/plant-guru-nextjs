'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';

export function useUserTableFilters() {
  const [searchQuery, setSearchQuery] = useState<string>(''); // Filter by name or email
  const [premiumFilter, setPremiumFilter] = useState<boolean | ''>(''); // Filter by premium status
  const [page, setPage] = useState<number>(1);

  // Debounce search query for performance
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load filters from URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setSearchQuery(urlParams.get('q') || '');
    setPremiumFilter(urlParams.get('premium') === 'true' ? true : urlParams.get('premium') === 'false' ? false : '');
    setPage(parseInt(urlParams.get('page') || '1', 10));
  }, []);

  // Update URL parameters when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchQuery) params.set('q', debouncedSearchQuery);
    if (premiumFilter !== '') params.set('premium', String(premiumFilter));
    if (page) params.set('page', String(page));

    window.history.pushState({}, '', '?' + params.toString());
  }, [debouncedSearchQuery, premiumFilter, page]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setPremiumFilter('');
    setPage(1);
  }, []);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || premiumFilter !== '' || page > 1;
  }, [searchQuery, premiumFilter, page]);

  return {
    searchQuery,
    setSearchQuery,
    premiumFilter,
    setPremiumFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
  };
}
