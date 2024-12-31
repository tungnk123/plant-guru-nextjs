'use client';

import { DataTable } from '@/components-admin/ui/table/data-table';
import { DataTableFilterBox } from '@/components-admin/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components-admin/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components-admin/ui/table/data-table-search';
import { Employee } from '@/constants/data';
import { columns } from './columns';
import {
  STATUS_OPTIONS,
  useOrderTableFilters
} from './use-orders-table-filters';
import { OrderData } from '@/app/api/orderService';

export default function OrderTable({
  data,
  totalData
}: {
  data: OrderData[];
  totalData: number;
}) {
  const {
    statusFilter,
    setStatusFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useOrderTableFilters(data);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        <DataTableFilterBox
          filterKey="gender"
          title="Gender"
          options={GENDER_OPTIONS}
          setFilterValue={setGenderFilter}
          filterValue={genderFilter}
        /> */}
        {/* <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        /> */}
      </div>
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
