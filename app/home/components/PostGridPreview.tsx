'use client';

import React, { useState, useEffect } from 'react';
import PostCard from '@/app/components/home/PostCard';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PostCardProps } from '@/app/components/home/PostCard';

export interface PostCardResponse {
    posts: PostCardProps[];
    totalPages: number;
}

interface PostCardGridProps {
    fetchPosts: (page: number) => Promise<PostCardResponse>;
}

const PostCardPreview: React.FC<PostCardGridProps> = ({ fetchPosts }) => {
    const [posts, setPosts] = useState<PostCardProps[]>([]);
    const [loading, setLoading] = useState(true);


    const fetchPageData = async () => {
        setLoading(true);
        try {
            const { posts, totalPages } = await fetchPosts(1);
            setPosts(posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPageData();
    });


    return (
        <div className="container mx-auto px-4 py-6 bg-[#F5F5DC] rounded-3xl">
            <div className="flex items-center justify-end mb-4">
                <Button className="flex items-center bg-transparent space-x-1 text-sm border-0 shadow-non text-black hover:text-gray-900">
                    <span>See more</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 10H4a1 1 0 110-2h10.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </Button>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {loading ? (
                    <div className="col-span-full flex justify-center py-10">
                        {/* <span>Loading...</span> */}
                    </div>
                ) : (
                    posts.map((post, index) => <PostCard key={index} {...post} />)
                )}
            </div>
        </div>
    );
};

export default PostCardPreview;
