import React, { useState, useEffect } from "react";
import { fetchComments, postComment, upvoteComment, downvoteComment } from "@/app/api/commentService"; 

interface CommentData {
  commentId: string;
  userId: string;
  name: string;
  avatar: string;
  message: string;
  createdAt: string;
  numberOfUpvote: number;
  numberOfDevote: number;
  hasUpvoted: boolean;
  hasDevoted: boolean;
  replies?: CommentData[];
}

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyBoxes, setReplyBoxes] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const loadComments = async () => {
      try {
        const comments = await fetchComments(postId);
        setComments(comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    loadComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const addedComment = await postComment(postId, newComment);
        setComments((prevComments) => [...prevComments, addedComment]);
        setNewComment("");
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleReplyToggle = (commentId: string) => {
    setReplyBoxes((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleUpvote = async (commentId: string) => {
    try {
      const { numberOfUpvotes, numberOfDevotes } = await upvoteComment(commentId);
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.commentId === commentId
            ? {
                ...comment,
                numberOfUpvote: numberOfUpvotes,
                numberOfDevote: numberOfDevotes,
                hasUpvoted: !comment.hasUpvoted,
                hasDevoted: false,
              }
            : comment
        )
      );
    } catch (error) {
      console.error("Error upvoting comment:", error);
    }
  };

  const handleDownvote = async (commentId: string) => {
    try {
      const { numberOfUpvotes, numberOfDevotes } = await downvoteComment(commentId);
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.commentId === commentId
            ? {
                ...comment,
                numberOfUpvote: numberOfUpvotes,
                numberOfDevote: numberOfDevotes,
                hasDevoted: !comment.hasDevoted,
                hasUpvoted: false,
              }
            : comment
        )
      );
    } catch (error) {
      console.error("Error downvoting comment:", error);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center space-x-3 mb-4">
        <img
          src="/default-avatar.png"
          alt="User avatar"
          className="h-8 w-8 rounded-full"
        />
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 p-2 border border-gray-300 rounded-full text-sm"
        />
        <button
          onClick={handleAddComment}
          className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm"
        >
          Add comment
        </button>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.commentId} className="flex space-x-3">
            <img
              src={comment.avatar}
              alt={`${comment.name} avatar`}
              className="h-8 w-8 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{comment.name}</h4>
                <span className="text-gray-500 text-sm">{comment.createdAt}</span>
              </div>
              <p className="text-sm text-gray-700">{comment.message}</p>
              <div className="mt-2 flex space-x-3 text-sm text-gray-500">
                <button
                  onClick={() => handleUpvote(comment.commentId)}
                  className={`hover:text-blue-500 ${comment.hasUpvoted ? "text-blue-500 font-bold" : ""}`}
                >
                  ▲
                </button>
                <span>{comment.numberOfUpvote}</span>
                <button
                  onClick={() => handleDownvote(comment.commentId)}
                  className={`hover:text-red-500 ${comment.hasDevoted ? "text-red-500 font-bold" : ""}`}
                >
                  ▼
                </button>
                <button
                  onClick={() => handleReplyToggle(comment.commentId)}
                  className="hover:text-blue-500"
                >
                  Reply
                </button>
              </div>
              {replyBoxes[comment.commentId] && (
                <div className="ml-8 mt-2">
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    className="flex-1 p-2 border border-gray-300 rounded-full text-sm"
                  />
                  <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full text-sm">
                    Reply
                  </button>
                </div>
              )}
              {comment.replies && comment.replies.map((reply) => (
                <div key={reply.commentId} className="ml-8 mt-2 flex space-x-3">
                  <img
                    src={reply.avatar}
                    alt={`${reply.name} avatar`}
                    className="h-8 w-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{reply.name}</h4>
                      <span className="text-gray-500 text-sm">{reply.createdAt}</span>
                    </div>
                    <p className="text-sm text-gray-700">{reply.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
