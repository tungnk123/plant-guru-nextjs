'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';

export function usePostTableFilters() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [authorFilter, setAuthorFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  // Debounce search query for performance
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setSearchQuery(urlParams.get('q') || '');
    setCategoryFilter(urlParams.get('category') || '');
    setAuthorFilter(urlParams.get('author') || '');
    setPage(parseInt(urlParams.get('page') || '1', 10));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchQuery) params.set('q', debouncedSearchQuery);
    if (categoryFilter) params.set('category', categoryFilter);
    if (authorFilter) params.set('author', authorFilter);
    if (page) params.set('page', String(page));

    window.history.pushState({}, '', '?' + params.toString());
  }, [debouncedSearchQuery, categoryFilter, authorFilter, page]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setCategoryFilter('');
    setAuthorFilter('');
    setPage(1);
  }, []);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!categoryFilter || !!authorFilter || page > 1;
  }, [searchQuery, categoryFilter, authorFilter, page]);

  return {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    authorFilter,
    setAuthorFilter,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
  };
}
