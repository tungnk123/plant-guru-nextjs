'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { OrderData } from '@/app/api/orderService';
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

export const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Not Paid', label: 'Not Paid' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Failed', label: 'Failed' },
];

export const DATE_RANGE_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: 'all', label: 'All Time' },
];

export function useOrderTableFilters(initialData: OrderData[]) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>(searchQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // URL params handling
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setSearchQuery(urlParams.get('q') || '');
    setStatusFilter(urlParams.get('status')?.split(',') || []);
    setDateRangeFilter(urlParams.get('dateRange') || 'all');
    setPage(parseInt(urlParams.get('page') || '1', 10));
  }, []);

  // Update URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchQuery) params.set('q', debouncedSearchQuery);
    if (statusFilter.length) params.set('status', statusFilter.join(','));
    if (dateRangeFilter !== 'all') params.set('dateRange', dateRangeFilter);
    if (page > 1) params.set('page', String(page));

    window.history.pushState({}, '', `?${params.toString()}`);
  }, [debouncedSearchQuery, statusFilter, dateRangeFilter, page]);

  // Calculate filtered data and statistics
  const filteredData = useMemo(() => {
    return initialData.filter(order => {
      // Search filter
      const searchLower = debouncedSearchQuery.toLowerCase();
      const matchesSearch = !debouncedSearchQuery || 
        order.id.toLowerCase().includes(searchLower) ||
        order.userId.toLowerCase().includes(searchLower) ||
        order.shippingAddress.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus = statusFilter.length === 0 || 
        statusFilter.includes(order.status);

      // Date range filter
      let matchesDate = true;
      if (dateRangeFilter !== 'all') {
        const orderDate = new Date(order.createdAt);
        const today = new Date();
        const ranges = {
          'today': {
            start: startOfDay(today),
            end: endOfDay(today)
          },
          '7days': {
            start: startOfDay(subDays(today, 7)),
            end: endOfDay(today)
          },
          '30days': {
            start: startOfDay(subDays(today, 30)),
            end: endOfDay(today)
          }
        };

        if (dateRangeFilter in ranges) {
          matchesDate = isWithinInterval(orderDate, ranges[dateRangeFilter as keyof typeof ranges]);
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [initialData, debouncedSearchQuery, statusFilter, dateRangeFilter]);

  // Calculate statistics
  const statistics = useMemo(() => {
    return filteredData.reduce((acc, order) => {
      acc.totalAmount += Number(order.totalPrice);
      acc.totalOrders += 1;
      
      switch (order.status) {
        case 'Pending':
          acc.pendingOrders += 1;
          break;
        case 'Paid':
          acc.paidOrders += 1;
          acc.paidAmount += Number(order.totalPrice);
          break;
        case 'Failed':
          acc.failedOrders += 1;
          break;
      }

      return acc;
    }, {
      totalAmount: 0,
      paidAmount: 0,
      totalOrders: 0,
      pendingOrders: 0,
      paidOrders: 0,
      failedOrders: 0,
    });
  }, [filteredData]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter([]);
    setDateRangeFilter('all');
    setPage(1);
  }, []);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || statusFilter.length > 0 || dateRangeFilter !== 'all' || page > 1;
  }, [searchQuery, statusFilter, dateRangeFilter, page]);

  return {
    // Filter states
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dateRangeFilter,
    setDateRangeFilter,
    page,
    setPage,
    
    // Actions
    resetFilters,
    isAnyFilterActive,
    
    // Data
    filteredData,
    
    // Statistics
    statistics,
    
    // Constants
    STATUS_OPTIONS,
    DATE_RANGE_OPTIONS,
  };
}
