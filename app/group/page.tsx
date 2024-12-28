"use client";
import React, { useState, useEffect } from 'react'
import Navbar from '../components/navbar/Navbar'
import { HeroSection } from './components/HeroSection'
import GroupItem from './components/GroupItem'
import CreateGroupModal from './components/CreateGroupoModel'

export default function Page() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [groups, setGroups] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [groupType, setGroupType] = useState('all'); // 'all', 'your', or 'joined'
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
    const itemsPerPage = 5;
    const userId = localStorage.getItem('userId');  

    const toggleMenu = () => {
        setIsMenuOpen((prevState) => !prevState);
    };

    const fetchGroups = async () => {
        let endpoint;
        switch (groupType) {
            case 'your':
                endpoint = `https://un-silent-backend-develop.azurewebsites.net/api/groups/ownGroup/${userId}`;
                break;
            case 'joined':
                endpoint = `https://un-silent-backend-develop.azurewebsites.net/api/groups/user/${userId}`;
                break;
            default:
                endpoint = `https://un-silent-backend-develop.azurewebsites.net/api/groups/${userId}`;
        }
        const response = await fetch(endpoint); // Replace with actual API endpoints
        const data = await response.json();
        setGroups(data);
        setCurrentPage(1); // Reset currentPage when groupType changes
    };

    useEffect(() => {
        fetchGroups();
    }, [groupType]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Filter groups based on search query
    const filteredGroups = groups.filter(group =>
        group.groupName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentGroups = filteredGroups.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleCreateGroup = () => {
        setIsModalOpen(true);
    };

    return (
        <div className="w-full">
            <section className="w-full">
                <Navbar toggle={toggleMenu} />
                <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <div className="ms-60 me-60 flex justify-between items-center mt-4 px-4">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setGroupType('all')}
                            className={`px-4 py-2 rounded-full border ${
                                groupType === 'all' ? 'bg-yellow-400' : 'bg-white'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setGroupType('joined')}
                            className={`px-4 py-2 rounded-full border ${
                                groupType === 'joined' ? 'bg-yellow-400' : 'bg-white'
                            }`}
                        >
                            Groups You Joined
                        </button>
                        <button
                            onClick={() => setGroupType('your')}
                            className={`px-4 py-2 rounded-full border ${
                                groupType === 'your' ? 'bg-yellow-400' : 'bg-white'
                            }`}
                        >
                            Your Groups
                        </button>
                    </div>
                    <button
                        onClick={handleCreateGroup}
                        className="flex items-center px-4 py-2 rounded-md border bg-yellow-400 text-black"
                    >
                        <span className="mr-2">+</span> Create Group
                    </button>
                </div>
                <div className="mt-8 space-y-4 mx-60">
                    {currentGroups.map((group) => (
                        <GroupItem
                            key={group.id}
                            id={group.id}
                            groupName={group.groupName}
                            description={group.description}
                            groupImage={group.groupImage}
                            numberOfMembers={group.numberOfMembers}
                            numberOfPosts={group.numberOfPosts}
                            isJoined={group.isJoined}
                            userId={userId}
                            masterUserId={group.masterUserId}
                        />
                    ))}
                </div>
                <div className="flex justify-center mt-4">
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
                            className={`px-3 py-1 mx-1 border rounded ${
                                currentPage === index + 1 ? 'border-blue-500' : ''
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
            </section>
            <CreateGroupModal userId={userId} isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchGroups(); }} />
        </div>
    )
}
