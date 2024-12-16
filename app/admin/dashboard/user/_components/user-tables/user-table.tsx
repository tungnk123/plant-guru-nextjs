'use client';

import { DataTable } from '@/components-admin/ui/table/data-table';
import { DataTableResetFilter } from '@/components-admin/ui/table/data-table-reset-filter';
import { User } from '@/constants/data'; // Ensure User type is correctly defined
import { userColumns } from './user-columns'; // User-specific column definitions
import { useUserTableFilters } from './use-user-table-filters'; // User-specific filter hook

export default function UserTable({
  data,
  totalData,
  onUserUpdate,
}: {
  data: User[];
  totalData: number;
  onUserUpdate: (user: User) => void; // Callback for user updates
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
        {/* Uncomment if you have a search bar */}
        {/* <DataTableSearch
          searchKey="name"
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
        columns={userColumns(onUserUpdate)} // Pass onUserUpdate to userColumns
        data={data}
        totalItems={totalData}
      />
    </div>
  );
}
