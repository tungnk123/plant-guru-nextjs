'use client';

import { useState } from 'react';

export const useWikiTableFilters = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [contributorFilter, setContributorFilter] = useState('all');

  const isAnyFilterActive =
    searchQuery !== '' || contributorFilter !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setContributorFilter('all');
    setPage(1);
  };

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    contributorFilter,
    setContributorFilter,
    isAnyFilterActive,
    resetFilters
  };
};
