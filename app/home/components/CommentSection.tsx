import React, { useState, useEffect } from "react";
import { fetchComments, postComment, upvoteComment, downvoteComment, postReply, fetchReplies } from "@/app/api/commentService"; 
import { fetchUserById } from "@/app/admin/api/user";
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [replyMessages, setReplyMessages] = useState<{ [key: string]: string }>({});
  const [replies, setReplies] = useState<{ [key: string]: CommentData[] }>({});
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadUserData = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const userData = await fetchUserById(userId);
          setUserAvatar(userData.avatar);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsLoggedIn(false);
        }
      }
    };

    loadUserData();
  }, []);

  const loadComments = async () => {
    try {
      const comments = await fetchComments(postId);
      setComments(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const isUserLoggedIn = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return false;

    try {
      const user = await fetchUserById(userId);
      return !!user;
    } catch {
      return false;
    }
  };

  const handleAddComment = async () => {
    if (!(await isUserLoggedIn())) {
      toast({
        title: "Login Required",
        description: "Please log in to add a comment.",
        variant: "destructive",
      });
      return;
    }

    if (newComment.trim()) {
      try {
        await postComment(postId, newComment);
        setNewComment("");
        loadComments(); // Reload comments after adding a new one
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleReplyToggle = async (commentId: string) => {
    const isOpen = replyBoxes[commentId];
    setReplyBoxes((prev) => ({ ...prev, [commentId]: !isOpen }));
    if (!isOpen && !replies[commentId]) {
      try {
        const fetchedReplies = await fetchReplies(postId, commentId);
        setReplies((prev) => ({ ...prev, [commentId]: fetchedReplies }));
      } catch (error) {
        console.error("Error fetching replies:", error);
      }
    }
  };

  const handleReplyChange = (commentId: string, message: string) => {
    setReplyMessages((prev) => ({ ...prev, [commentId]: message }));
  };

  const handleAddReply = async (parentCommentId: string) => {
    if (!(await isUserLoggedIn())) {
      toast({
        title: "Login Required",
        description: "Please log in to reply to a comment.",
        variant: "destructive",
      });
      return;
    }

    const message = replyMessages[parentCommentId];
    if (message.trim()) {
      try {
        await postReply(parentCommentId, message);
        setReplyMessages((prev) => ({ ...prev, [parentCommentId]: "" }));
        const updatedReplies = await fetchReplies(postId, parentCommentId);
        setReplies((prev) => ({ ...prev, [parentCommentId]: updatedReplies }));
      } catch (error) {
        console.error("Error adding reply:", error);
      }
    }
  };

  const handleUpvote = async (commentId: string) => {
    if (!(await isUserLoggedIn())) {
      toast({
        title: "Login Required",
        description: "Please log in to upvote a comment.",
        variant: "destructive",
      });
      return;
    }

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
      setReplies((prevReplies) => {
        const updatedReplies = { ...prevReplies };
        for (const key in updatedReplies) {
          updatedReplies[key] = updatedReplies[key].map((reply) =>
            reply.commentId === commentId
              ? {
                  ...reply,
                  numberOfUpvote: numberOfUpvotes,
                  numberOfDevote: numberOfDevotes,
                  hasUpvoted: !reply.hasUpvoted,
                  hasDevoted: false,
                }
              : reply
          );
        }
        return updatedReplies;
      });
    } catch (error) {
      console.error("Error upvoting comment:", error);
    }
  };

  const handleDownvote = async (commentId: string) => {
    if (!(await isUserLoggedIn())) {
      toast({
        title: "Login Required",
        description: "Please log in to downvote a comment.",
        variant: "destructive",
      });
      return;
    }

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
      setReplies((prevReplies) => {
        const updatedReplies = { ...prevReplies };
        for (const key in updatedReplies) {
          updatedReplies[key] = updatedReplies[key].map((reply) =>
            reply.commentId === commentId
              ? {
                  ...reply,
                  numberOfUpvote: numberOfUpvotes,
                  numberOfDevote: numberOfDevotes,
                  hasDevoted: !reply.hasDevoted,
                  hasUpvoted: false,
                }
              : reply
          );
        }
        return updatedReplies;
      });
    } catch (error) {
      console.error("Error downvoting comment:", error);
    }
  };

  return (
    <div className="mt-4">
      {isLoggedIn && (
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={userAvatar || '/default-avatar.png'}
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
      )}

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
                <>
                  <div className="ml-8 mt-2">
                    <input
                      type="text"
                      value={replyMessages[comment.commentId] || ""}
                      onChange={(e) => handleReplyChange(comment.commentId, e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-1 p-2 border border-gray-300 rounded-full text-sm"
                    />
                    <button
                      onClick={() => handleAddReply(comment.commentId)}
                      className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full text-sm"
                    >
                      Reply
                    </button>
                  </div>
                  {replies[comment.commentId] && replies[comment.commentId].map((reply) => (
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
                        <div className="mt-2 flex space-x-3 text-sm text-gray-500">
                          <button
                            onClick={() => handleUpvote(reply.commentId)}
                            className={`hover:text-blue-500 ${reply.hasUpvoted ? "text-blue-500 font-bold" : ""}`}
                          >
                            ▲
                          </button>
                          <span>{reply.numberOfUpvote}</span>
                          <button
                            onClick={() => handleDownvote(reply.commentId)}
                            className={`hover:text-red-500 ${reply.hasDevoted ? "text-red-500 font-bold" : ""}`}
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
