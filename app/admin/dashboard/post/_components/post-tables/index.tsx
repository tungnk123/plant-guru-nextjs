'use client';

import { DataTable } from '@/components-admin/ui/table/data-table';
import { DataTableFilterBox } from '@/components-admin/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components-admin/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components-admin/ui/table/data-table-search';
import { Post } from '@/constants/data'; // Ensure this type is defined
import { postColumns } from './post-columns'; // Post-specific column definitions
import {
// Define categories for filtering if applicable
  usePostTableFilters, // Post-specific filter hook
} from './use-post-table-filters';

export default function PostTable({
  data,
  totalData,
}: {
  data: Post[];
  totalData: number;
}) {
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
          options={CATEGORY_OPTIONS} // Dynamic category options
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
        columns={postColumns}
        data={data}
        totalItems={totalData}
      />
    </div>
  );
}
