'use client';

import { DataTable } from '@/components-admin/ui/table/data-table';
import { DataTableResetFilter } from '@/components-admin/ui/table/data-table-reset-filter';
import { User } from '@/constants/data'; // Ensure User type is correctly defined
import { userColumns } from './user-columns'; // User-specific column definitions
import { useUserTableFilters } from './use-user-table-filters'; // User-specific filter hook

export default function UserTable({
  data,
  totalData,
}: {
  data: User[];
  totalData: number;
}) {
  const {
    searchQuery,
    setPage,
    setSearchQuery,
    isAnyFilterActive,
    resetFilters,
  } = useUserTableFilters(); // Adjusted for user-specific filters

  return (
    <div className="space-y-4">
      {/* Filter and Search Controls */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search Bar */}
        {/* Uncomment and configure if search functionality is needed */}
        {/* <DataTableSearch
          searchKey="name" // Adjust searchKey to 'name' for user-specific search
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        /> */}

        {/* Reset Filters Button */}
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>

      {/* Table Component */}
      <DataTable
        columns={userColumns} // User-specific columns
        data={data}
        totalItems={totalData}
      />
    </div>
  );
}
