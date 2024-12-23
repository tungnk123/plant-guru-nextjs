import React from 'react'

export default function ChatRoomItem({ friendAvatarLink, friendName, lastMessage, onClick }) {
  return (
    <div 
      className="flex items-center p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-200 rounded-lg" 
      onClick={onClick}
    >
      <img src={friendAvatarLink} alt={`${friendName}'s avatar`} className="w-10 h-10 rounded-full mr-3 bg-gray-300" />
      <div className="flex flex-col">
        <div className="font-bold mb-1">{friendName}</div>
        <div className="text-gray-600">{lastMessage}</div>
      </div>
    </div>
  )
}
