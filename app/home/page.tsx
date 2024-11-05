'use client'
import React from 'react';
import PostCard from '@/app/components/home/PostCard';

const HomePage = () => {
  const posts = [
    {
      userName: "Tung Doan",
      userAvatar: "/images/img_default_user_avatar.png",
      title: "Rose flower",
      description: "Some beautifulSome beautiful flowerSome beautiful flowerSome beautiful flowerSome beautiful flowerSome beautiful flowerSome beautiful flowerSome beautiful flowerSome beautiful flower flowerSome beautiful flowerSome beautiful flowerSome beautiful flowerSome beautiful flower",
      imageUrl: "/images/img_default_post.png", // Replace with actual image paths
      upvotes: 323,
      comments: 323,
      shares: 323,
    },
    {
      userName: "Tung Doan",
      userAvatar: "/images/img_default_user_avatar.png",
      title: "Rose flower",
      description: "Some beautiful flowerSome beautiful flowerSome beautiful flower",
      imageUrl: "/images/img_default_post.png", // Replace with actual image paths
      upvotes: 323,
      comments: 323,
      shares: 323,
    },
    {
      userName: "Tung Doan",
      userAvatar: "/images/img_default_user_avatar.png",
      title: "Rose flower",
      description: "Some beautiful flowerSome beautiful flowerSome beautiful flowerSome beautiful flowerSome beautiful flower",
      imageUrl: "/images/img_default_post.png", // Replace with actual image paths
      upvotes: 323,
      comments: 323,
      shares: 323,
    },
    {
      userName: "Tung Doan",
      userAvatar: "/images/img_default_user_avatar.png",
      title: "Rose flower",
      description: "Some beautiful flower Some beautiful flower Some beautiful flower Some beautiful flower Some beautiful flower Some beautiful flower Some beautiful flower Some beautiful flower Some beautiful flower Some beautiful flower Some beautiful flower Some beautiful flower",
      imageUrl: "/images/img_default_post.png", // Replace with actual image paths
      upvotes: 323,
      comments: 323,
      shares: 323,
    },
    {
      userName: "Tung Doan",
      userAvatar: "/images/img_default_user_avatar.png",
      title: "Rose flower",
      description: "Some beautiful flower",
      imageUrl: "/images/img_default_post.png", // Replace with actual image paths
      upvotes: 323,
      comments: 323,
      shares: 323,
    },
  ];

  return (
    <div>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap" rel="stylesheet" />
      </head>

      <span className="flex justify-center mb-24 font-medium text-[50px] font-inter">Plants shared by community</span>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-40 ">
        {posts.map((post, index) => (
          <PostCard key={index} {...post} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;