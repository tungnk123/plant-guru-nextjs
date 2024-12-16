import { searchParamsCache } from '@/lib/searchparams'; // Assuming this handles search params cache
import { SearchParams } from 'nuqs'; // Assuming this is a function for parsing search params
import React from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import PostListingPage from './_components/post-listing-page';
import TestApi from '@/app/components/TestApi';

type pageProps = {
  searchParams: SearchParams;
};

const Page = ({ searchParams }: pageProps) => {
  searchParamsCache.parse(searchParams);
  return <NuqsAdapter><PostListingPage/></NuqsAdapter>;
};

export default Page;
