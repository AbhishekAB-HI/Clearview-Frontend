import { Types } from "mongoose";

export interface IComment {
  // Define the structure of a comment if needed
  // Assuming you might have fields like text, user, createdAt, etc.
  _id: Types.ObjectId;
  user: Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IReportPost {
  postId: Types.ObjectId; // ID of the post being reported
  reportReason: string; // Reason for reporting
  reporter: {
    _id: Types.ObjectId; // ID of the reporter
    name: string; // Name of the reporter
  };
}


export interface IReportpost {
  _id: Types.ObjectId;
  postId: Types.ObjectId;
  postreportReason: string;
  userinfo: Types.ObjectId;
  postcontent: string;
  postimage: string;
  postVideo: string;
  postedBy: string | undefined;
  reportedBy: string | undefined;
}


export interface IPost {
  _id: Types.ObjectId; // Unique identifier for the post
  user: Types.ObjectId; // ID of the user who created the post
  description: string; // Description of the post
  text: string; // Text content of the post
  image: string[]; // Array of image URLs
  videos: string[]; // Array of video URLs
  comments: IComment[]; // Array of comments
  likeCount: number; // Number of likes
  likes: Types.ObjectId[]; // Array of user IDs who liked the post
  reportPost: boolean; // Indicates if the post is reported
  BlockPost: boolean; // Indicates if the post is blocked
  createdAt: Date; // Creation date of the post
  updatedAt: Date; // Last updated date of the post
}


