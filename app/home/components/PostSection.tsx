'use client'
import React from 'react'
import PostCard from '@/app/components/home/PostCard'
import ButtonCard from '../../components/home/ButtonCard'
import Footer from '../../components/home/Footer'
import Link from 'next/link'
import Head from 'next/head'
import PostCardGrid from './PostCardGrid'
import ButtonCardGrid from './ButtonCardGrid'

const PostSection = () => {

  const fetchPosts = async (page: number) => {
    // const response = await fetch(`/api/posts?page=${page}`);
    // const data = await response.json();
    
    return {
      posts: posts,
      totalPages: 9,
    };
  };
  
  const posts = [
    {
      userName: 'Tung Doan',
      userAvatar: '/images/img_default_user_avatar.png',
      title: 'Rose flower',
      description:
        'Some beautifulSome beautiful flowerSome beautiful flowerSome beautiful flowerSome beautiful flowerSome beautiful flowerSome beautiful flowerSome beautiful flowerSome beautiful flower flowerSome beautiful flowerSome beautiful flowerSome beautiful flowerSome beautiful flower',
      imageUrl: '/images/img_default_post.png', // Replace with actual image paths
      upvotes: 323,
      comments: 323,
      shares: 323
    },
    {
      userName: 'Tung Doan',
      userAvatar: '/images/img_default_user_avatar.png',
      title: 'Rose flower',
      description:
        'Some beautiful flowerSome beautiful flowerSome beautiful flower',
      imageUrl: '/images/img_default_post.png', // Replace with actual image paths
      upvotes: 323,
      comments: 323,
      shares: 323
    },
    {
      userName: 'Tung Doan',
      userAvatar: '/images/img_default_user_avatar.png',
      title: 'Rose flower',
      description:
        'Some beautiful flowerSome beautiful flowerSome beautiful flowerSome beautiful flowerSome beautiful flower',
      imageUrl: '/images/img_default_post.png', // Replace with actual image paths
      upvotes: 323,
      comments: 323,
      shares: 323
    },
    {
      userName: 'Tung Doan',
      userAvatar: '/images/img_default_user_avatar.png',
      title: 'Rose flower',
      description:
        'Some beautiful flower Some beautiful flower Some beautiful flower Some beautiful flower Some beautiful flower Some beautiful flower Some beautiful flower Some beautiful flower Some beautiful flower Some beautiful flower Some beautiful flower Some beautiful flower',
      imageUrl: '/images/img_default_post.png', // Replace with actual image paths
      upvotes: 323,
      comments: 323,
      shares: 323
    },
    {
      userName: 'Tung Doan',
      userAvatar: '/images/img_default_user_avatar.png',
      title: 'Rose flower',
      description: 'Some beautiful flower',
      imageUrl: '/images/img_default_post.png', // Replace with actual image paths
      upvotes: 323,
      comments: 323,
      shares: 323
    }
  ]

  const buttons = [
    {
      title: 'Plant Encyclopedia',
      subtitle: 'Discover the World of Plants',
      icon: '/images/img_encyclopedia.svg',
      onClick: () => {}
    },
    {
      title: 'Identify plant ',
      subtitle: 'Identify Any Plant in Seconds',
      icon: '/images/img_identify_plant.svg',
      onClick: () => {}
    },
    {
      title: 'Plant Guides',
      subtitle: 'Expert Guides for Every Type of Plant',
      icon: '/images/img_plant_guide.svg',
      onClick: () => {}
    }
  ]

  return (
    <div>
      <Head>
        <title>Plant GURU</title>
      </Head>

      <div className="container mx-auto flex flex-col items-center space-y-4 rounded-3xl py-6">
        <span className='font-inter mb-24 flex justify-center text-[40px] font-medium'>
          Plants shared by community
        </span>

        <PostCardGrid fetchPosts={fetchPosts} />

        <span className='font-inter mb-14 flex justify-center text-[50px] font-medium'>
          All Features
        </span>

        <ButtonCardGrid buttons={buttons} />
      </div>

      <Footer></Footer>
    </div>
  )
}

export default PostSection
