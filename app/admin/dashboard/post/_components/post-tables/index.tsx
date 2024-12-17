'use client';

import { DataTable } from '@/components-admin/ui/table/data-table';
import { DataTableFilterBox } from '@/components-admin/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components-admin/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components-admin/ui/table/data-table-search';
import { Post } from '@/constants/data'; // Ensure Post type is defined
import { getPostColumns } from './post-columns'; // Post-specific column definitions
import { usePostTableFilters } from './use-post-table-filters';

interface PostTableProps {
  data: Post[];
  totalData: number;
  fetchData: () => void; // Function to fetch or refresh the data
}

export default function PostTable({ data, totalData, fetchData }: PostTableProps) {
  const {
    categoryFilter,
    setCategoryFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = usePostTableFilters();

  return (
    <div className="space-y-4">
      {/* Filter and Search Controls */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search Bar */}
        {/* <DataTableSearch
          searchKey="title"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        /> */}

        {/* Category Filter */}
        {/* <DataTableFilterBox
          filterKey="category"
          title="Category"
          options={[{ label: 'All', value: '' }, { label: 'Tag 1', value: 'tag1' }]} // Example options
          setFilterValue={setCategoryFilter}
          filterValue={categoryFilter}
        /> */}

        {/* Reset Filters Button */}
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>

      {/* Table Component */}
      <DataTable
        columns={getPostColumns(fetchData)} // Pass fetchData to refresh data
        data={data}
        totalItems={totalData}
      />
    </div>
  );
}
