'use client';

import { DataTable } from '@/components-admin/ui/table/data-table';
import { DataTableResetFilter } from '@/components-admin/ui/table/data-table-reset-filter';
import { User } from '@/constants/data';
import { userColumns } from './user-columns';
import { useUserTableFilters } from './use-user-table-filters';

export default function UserTable({
  data,
  totalData,
  onUserUpdate,
}: {
  data: User[];
  totalData: number;
  onUserUpdate: (user: User) => void;
}) {
  const {
    searchQuery,
    setPage,
    setSearchQuery,
    isAnyFilterActive,
    resetFilters,
  } = useUserTableFilters();

  return (
    <div className="space-y-4">
      <DataTable
        columns={userColumns(onUserUpdate)}
        data={data}
        totalItems={totalData}
      />
    </div>
  );
}
