"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar/Navbar";
import { HeroSection } from "./components/HeroSection";
import GroupItem from "./components/GroupItem";
import CreateGroupModal from "./components/CreateGroupoModel";
import { motion } from "framer-motion";
import { Users, Plus, ChevronLeft, ChevronRight, Loader2, UserCircle2, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function Page() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [groupType, setGroupType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  // Fetch user profile and groups on page load
  useEffect(() => {
    const fetchProfileAndGroups = async () => {
      try {
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
          router.push("/login");
          return;
        }

        setUserId(storedUserId);

        let endpoint;
        switch (groupType) {
          case "your":
            endpoint = `https://un-silent-backend-develop.azurewebsites.net/api/groups/ownGroup/${storedUserId}`;
            break;
          case "joined":
            endpoint = `https://un-silent-backend-develop.azurewebsites.net/api/groups/user/${storedUserId}`;
            break;
          default:
            endpoint = `https://un-silent-backend-develop.azurewebsites.net/api/groups/${storedUserId}`;
        }

        const response = await fetch(endpoint);
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error("Error fetching groups:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndGroups();
  }, [router, groupType]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Filter groups based on search query
  const filteredGroups = groups.filter((group) =>
    group.groupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentGroups = filteredGroups.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCreateGroup = () => {
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-xl font-medium text-gray-700">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar toggle={toggleMenu} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-16"
      >
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-blue-600 text-transparent bg-clip-text">
              Discover Communities
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
              Join groups, share experiences, and connect with people who share your interests
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12"
          >
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 border-none shadow-md">
              <UserCircle2 className="w-10 h-10 text-purple-500 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Connect</h3>
              <p className="text-gray-600">Find and join communities that match your interests</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 border-none shadow-md">
              <Users className="w-10 h-10 text-blue-500 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Share</h3>
              <p className="text-gray-600">Share your thoughts and experiences with others</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100/50 border-none shadow-md">
              <MessagesSquare className="w-10 h-10 text-green-500 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Engage</h3>
              <p className="text-gray-600">Participate in discussions and grow together</p>
            </Card>
          </motion.div>
        </div>

        <Card className="p-6 mb-8 bg-white/50 backdrop-blur-sm shadow-md border-none">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex space-x-4">
              {[
                { type: "all", label: "All Groups", icon: Users },
                { type: "joined", label: "Groups You Joined", icon: UserCircle2 },
                { type: "your", label: "Your Groups", icon: MessagesSquare },
              ].map((item) => (
                <Button
                  key={item.type}
                  onClick={() => setGroupType(item.type)}
                  variant={groupType === item.type ? "default" : "outline"}
                  className={`rounded-full transition-all duration-300 ${
                    groupType === item.type
                      ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </div>

            <Button
              onClick={handleCreateGroup}
              className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </div>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {currentGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GroupItem
                id={group.id}
                groupName={group.groupName}
                description={group.description}
                groupImage={group.groupImage}
                numberOfMembers={group.numberOfMembers}
                numberOfPosts={group.numberOfPosts}
                status={group.status}
                userId={userId}
                masterUserId={group.masterUserId}
              />
            </motion.div>
          ))}

          {currentGroups.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600">No groups found</h3>
              <p className="text-gray-500">Try adjusting your search or create a new group</p>
            </div>
          )}
        </motion.div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                variant={currentPage === index + 1 ? "default" : "outline"}
                className={`rounded-full min-w-[2.5rem] ${
                  currentPage === index + 1
                    ? "bg-gradient-to-r from-primary to-primary/80 text-white"
                    : ""
                }`}
              >
                {index + 1}
              </Button>
            ))}

            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </motion.div>

      <CreateGroupModal
        userId={userId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setGroups([]);
        }}
      />
    </div>
  );
}
