'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';

// Example gender options
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' }
];

export function useEmployeeTableFilters() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  // State for debouncing the search input
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(timer); // Cleanup timeout on unmount or query change
    };
  }, [searchQuery]);

  useEffect(() => {
    // On mount, read the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    setSearchQuery(urlParams.get('q') || '');
    setGenderFilter(urlParams.get('gender') || '');
    setPage(parseInt(urlParams.get('page') || '1', 10));
  }, []);

  // Update URL without reloading page
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchQuery) params.set('q', debouncedSearchQuery);
    if (genderFilter) params.set('gender', genderFilter);
    if (page) params.set('page', String(page));

    // Update the URL with the new query parameters
    window.history.pushState({}, '', '?' + params.toString());
  }, [debouncedSearchQuery, genderFilter, page]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setGenderFilter('');
    setPage(1);
  }, []);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!genderFilter || !!page;
  }, [searchQuery, genderFilter, page]);

  return {
    searchQuery,
    setSearchQuery,
    genderFilter,
    setGenderFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
  };
}
