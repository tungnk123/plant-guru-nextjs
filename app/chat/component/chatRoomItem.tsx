import { motion } from 'framer-motion';

interface ChatRoomItemProps {
  friendAvatarLink: string;
  friendName: string;
  lastMessage: string;
  selected: boolean;
  onClick: () => void;
}

const ChatRoomItem = ({
  friendAvatarLink,
  friendName,
  lastMessage,
  selected,
  onClick,
}: ChatRoomItemProps) => {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      onClick={onClick}
      className={`
        p-3 rounded-xl cursor-pointer transition-all duration-300
        ${selected 
          ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-r-4 border-green-500' 
          : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-50/50'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={friendAvatarLink}
            alt={friendName}
            className={`
              w-12 h-12 rounded-full object-cover
              ${selected 
                ? 'ring-2 ring-green-500 ring-offset-2' 
                : 'ring-2 ring-gray-100 hover:ring-green-500/50'
              }
              transition-all duration-300
            `}
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 
            rounded-full ring-2 ring-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`
              font-medium truncate
              ${selected 
                ? 'text-green-700' 
                : 'text-gray-700'
              }
            `}>
              {friendName}
            </h3>
            <span className="text-xs text-gray-400">12:30</span>
          </div>

          <p className={`
            text-sm truncate
            ${selected 
              ? 'text-green-600' 
              : 'text-gray-500'
            }
          `}>
            {lastMessage}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatRoomItem;
