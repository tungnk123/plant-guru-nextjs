'use client';
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
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const { totalPosts: total, posts: postList } = await fetchUnapprovedPosts();
      
      // Sort posts by createdAt date in descending order (newest first)
      const sortedPosts = postList.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setTotalPosts(total);
      setPosts(sortedPosts);
      setFilteredPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...posts]; // Create a copy to avoid mutating original array

    if (filterTag) {
      filtered = filtered.filter((post) => post.tag.toLowerCase() === filterTag.toLowerCase());
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(lowerQuery) ||
          post.description.toLowerCase().includes(lowerQuery) ||
          post.userNickName.toLowerCase().includes(lowerQuery) ||
          post.tag.toLowerCase().includes(lowerQuery)
      );
    }

    // Ensure filtered results maintain the same sorting (newest first)
    filtered.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredPosts(filtered);
  }, [searchQuery, filterTag, posts]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title={`Posts (${filteredPosts.length})`} description="Manage posts" />
          <Link href={'/dashboard/post/new'} className={cn(buttonVariants({ variant: 'default' }))}>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded-md"
          />
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="border p-2 rounded-md"
          >
            <option value="">All Tags</option>
            <option value="guides">Guides</option>
            <option value="diseases">Diseases</option>
            <option value="flowers">Flowers</option>
          </select>
        </div>

        <Separator />

        {loading ? (
          <p>Loading...</p>
        ) : (
          <PostTable data={filteredPosts} totalData={filteredPosts.length} fetchData={fetchData} />
        )}
      </div>
    </PageContainer>
  );
}
