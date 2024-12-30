"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/navbar/Navbar'
import PostCard from '../../components/home/PostCard';

export default function GroupPage() {
  const { id } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userId = localStorage.getItem('userId');
  const [groupData, setGroupData] = useState(null);
  const [selectedTab, setSelectedTab] = useState('Posts'); // State for selected navigation button
  const [posts, setPosts] = useState([]);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await fetch(`https://un-silent-backend-develop.azurewebsites.net/api/groups/${userId}/${id}`);
        const data = await response.json();
        setGroupData(data);
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    };

    if (id && userId) {
      fetchGroupData();
    }
  }, [id, userId]);

  useEffect(() => {
    const fetchPosts = async () => {
      let endpoint;
      if (selectedTab === 'Posts') {
        endpoint = `https://un-silent-backend-develop.azurewebsites.net/api/groups/posts/approved/${id}`;
      } else if (selectedTab === 'Pending Posts') {
        endpoint = `https://un-silent-backend-develop.azurewebsites.net/api/groups/posts/pending/${id}`;
      }

      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    if (id) {
      fetchPosts();
    }
  }, [id, selectedTab]);

  if (!groupData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
        <Navbar toggle={toggleMenu} />
      <div
        className="w-full h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${groupData.groupImage})` }}
      ></div>
      <div className="flex items-start justify-start -mt-16 ml-60">
        <img
          src={groupData.groupImage}
          alt="Group"
          className="ms-10 h-32 w-32 rounded-full border-4 border-white"
        />
        <div className="mt-20 ml-8 flex-1">
          <h2 className="font-bold text-2xl mb-2">{groupData.groupName}</h2>
          <div className="flex items-center mb-4">
            <span className="mr-4">
              <img
                src="https://img.icons8.com/?size=100&id=11168&format=png&color=000000"
                alt="Members Icon"
                className="inline-block h-5 w-5 mr-1"
              />
              {groupData.numberOfMembers} Members
            </span>
            <span>
              <img
                src="https://img.icons8.com/?size=100&id=115225&format=png&color=000000"
                alt="Posts Icon"
                className="inline-block h-5 w-5 mr-1"
              />
              {groupData.numberOfPosts} Posts
            </span>
          </div>
          <p className="text-left mb-4">{groupData.description}</p>
        </div>
      </div>
      <div className="flex justify-center border-t border-b pb-4 pt-4 mt-4 space-x-4">
        <button
          className={`px-4 py-2 rounded ${selectedTab === 'Posts' ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-800'}`}
          onClick={() => setSelectedTab('Posts')}
        >
          Posts
        </button>
        <button
          className={`px-4 py-2 rounded ${selectedTab === 'Members' ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-800'}`}
          onClick={() => setSelectedTab('Members')}
        >
          Members
        </button>
        <button
          className={`px-4 py-2 rounded ${selectedTab === 'Pending Posts' ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-800'}`}
          onClick={() => setSelectedTab('Pending Posts')}
        >
          Pending Posts
        </button>
      </div>
      <div className="mt-8 space-y-4 mx-80">
        {posts.map((post) => (
          <PostCard key={post.postId} {...post} />
        ))}
      </div>
    </div>
  );
} 