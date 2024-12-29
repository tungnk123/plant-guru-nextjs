'use client';

import { DataTable } from '@/components-admin/ui/table/data-table';
import { DataTableFilterBox } from '@/components-admin/ui/table/data-table-filter-box';
import { DataTableResetFilter } from '@/components-admin/ui/table/data-table-reset-filter';
import { DataTableSearch } from '@/components-admin/ui/table/data-table-search';
import { WikiCard } from '@/app/api/wikiService';
import { columns } from './columns';
import { useWikiTableFilters } from './use-wiki-table-filters';

export default function WikiTable({
  data,
  totalData
}: {
  data: WikiCard[];
  totalData: number;
}) {
  const {
    contributorFilter,
    setContributorFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery
  } = useWikiTableFilters();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* <DataTableSearch
          searchKey="title"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
          placeholder="Search by title..."
        />
        <DataTableFilterBox
          filterKey="contributorCount"
          title="Contributors"
          options={[
            { label: 'All', value: 'all' },
            { label: 'No Contributors', value: '0' },
            { label: 'Has Contributors', value: 'has' }
          ]}
          setFilterValue={setContributorFilter}
          filterValue={contributorFilter}
        /> */}
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <DataTable 
        columns={columns} 
        data={data} 
        totalItems={totalData}
      />
    </div>
  );
}
