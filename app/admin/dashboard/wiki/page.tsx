import { searchParamsCache } from '@/lib/searchparams'; // Assuming this handles search params cache
import { SearchParams } from 'nuqs'; // Assuming this is a function for parsing search params
import React from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import WikiListingPage from './_components/wiki-listing-page';

type pageProps = {
  searchParams: SearchParams;
};

const Page = async ({ searchParams }: pageProps) => {
  searchParamsCache.parse(searchParams);
  return (
    <NuqsAdapter>
      <WikiListingPage />
    </NuqsAdapter>
  );
};

export default Page;
