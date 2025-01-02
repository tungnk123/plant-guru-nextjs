import { searchParamsCache } from '@/lib/searchparams'; // Handles search params cache
import { SearchParams } from 'nuqs'; // Parses search params
import React from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import WikiListingPage from './_components/wiki-listing-page';

type PageProps = {
  searchParams: Promise<SearchParams>; // Treating searchParams as a Promise
};

const Page = async ({ searchParams }: PageProps) => {
  try {
    // Await the resolution of searchParams
    const resolvedSearchParams = await searchParams;

    // Parse resolved search params
    searchParamsCache.parse(resolvedSearchParams);

    return (
      <NuqsAdapter>
        <WikiListingPage />
      </NuqsAdapter>
    );
  } catch (error) {
    console.error('Error resolving searchParams:', error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Failed to load the page. Please try again later.</p>
      </div>
    );
  }
};

export default Page;
