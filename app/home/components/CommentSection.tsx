import React from "react";

interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  content: string;
  likes: number;
  replies: Comment[];
}

interface CommentSectionProps {
  comments: Comment[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments }) => {
  return (
    <div className="mt-4 space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex space-x-3">
          <img
            src={comment.userAvatar}
            alt={`${comment.userName} avatar`}
            className="h-8 w-8 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{comment.userName}</h4>
              <span className="text-gray-500 text-sm">3y ago</span>
            </div>
            <p className="text-sm text-gray-700">{comment.content}</p>
            <div className="mt-2 flex space-x-3 text-sm text-gray-500">
              <button className="hover:text-blue-500">Reply</button>
              <button className="hover:text-blue-500">Like ({comment.likes})</button>
            </div>
            {comment.replies.length > 0 && (
              <div className="ml-8 mt-4">
                <CommentSection comments={comment.replies} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
