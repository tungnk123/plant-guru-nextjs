import React, { useState, useEffect } from "react";
import { fetchComments } from "@/app/api/postService"; 
import { upvotePost, downvotePost } from "@/app/api/postService";

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
}

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyBoxes, setReplyBoxes] = useState<{ [key: string]: boolean }>({});

  // Fetch comments on component mount
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

  // Handle adding a new comment
  const handleAddComment = () => {
    if (newComment.trim()) {
      // Add the comment here (API call can be added if necessary)
      console.log("Add comment:", newComment);
      setNewComment(""); // Clear the input field
    }
  };

  // Handle reply toggle
  const toggleReplyBox = (commentId: string) => {
    setReplyBoxes((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  // Handle upvote and downvote
  const handleUpvote = async (commentId: string) => {
    try {
      const comment = comments.find((c) => c.commentId === commentId);
      if (!comment) return;
  
      let updatedVotes: any;
      if (comment.hasUpvoted) {
        // If already upvoted, remove upvote
        updatedVotes = await downvotePost(commentId); // Assuming downvote removes upvote when it's already upvoted
        setComments((prev) =>
          prev.map((c) =>
            c.commentId === commentId
              ? { ...c, numberOfUpvote: updatedVotes.numberOfUpvotes, hasUpvoted: false }
              : c
          )
        );
      } else {
        // Add upvote
        updatedVotes = await upvotePost(commentId);
        setComments((prev) =>
          prev.map((c) =>
            c.commentId === commentId
              ? {
                  ...c,
                  numberOfUpvote: updatedVotes.numberOfUpvotes,
                  hasUpvoted: true,
                  hasDevoted: false, // Remove devoted if toggling to upvote
                }
              : c
          )
        );
      }
    } catch (error) {
      console.error("Error toggling upvote:", error);
    }
  };
  
  const handleDownvote = async (commentId: string) => {
    try {
      const comment = comments.find((c) => c.commentId === commentId);
      if (!comment) return;
  
      let updatedVotes: any;
      if (comment.hasDevoted) {
        // If already downvoted, remove downvote
        updatedVotes = await upvotePost(commentId); // Assuming upvote removes downvote when it's already downvoted
        setComments((prev) =>
          prev.map((c) =>
            c.commentId === commentId
              ? { ...c, numberOfUpvote: updatedVotes.numberOfUpvotes, hasDevoted: false }
              : c
          )
        );
      } else {
        // Add downvote
        updatedVotes = await downvotePost(commentId);
        setComments((prev) =>
          prev.map((c) =>
            c.commentId === commentId
              ? {
                  ...c,
                  numberOfUpvote: updatedVotes.numberOfUpvotes,
                  hasDevoted: true,
                  hasUpvoted: false, // Remove upvoted if toggling to downvote
                }
              : c
          )
        );
      }
    } catch (error) {
      console.error("Error toggling downvote:", error);
    }
  };
  

  return (
    <div className="mt-4">
      {/* Add Comment Box */}
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

      {/* Comments Section */}
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
                  onClick={() => toggleReplyBox(comment.commentId)}
                  className="hover:text-blue-500"
                >
                  Reply
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpvote(comment.commentId)}
                    className={`hover:text-blue-500 ${
                      comment.hasUpvoted ? "text-blue-500 font-bold" : ""
                    }`}
                  >
                    ▲
                  </button>
                  <span>{comment.numberOfUpvote}</span>
                  <button
                    onClick={() => handleDownvote(comment.commentId)}
                    className={`hover:text-red-500 ${
                      comment.hasDevoted ? "text-red-500 font-bold" : ""
                    }`}
                  >
                    ▼
                  </button>
                </div>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
