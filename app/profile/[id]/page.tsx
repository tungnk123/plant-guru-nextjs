"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/navbar/Navbar";
import PostCard from "../../components/home/PostCard";
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { fetchUserExperience, getUserLevel } from "@/app/api/user-exp-service";

export default function ProfilePage() {
  const { id } = useParams();
  const [userData, setUserData] = useState<any>(null);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const currentUserId = localStorage.getItem('userId');
  const [userLevel, setUserLevel] = useState<{ level: number; nextLevelPoints: number | null }>({ level: 0, nextLevelPoints: null });

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://un-silent-backend-develop.azurewebsites.net/api/users/${id}`);
        const data = await response.json();
        setUserData(data);
        
        const experienceData = await fetchUserExperience(data.userId);
        setUserLevel(getUserLevel(experienceData.experiencePoints));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const response = await fetch(`https://un-silent-backend-develop.azurewebsites.net/api/posts/user/${id}`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    fetchUserData();
    fetchUserPosts();
  }, [id]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPosts = posts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(posts.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const startChat = async () => {
    const messageData = {
      userSendId: currentUserId,
      userReceiveId: id,
      message: "Hello",
    };

    try {
      const response = await fetch('https://un-silent-backend-develop.azurewebsites.net/api/chat/sendText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      router.push('/chat');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <Navbar toggle={toggleMenu} />
      <div
        className="w-full h-64 bg-cover bg-center"
        style={{ backgroundImage: `url('https://cdn.pixabay.com/photo/2021/10/11/18/58/lake-6701636_1280.jpg')` }}
      ></div>
      <div className="flex items-start justify-start -mt-16 ml-60">
        <img
          src={userData.avatar}
          alt="User"
          className="ms-10 h-32 w-32 rounded-full border-4 border-white"
        />
        <div className="mt-20 ml-8 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="font-bold text-2xl mb-1 mr-4">{userData.name}</h2>
              {currentUserId !== id && (
                <button onClick={startChat} className="justify-center ml-10 mr-auto bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-all duration-200 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6l-4 4V5z" />
                  </svg>
                  Chat
                </button>
              )}
            </div>
          </div>
          <p className="text-gray-600 mb-4">{userData.email}</p>
          <div>
            <div className="flex items-center">
              <span className="mr-2 text-gray-600 font-bold text-lg bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text">
                Level: {userLevel.level}
              </span>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <span className="mr-4">
              <img
                src="https://img.icons8.com/?size=100&id=115225&format=png&color=000000"
                alt="Posts Icon"
                className="inline-block h-5 w-5 mr-1"
              />
              {posts.length} Posts
            </span>
          </div>
          <p className="text-left mb-4">{userData.bio}</p>
        </div>
      </div>
      <div className="mt-8 space-y-4 mx-80">
        {currentPosts.map((post) => (
          <PostCard key={post.postId} {...post} />
        ))}
      </div>
      <div className="flex justify-center mt-4 mb-10">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 mx-1 border rounded disabled:opacity-50"
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 mx-1 border rounded ${currentPage === index + 1 ? "border-blue-500" : ""
              }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 mx-1 border rounded disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
