'use client';

import React, { useState, useEffect } from 'react';
import PostCard from '@/app/components/home/PostCard';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import FilterButton from './FilterButton';
import PrimaryButton from '@/app/components/PrimaryButton'
import { Plus } from 'lucide-react'
import Link from 'next/link';
import { fetchPosts, FetchPostsResponse, PostResponse } from '@/app/api/postService';

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
    <div className='px-40'>
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
            label="Latest"
            isActive={activeFilter === "Latest"}
            onClick={() => handleFilterClick("Latest")}
          />
        </div>
        <Link href='/create-post' className='inter-medium text-1xl'>
          <PrimaryButton text="Create Post" icon={<Plus />} />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-1">
        {loading ? (
          <div className="col-span-full flex justify-center py-10">
            <span>Loading...</span>
          </div>
        ) : (
          posts.map((post, index) => <PostCard key={index} {...post} />)
        )}
      </div>

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
    </div>
  );
};

export default PostCardGrid;
