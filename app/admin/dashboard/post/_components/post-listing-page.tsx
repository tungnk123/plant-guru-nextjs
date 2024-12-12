import PageContainer from '@/components-admin/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components-admin/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import PostTable from './post-tables'; // Post-specific table

async function fetchPosts({ page, limit }: { page: number; limit: number }) {
  console.log('Start call API:');
  const response = await fetch(
    `https://un-silent-backend-develop.azurewebsites.net/api/posts/test/get-all`,
    {
      method: 'GET',
      headers: {
        Accept: '*/*',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('API Response:', data);

  return {
    totalPosts: data.length,
    posts: data,
  };
}


export default async function PostListingPage() {
  const filters = {
    page: 1,
    limit: 10,
  };

  let totalPosts = 0;
  let posts = [];

  try {
    const { totalPosts: total, posts: postList } = await fetchPosts(filters);
    console.log('Processed Data:', { total, postList });
    totalPosts = total;
    posts = postList;
  } catch (error) {
    console.error('Error fetching posts:', error);
  }

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Posts (${totalPosts})`}
            description="Manage posts (Server side table functionalities.)"
          />

          <Link
            href={'/dashboard/post/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <PostTable data={posts} totalData={totalPosts} />
      </div>
    </PageContainer>
  );
}
