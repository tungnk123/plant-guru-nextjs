'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';

export function useMembershipTableFilters() {
  const [searchQuery, setSearchQuery] = useState<string>(''); // Filter by name or description
  const [priceRangeFilter, setPriceRangeFilter] = useState<[number, number] | null>(null); // Filter by price range
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
    const priceRange = urlParams.get('price');
    setPriceRangeFilter(priceRange ? priceRange.split(',').map(Number) as [number, number] : null);
    setPage(parseInt(urlParams.get('page') || '1', 10));
  }, []);

  // Update URL parameters when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchQuery) params.set('q', debouncedSearchQuery);
    if (priceRangeFilter) params.set('price', priceRangeFilter.join(','));
    if (page) params.set('page', String(page));

    window.history.pushState({}, '', '?' + params.toString());
  }, [debouncedSearchQuery, priceRangeFilter, page]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setPriceRangeFilter(null);
    setPage(1);
  }, []);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || (priceRangeFilter !== null) || page > 1;
  }, [searchQuery, priceRangeFilter, page]);

  return {
    searchQuery,
    setSearchQuery,
    priceRangeFilter,
    setPriceRangeFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
  };
}
