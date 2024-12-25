"use client";
import ChatRoomItem from '@/app/chat/component/chatRoomItem';
import { useState, useRef, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';

// Define a type for the message objects
interface Message {
  chatMessageId: string;
  userSendId: string;
  avatar: string;
  message: string | null;
  mediaLink: string | null;
  sendDate: string;
  type: 'Text' | 'Media';
}

const Page = () => {
  const myId = 'd9164dca-c996-404f-a5a1-f1f87a6ce875';
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const prevMessageCountRef = useRef<number>(0);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await fetch(`https://un-silent-backend-develop.azurewebsites.net/api/chat/users/${myId}/chatRooms`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setChatRooms(data);
        if (data.length > 0) {
          setSelectedChat(data[0]);
          fetchMessages(data[0].chatRoomId);
        }
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
      }
    };

    fetchChatRooms();
  }, [myId]);

  useEffect(() => {
    // Set up SignalR connection
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('https://un-silent-backend-develop.azurewebsites.net/chatHub', {withCredentials: false})
      .withAutomaticReconnect()
      .build();

    connection.on('NewMessage', () => {
      if (selectedChat) {
        fetchMessages(selectedChat.chatRoomId);
      }
    });

    connection.start()
      .then(() => console.log('Connected to SignalR hub'))
      .catch(err => console.error('Error connecting to SignalR hub:', err));

    // Cleanup function to stop the connection when the component unmounts
    return () => {
      connection.stop().then(() => console.log('Disconnected from SignalR hub'));
    };
  }, [selectedChat]);

  const fetchMessages = async (chatRoomId) => {
    try {
      const response = await fetch(`https://un-silent-backend-develop.azurewebsites.net/api/chat/${chatRoomId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !selectedChat) return;

    const messageData = {
      userSendId: myId,
      userReceiveId: selectedChat.userId,
      message: newMessage,
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

      // Clear the input field
      setNewMessage('');

      // Fetch updated messages
      fetchMessages(selectedChat.chatRoomId);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files as FileList);
    const imageLinks = [];

    // Upload each image to Imgur
    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('https://api.imgur.com/3/image', {
          method: 'POST',
          headers: {
            'Authorization': 'Client-ID 546c25a59c58ad7'
          },
          body: formData
        });

        const data = await response.json();
        if (data.success) {
          imageLinks.push(data.data.link);
        } else {
          console.error('Failed to upload image:', data);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    console.log(imageLinks);

    // Send image links to your server
    if (imageLinks.length > 0 && selectedChat) {
      const imageData = {
        userSendId: myId,
        userReceiveId: selectedChat.userId,
        images: imageLinks
      };

      try {
        const response = await fetch('https://un-silent-backend-develop.azurewebsites.net/api/chat/sendMedia', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(imageData),
        });

        if (!response.ok) {
          throw new Error('Failed to send images');
        }

        console.log('send image success');

        // Fetch updated messages
        fetchMessages(selectedChat.chatRoomId);
      } catch (error) {
        console.error('Error sending images:', error);
      }
    }
  };

  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
    prevMessageCountRef.current = messages.length;
  }, [messages]);

  // Filter chat rooms based on search input
  const filteredChatRooms = chatRooms.filter(chatRoom =>
    chatRoom.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className='w-full h-screen  flex'>
      <div className='w-1/3 bg-yellow-50 p-4 overflow-y-auto'>
        <h1 className='text-xl font-bold mb-4'>CHAT</h1>
        <div className='relative mb-4'>
          <input
            type='text'
            placeholder='Search...'
            className='w-full p-2 border rounded bg-yellow-100'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
        </div>
        {filteredChatRooms.map((chatRoom) => (
          <ChatRoomItem
            key={chatRoom.chatRoomId}
            friendAvatarLink={chatRoom.avatar}
            friendName={chatRoom.name}
            lastMessage={chatRoom.isOnline ? 'Online' : 'Offline'}
            onClick={() => {
              setSelectedChat(chatRoom);
              fetchMessages(chatRoom.chatRoomId);
            }}
          />
        ))}
      </div>
      <div className='w-2/3 bg-white flex flex-col'>
        {selectedChat && (
          <>
            <div className='flex items-center p-4 border-b'>
              <img src={selectedChat.avatar} alt='Avatar' className='w-10 h-10 rounded-full mr-3' />
              <div>
                <div className='font-bold'>{selectedChat.name}</div>
                <div className='text-sm text-gray-500'>Active</div>
              </div>
            </div>
            <div className='flex-1 p-4 overflow-y-auto'>
              {messages.map((msg) => (
                <div key={msg.chatMessageId} className={`flex ${msg.userSendId === myId ? 'justify-end' : 'justify-start'} space-x-2 mt-4`}>
                  {msg.userSendId !== myId && (
                    <img src={msg.avatar} alt='Avatar' className='w-8 h-8 bg-gray-300 rounded-full' />
                  )}
                  {msg.type === 'Text' ? (
                    <div className={`max-w-xs bg-gray-200 rounded-lg p-2 ${msg.userSendId === myId ? 'bg-blue-200 text-right' : 'bg-gray-200 text-left'}`}>
                      {msg.message}
                    </div>
                  ) : (
                    <img src={msg.mediaLink} alt='Media' className='max-w-xs rounded-lg' />
                  )}
                  {msg.userSendId === myId && (
                    <img src={msg.avatar} alt='Avatar' className='w-8 h-8 bg-gray-300 rounded-full' />
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </>
        )}
        <div className='p-4 border-t flex items-center'>
          <label className='flex items-center cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600 flex items-center justify-center" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm3 10l3-4 3 4 4-5 3 4.5H8z"/>
            </svg>
            <input
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleFileChange}
              multiple
            />
          </label>
          <input
            type='text'
            placeholder='Type a message...'
            className='flex-1 p-2 border rounded-full ml-2'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <button className='ml-2' onClick={handleSendMessage}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
