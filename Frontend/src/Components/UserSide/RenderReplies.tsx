import React, { useState } from "react";
import axiosClient from "../../Services/Axiosinterseptor";
import axios from "axios";
import toast from "react-hot-toast";

interface ReplyingToState {
  postId: string;
  commentId: string;
}

interface IComment {
  user: any; // or a more specific type
  content: string;
  userName: string;
  timestamp: Date;
  parentComment: string;
  _id: string;
}




interface RenderRepliesProps {
  post: IPost;
  parentCommentId: string;
  saveid: string;
  replyingTo: ReplyingToState | null;
  replyContent: string;
  handleReply: (postId: string, commentId: string) => void;
  handleReplySubmit: (
    postId: string,
    commentId: string,
    userId: string,
    username: string
  ) => Promise<void>;
  setReplyContent: React.Dispatch<React.SetStateAction<string>>;
}

interface IPost {
  _id: string;
  user: any;
  description: string;
  image: string;
  videos: string;
  likeCount: number;
  LikeStatement: boolean;
  likes: string[];
  comments: IComment[];
  userName: string;
}


interface ChildComponentProps {
  post: any;
  saveid: string;
  UpdateLikepost: () => void;
  parentCommentId: string;
  replyingTo: ReplyingToState | null;
  replyContent: string;
  handleReply: (postId: string, commentId: string) => void;
  setReplyContent: React.Dispatch<React.SetStateAction<string>>;
}

const RenderReplies: React.FC<RenderRepliesProps> = ({
  post,
  parentCommentId,
  saveid,
  replyingTo,
  replyContent,
  handleReply,
  handleReplySubmit,
  setReplyContent,
}: {
  post: IPost;
  parentCommentId: any;
  saveid: string;
  replyingTo: ReplyingToState | null;
  replyContent: string;
  handleReply: (postId: string, commentId: string) => void;
  handleReplySubmit: (
    postId: string,
    commentId: string,
    userId: string,
    username: string
  ) => Promise<void>;
  setReplyContent: React.Dispatch<React.SetStateAction<string>>;
}) => {
     

  return post.comments
    .filter((reply) => reply.parentComment === parentCommentId)
    .map((reply, replyIndex) => (
      <div key={replyIndex} className=" mt-1">
        <div className="flex items-start mb-1">
          <img
            src={reply.user.image}
            alt="User avatar"
            className="w-6 h-6 rounded-full mr-3"
          />
          <div>
            <p className="font-semibold">
              <span
                style={{ fontSize: "15px", fontWeight: "" }}
                className="text-blue-600"
              >
                {reply.userName} {"   :  "}
              </span>
              <span
                style={{ fontSize: "13px", fontWeight: "lighter" }}
                className="text-white"
              >
                {reply.content}
              </span>
            </p>
            <small style={{ fontSize: "10px" }} className="text-gray-500">
              Posted on:{" "}
              <span>{new Date(reply.timestamp).toLocaleDateString()}</span>
            </small>
            <small className="ml-2" style={{ color: "blue", fontSize: "10px" }}>
              <button onClick={() => handleReply(post._id, reply._id)}>
                Reply
              </button>
            </small>

            {/* Reply input area for nested replies */}
            {replyingTo?.commentId === reply._id && (
              <div className="mt-2 ml-10">
                <textarea
                  className="bg-gray-700 text-white w-full p-2 rounded-md"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder={`Replying to ${reply.userName}...`}
                />
                <button
                  className="bg-blue-600 text-white px-4 py-1 mt-2 rounded-md"
                  onClick={() =>
                    handleReplySubmit(
                      post._id,
                      reply._id,
                      saveid,
                      reply.userName
                    )
                  }
                >
                  Submit Reply
                </button>
              </div>
            )}

            <RenderReplies
              post={post}
              parentCommentId={reply._id}
              saveid={saveid}
              replyingTo={replyingTo}
              replyContent={replyContent}
              handleReplySubmit={handleReplySubmit}
              handleReply={handleReply}
              setReplyContent={setReplyContent}
            />
          </div>
        </div>
      </div>
    ));
};




const CommentSection: React.FC<ChildComponentProps> = ({post,saveid,UpdateLikepost }) => {
  const [replyingTo, setReplyingTo] = useState<ReplyingToState | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleReply = (postId: string, commentId: string) => {
    if (replyingTo?.commentId === commentId) {
      setReplyingTo(null);
    } else {
      setReplyingTo({ postId, commentId });
    }
  };

  const handleReplySubmit = async (
    postId: string,
    commentId: string,
    userId: string,
    username: string
  ) => {


    try {
      const { data } = await axiosClient.post(
        "http://localhost:3000/api/user/replycomment",
        {
          postId,
          commentId,
          replyContent,
          userId,
          username,
        }
      );

      if (data.message === "updated succefully") {
        UpdateLikepost();
        setReplyContent("");
        setReplyingTo(null);
      }else{
        toast.error("updated failed");
      }
    } catch (error) {
        if (axios.isAxiosError(error)) {
          if (!error.response) {
            toast.error(
              "Network error. Please check your internet connection."
            );
          } else {
            const status = error.response.status;
            if (status === 404) {
              toast.error("Posts not found.");
            } else if (status === 500) {
              toast.error("Server error. Please try again later.");
            } else {
              toast.error("Something went wrong.");
            }
          }
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
        console.log("Error fetching posts:", error);
    }
  };

  return (
    <div className="mt-4">
      {post.comments.length > 0 ? (
        post.comments
          .filter((comment:any) => !comment.parentComment)
          .map((comment:any, index:number) => (
            <div
              key={index}
              className="border-b text-left border-gray-500 py-2 flex items-start"
            >
              <img
                src={comment.user.image}
                alt="User avatar"
                className="w-8 h-8 rounded-full mr-4"
              />
              <div>
                <p
                  style={{ fontSize: "15px", fontWeight: "" }}
                  className="font-semibold"
                >
                  {comment.user.name}
                </p>
                <p style={{ fontSize: "14px" }} className="text-gray-300">
                  {comment.content}
                </p>
                <small style={{ fontSize: "10px" }} className="text-gray-500">
                  Comment on:{" "}
                  <span>
                    {new Date(comment.timestamp).toLocaleDateString()}
                  </span>
                </small>
                <small
                  className="ml-2"
                  style={{ color: "blue", fontSize: "10px" }}
                >
                  <button onClick={() => handleReply(post._id, comment._id)}>
                    Reply
                  </button>
                </small>
                <small
                  className="ml-2"
                  style={{ color: "blue", fontSize: "10px" }}
                >
                 
                </small>
                {replyingTo?.commentId === comment._id && (
                  <div className="mt-2 ml-10">
                    <textarea
                      className="bg-gray-700 text-white w-full p-2 rounded-md"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={`Replying to ${comment.user.name}...`}
                    />
                    <button
                      className="bg-blue-600 text-white px-4 py-1 mt-2 rounded-md"
                      onClick={() =>
                        handleReplySubmit(
                          post._id,
                          comment._id,
                          saveid,
                          comment.user.name
                        )
                      }
                    >
                      Submit Reply
                    </button>
                  </div>
                )}
              
                 <RenderReplies
                  post={post}
                  parentCommentId={comment._id}
                  saveid={saveid}
                  replyingTo={replyingTo}
                  replyContent={replyContent}
                  handleReply={handleReply}
                  handleReplySubmit={handleReplySubmit}
                  setReplyContent={setReplyContent}
                />
                 
              </div>
            </div>
          ))
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default CommentSection;
