import { searchParamsCache } from '@/lib/searchparams'; // Handles search params cache
import { SearchParams } from 'nuqs'; // Parses search params
import React from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import PostListingPage from './_components/post-listing-page';

type PageProps = {
  searchParams: Promise<SearchParams>; // Assuming searchParams can be a Promise
};

const Page = async ({ searchParams }: PageProps) => {
  // Await the resolution of searchParams if it is a Promise
  const resolvedSearchParams = await searchParams;

  // Parse the resolved search params
  searchParamsCache.parse(resolvedSearchParams);

  return (
    <NuqsAdapter>
      <PostListingPage />
    </NuqsAdapter>
  );
};

export default Page;
