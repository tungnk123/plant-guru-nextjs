'use client';

import React, { useState, useEffect } from 'react';
import PostCard from '@/app/components/home/PostCard';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import FilterButton from './FilterButton';
import PrimaryButton from '@/app/components/PrimaryButton'
import { Plus } from 'lucide-react'
import { fetchPosts, FetchPostsResponse, PostResponse } from '@/app/api/postService';
import { fetchUserById } from '@/app/admin/api/user';
import { useToast } from '@/hooks/use-toast';

interface PostCardResponse {
  posts: PostResponse[];
  totalPages: number;
}

interface PostCardGridProps {
  fetchPosts: (page: number, limit: number, tag: string, filter: string) => Promise<FetchPostsResponse>;
  tag: string;
}

const PostCardGrid: React.FC<PostCardGridProps> = ({ fetchPosts, tag }) => {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const { toast } = useToast();

  const limit = 3;

  const fetchPageData = async (page: number, filter: string) => {
    setLoading(true);
    try {
      const { posts, totalPages } = await fetchPosts(page, limit, tag, filter);
      setPosts(posts);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData(currentPage, activeFilter);
  }, [currentPage, activeFilter, tag]);

  const changePage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleCreatePostClick = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      showLoginToast();
      return;
    }

    try {
      const user = await fetchUserById(userId);
      if (!user) {
        showLoginToast();
      } else {
        // Navigate to create post page
        window.location.href = '/create-post';
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      showLoginToast();
    }
  };

  const showLoginToast = () => {
    toast({
      title: "Login Required",
      description: "Please log in to create a post.",
      variant: "destructive",
    });
  };

  const getVisiblePageNumbers = () => {
    const maxVisiblePages = 5;
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className='px-40 w-full'>
      <div className="flex items-center justify-between py-4">
        <div className="flex space-x-4">
          <FilterButton
            label="All"
            isActive={activeFilter === "All"}
            onClick={() => handleFilterClick("All")}
          />
          <FilterButton
            label="Trending"
            isActive={activeFilter === "Trending"}
            onClick={() => handleFilterClick("Trending")}
          />
          <FilterButton
            label="Upvote"
            isActive={activeFilter === "Upvote"}
            onClick={() => handleFilterClick("Upvote")}
          />
          <FilterButton
            label="Latest"
            isActive={activeFilter === "Latest"}
            onClick={() => handleFilterClick("Latest")}
          />
        </div>
        <button onClick={handleCreatePostClick} className='inter-medium text-1xl'>
          <PrimaryButton text="Create Post" icon={<Plus />} />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-1">
        {loading ? (
          <div className="col-span-full flex justify-center py-10">
            <span>Loading...</span>
          </div>
        ) : totalPages === 0 ? (
          <div className="col-span-full flex justify-center py-10">
            <div className="text-center border border-gray-300 rounded-md p-6 bg-gray-100">
              <h2 className="text-xl font-semibold">No posts available</h2>
              <p className="text-gray-500">Be the first to create a post or try a different filter.</p>
            </div>
          </div>
        ) : (
          posts.map((post, index) => <PostCard key={index} {...post} />)
        )}
      </div>

      {totalPages > 0 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <Button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="aspect-square p-0 rounded-sm bg-white text-[#C4CDD5] border-[#DFE3E8] border-[1px] hover:bg-gray-300 disabled:bg-[#919EAB]"
          >
            <Image className='h-auto w-auto pointer-events-none select-none'
              src="/images/img_paging_arrow_left.svg" alt="img_arrow_left" width={60} height={60} />
          </Button>

          {getVisiblePageNumbers().map((page, index) =>
            typeof page === 'number' ? (
              <Button
                key={index}
                onClick={() => changePage(page)}
                className={`px-3 py-2 rounded-sm ${page === currentPage
                  ? 'aspect-square bg-transparent text-blue1 border border-blue1 hover:bg-gray-100'
                  : 'aspect-square bg-transparent text-black border border-gray3 hover:bg-gray-100'
                  }`}
                disabled={loading}
              >
                {page}
              </Button>
            ) : (
              <span key={index} className="aspect-square text-black pointer-events-none select-none">
                ...
              </span>
            )
          )}

          <Button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="aspect-square p-0 rounded-sm bg-white text-[#C4CDD5] border-[#DFE3E8] border-[1px] hover:bg-gray-300 disabled:bg-[#919EAB]"
          >
            <Image className='h-auto w-auto pointer-events-none select-none'
              src="/images/img_paging_arrow_right.svg" alt="img_arrow_right" width={60} height={60} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostCardGrid;
