import React from 'react'

interface ChatRoomItemProps {
  friendAvatarLink: string;
  friendName: string;
  lastMessage: string;
  onClick: () => void;
  selected: boolean;
}

const ChatRoomItem: React.FC<ChatRoomItemProps> = ({ friendAvatarLink, friendName, lastMessage, onClick, selected }) => {
  return (
    <div
      className={`flex items-center p-4 mb-2 rounded-lg cursor-pointer ${
        selected ? 'bg-gray-500' : 'bg-gray-400 hover:bg-gray-600'
      }`}
      onClick={onClick}
    >
      <img src={friendAvatarLink} alt="Avatar" className="w-10 h-10 rounded-full mr-3" />
      <div>
        <div className="font-bold text-white">{friendName}</div>
        <div className="text-sm text-gray-300">{lastMessage}</div>
      </div>
    </div>
  )
}

export default ChatRoomItem
