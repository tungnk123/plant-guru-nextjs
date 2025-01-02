'use client'
import React from 'react'
import { useState, useEffect } from 'react';
import Footer from '../../components/home/Footer'
import Link from 'next/link'
import Head from 'next/head'
import PostCardGrid from './PostCardGrid'
import ButtonCardGrid from './ButtonCardGrid'
import { fetchPosts, PostResponse } from '@/app/api/postService';
import CategoryCards from './CategoryCards';

const PostSection = () => {

  const buttons = [
    {
      title: 'Plant Encyclopedia',
      subtitle: 'Discover the World of Plants',
      icon: '/images/img_encyclopedia.svg',
      onClick: () => { }
    },
    {
      title: 'Identify plant ',
      subtitle: 'Identify Any Plant in Seconds',
      icon: '/images/img_identify_plant.svg',
      onClick: () => { }
    },
    {
      title: 'Plant Guides',
      subtitle: 'Expert Guides for Every Type of Plant',
      icon: '/images/img_plant_guide.svg',
      onClick: () => { }
    }
  ]

  const [tag, setTag] = useState('');

  const handleTagChange = (newTag: string) => {
    setTag(newTag);
  };

  return (
    <div>
      <Head>
        <title>Plant GURU</title>
      </Head>

      <div className='flex flex-col my-10'>
        <div className='flex flex-row mx-auto'>
          <CategoryCards onTagChange={handleTagChange} />
          <div className="container w-5/6 mx-auto flex flex-col items-center space-y-1 rounded-3xl py-1">
            <span className='font-inter mb-2 flex justify-center text-[30px] font-medium'>
              Plants shared by community
            </span>
            <PostCardGrid fetchPosts={fetchPosts} tag={tag} />

          </div>
        </div>
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
