'use client'
import React from 'react';
import PostCard from '@/app/components/home/PostCard';
import ButtonCard from '../components/home/ButtonCard';
import Footer from '../components/home/Footer';
import Link from 'next/link';

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

  const buttons = [
    {
      title: "Plant Encyclopedia",
      subtitle: "Discover the World of Plants",
      icon: "/images/img_encyclopedia.svg",
      onClick: () => {

      }
    },
    {
      title: "Identify plant ",
      subtitle: "Identify Any Plant in Seconds",
      icon: "/images/img_identify_plant.svg",
      onClick: () => {

      }
    },
    {
      title: "Plant Guides",
      subtitle: "Expert Guides for Every Type of Plant",
      icon: "/images/img_plant_guide.svg",
      onClick: () => {

      }
    },
  ]

  return (
    <div>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap" rel="stylesheet" />
      </head>

      <span className="flex justify-center mb-24 font-medium text-[50px] font-inter">Plants shared by community</span>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-5 px-40 mb-20">
        {posts.map((post, index) => (
          <PostCard key={index} {...post} />
        ))}
      </div>

      <span className="flex justify-center mb-14 font-medium text-[50px] font-inter">All Features</span>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 px-36 mb-20">
        {buttons.map((button, index) => (
          <ButtonCard key={index} {...button}></ButtonCard>
        ))}
      </div>

      <Footer></Footer>
    </div>
  );
};

export default HomePage;