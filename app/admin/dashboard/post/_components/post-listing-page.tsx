'use client'
import PageContainer from '@/components-admin/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components-admin/ui/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import PostTable from './post-tables';
import { fetchUnapprovedPosts } from '@/app/admin/api/post';
import { useEffect, useState } from 'react';

export default function PostListingPage() {
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch data function
  const fetchData = async () => {
    setLoading(true);
    try {
      const { totalPosts: total, posts: postList } = await fetchUnapprovedPosts();
      console.log('Processed Data:', { total, postList });
      setTotalPosts(total);
      setPosts(postList);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        {loading ? (
          <p>Loading...</p>
        ) : (
          <PostTable data={posts} totalData={totalPosts} fetchData={fetchData} />
        )}
      </div>
    </PageContainer>
  );
}
