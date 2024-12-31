"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../components/navbar/Navbar'
import PostCard from '../../components/home/PostCard';
import PostPendingCard from '../../group/components/PostPendingCard';
import UserCard from '../../group/components/UserCard';

export default function GroupPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userId = localStorage.getItem('userId');
  const [groupData, setGroupData] = useState(null);
  const [selectedTab, setSelectedTab] = useState('Posts'); // State for selected navigation button
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const fetchGroupData = async () => {
    try {
      const response = await fetch(`https://un-silent-backend-develop.azurewebsites.net/api/groups/${userId}/${id}`);
      const data = await response.json();
      setGroupData(data);
    } catch (error) {
      console.error('Error fetching group data:', error);
    }
  };

  const fetchPostsOrUsers = async () => {
    let endpoint;
    if (selectedTab === 'Posts') {
      endpoint = `https://un-silent-backend-develop.azurewebsites.net/api/groups/posts/approved/${id}`;
    } else if (selectedTab === 'Pending Posts') {
      endpoint = `https://un-silent-backend-develop.azurewebsites.net/api/groups/posts/pending/${id}`;
    } else if (selectedTab === 'Members') {
      endpoint = `https://un-silent-backend-develop.azurewebsites.net/api/groups/${id}/users`;
    } else if (selectedTab === 'Pending Members') {
      endpoint = `https://un-silent-backend-develop.azurewebsites.net/api/groups/${id}/users/pending`;
    }

    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      if (selectedTab === 'Members') {
        setUsers(data);
      } else if (selectedTab === 'Pending Members') {
        setPendingUsers(data);
      } else {
        setPosts(data);
      }
      setCurrentPage(1); // Reset to first page when tab changes
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (id && userId) {
      fetchGroupData();
    }
  }, [id, userId]);

  useEffect(() => {
    if (id) {
      fetchPostsOrUsers();
    }
  }, [id, selectedTab]);

  if (!groupData) {
    return <div>Loading...</div>;
  }

  const isMasterUser = userId === groupData.masterUserId;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPosts = posts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(posts.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleCreatePost = () => {
    router.push(`/group/${id}/create-post`);
  };

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
        {isMasterUser && (
          <>
            <button
              className={`px-4 py-2 rounded ${selectedTab === 'Pending Posts' ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => setSelectedTab('Pending Posts')}
            >
              Pending Posts
            </button>
            <button
              className={`px-4 py-2 rounded ${selectedTab === 'Pending Members' ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => setSelectedTab('Pending Members')}
            >
              Pending Members
            </button>
          </>
        )}
      </div>
      <div className="flex justify-end mx-80 mt-5">
        <button
          onClick={handleCreatePost}
          className="justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 shadow h-9 px-4 py-2 bg-yellow-300 hover:bg-yellow-600 text-black flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plus">
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
          Create Post
        </button>
      </div>
      <div className="mt-8 space-y-4 mx-80">
        {selectedTab === 'Members' ? (
          users.map((user) => (
            <UserCard key={user.userId} {...user} showBanButton={isMasterUser} />
          ))
        ) : selectedTab === 'Pending Members' ? (
          pendingUsers.map((user) => (
            <UserCard key={user.userId} {...user} showBanButton={isMasterUser} isPending />
          ))
        ) : (
          currentPosts.map((post) => (
            selectedTab === 'Pending Posts' ? (
              <PostPendingCard key={post.postId} {...post} onApprove={fetchPostsOrUsers} />
            ) : (
              <PostCard key={post.postId} {...post} />
            )
          ))
        )}
      </div>
      {selectedTab !== 'Members' && selectedTab !== 'Pending Members' && (
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
              className={`px-3 py-1 mx-1 border rounded ${currentPage === index + 1 ? 'border-blue-500' : ''
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
      )}
    </div>
  );
} 