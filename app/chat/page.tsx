"use client";

import ChatRoomItem from "@/app/chat/component/chatRoomItem";
import { useState, useRef, useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { useRouter } from "next/navigation";

// Define a type for the message objects
interface Message {
  chatMessageId: string;
  userSendId: string;
  avatar: string;
  message: string | null;
  mediaLink: string | null;
  sendDate: string;
  type: "Text" | "Media";
}

const Page = () => {
  const [myId, setMyId] = useState<string | null>(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const prevMessageCountRef = useRef<number>(0);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setMyId(storedUserId);
      }
    }
  }, []);

  useEffect(() => {
    const fetchChatRooms = async () => {
      if (!myId) return;
      try {
        const response = await fetch(
          `https://un-silent-backend-develop.azurewebsites.net/api/chat/users/${myId}/chatRooms`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setChatRooms(data);
        if (data.length > 0) {
          setSelectedChat(data[0]);
          fetchMessages(data[0].chatRoomId);
        }
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
      }
    };

    fetchChatRooms();
  }, [myId]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://un-silent-backend-develop.azurewebsites.net/chatHub", {
        withCredentials: false,
      })
      .withAutomaticReconnect()
      .build();

    connection.on("NewMessage", async () => {
      if (selectedChat) {
        fetchMessages(selectedChat.chatRoomId);
        const response = await fetch(
          `https://un-silent-backend-develop.azurewebsites.net/api/chat/users/${myId}/chatRooms`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setChatRooms(data);
      }
    });

    connection
      .start()
      .then(() => console.log("Connected to SignalR hub"))
      .catch((err) => console.error("Error connecting to SignalR hub:", err));

    return () => {
      connection.stop().then(() => console.log("Disconnected from SignalR hub"));
    };
  }, [selectedChat, myId]);

  const fetchMessages = async (chatRoomId: string) => {
    try {
      const response = await fetch(
        `https://un-silent-backend-develop.azurewebsites.net/api/chat/${chatRoomId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !selectedChat || !myId) return;

    const messageData = {
      userSendId: myId,
      userReceiveId: selectedChat.userId,
      message: newMessage,
    };

    try {
      const response = await fetch(
        "https://un-silent-backend-develop.azurewebsites.net/api/chat/sendText",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setNewMessage("");
      fetchMessages(selectedChat.chatRoomId);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files as FileList);
    const imageLinks = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch("https://api.imgur.com/3/image", {
          method: "POST",
          headers: {
            Authorization: "Client-ID 546c25a59c58ad7",
          },
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          imageLinks.push(data.data.link);
        } else {
          console.error("Failed to upload image:", data);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    if (imageLinks.length > 0 && selectedChat) {
      const imageData = {
        userSendId: myId,
        userReceiveId: selectedChat.userId,
        images: imageLinks,
      };

      try {
        const response = await fetch(
          "https://un-silent-backend-develop.azurewebsites.net/api/chat/sendMedia",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(imageData),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to send images");
        }

        fetchMessages(selectedChat.chatRoomId);
      } catch (error) {
        console.error("Error sending images:", error);
      }
    }
  };

  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
    prevMessageCountRef.current = messages.length;
  }, [messages]);

  const filteredChatRooms = chatRooms.filter((chatRoom) =>
    chatRoom.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const MessageBubble = ({ message, isOwn }: { message: Message, isOwn: boolean }) => (
    <div
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} items-end gap-2`}
    >
      {!isOwn && (
        <div className="relative flex-shrink-0">
          <img
            src={message.avatar}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover shadow-md"
          />
        </div>
      )}

      <div
        className={`
          group relative max-w-md shadow-lg transition-all duration-300
          ${isOwn ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white' : 'bg-gray-200 text-gray-800'}
          ${isOwn ? 'rounded-l-2xl rounded-tr-2xl' : 'rounded-r-2xl rounded-tl-2xl'}
          p-4
        `}
      >
        {message.type === 'Text' ? (
          <p className="text-sm leading-relaxed">{message.message}</p>
        ) : (
          <img
            src={message.mediaLink}
            alt="Media"
            className="rounded-lg object-cover shadow-lg max-w-sm hover:scale-105 transition-transform"
          />
        )}
      
      </div>

      {isOwn && (
        <div className="relative flex-shrink-0">
          <img
            src={message.avatar}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover shadow-md"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      {/* Chat List */}
      <div className="w-1/3 bg-white shadow-lg rounded-tr-2xl rounded-br-2xl p-4 overflow-y-auto">
        <button
          onClick={() => router.back()}
          className="mb-4 p-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold mb-6 text-gray-700">Chat Rooms</h1>
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-3 rounded-lg border bg-gray-100 mb-6"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        {filteredChatRooms.map((chatRoom) => (
          <ChatRoomItem
            key={chatRoom.chatRoomId}
            friendAvatarLink={chatRoom.avatar}
            friendName={chatRoom.name}
            lastMessage={chatRoom.lastMessage}
            selected={selectedChat?.chatRoomId === chatRoom.chatRoomId}
            onClick={() => {
              setSelectedChat(chatRoom);
              fetchMessages(chatRoom.chatRoomId);
            }}
          />
        ))}
      </div>

      {/* Chat Content */}
      <div className="w-2/3 flex flex-col bg-white rounded-tl-2xl shadow-lg">
        {selectedChat && (
          <>
            {/* Chat Header */}
            <div className="flex items-center p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-tl-2xl">
              <img
                src={selectedChat.avatar}
                alt="Avatar"
                className="w-10 h-10 rounded-full mr-4 shadow-md"
              />
              <div>
                <h2 className="text-lg font-bold">{selectedChat.name}</h2>
                <span className="text-sm opacity-75">Active now</span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.chatMessageId}
                  message={msg}
                  isOwn={msg.userSendId === myId}
                />
              ))}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Message Input */}
            <div className="p-4 bg-gray-100 border-t flex items-center space-x-4">
              <label className="flex items-center cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm3 10l3-4 3 4 4-5 3 4.5H8z" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  multiple
                />
              </label>
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 p-3 rounded-full bg-white border shadow-inner focus:outline-none focus:ring focus:ring-blue-200"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
              />
              <button
                className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg"
                onClick={handleSendMessage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
