 import mongoose, {ObjectId, Types} from 'mongoose'
 
 export  interface IPost {
   _id: string;
   user: any;
   description: string;
   category: string;
   image: string;
   videos: string;
   likeCount: number;
   BlockPost: boolean;
   LikeStatement: boolean;
   likes: IUser[];
   comments: IComment[];
   userName: string;
   createdAt:any
 }

 export interface IComment {
  user: any;
  content: string;
  userName: string;
  timestamp: Date;
  parentComment: string;
  _id: string;
}

export interface ReplyingToState {
  postId: string;
  commentId: string;
}

export interface CreatePostHomeModalProps {
  togglepostModal: () => void;
  updatehomeState: (page:number) => void;
  userid: string | null;
}

export interface CreatePostModalProps {
  togglepostModal: () => void;
  updateState: (page: number) => void;
  userid: string | null;
}

export  interface userInfo {
  image: string;
  name?: string;
  email?: string;
  _id?: any;
}

export interface EditPostModalProps {
  toggleeditpostModal: () => void;  
  updateState: () => void;
  postid: string | null;
}


export interface EditProfileModalProps {
  toggleModal: () => void;
  updateProfileState: () => void;
  userid: string | null;
}


export interface IUser {
  _id: any;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  isAdmin: boolean;
  isVerified?: boolean;
  createdAt?: any;
  updatedAt?: Date;
  image: string;
  followers: IUser[];
  following: IUser[];
  blockedUser: IUser[];
  reportedUser: IReportUser[];
  lastSeen: any;

}

export interface IReportUser {
  _id:any;
  userId: Types.ObjectId;
  reportReason: string;
  Reportedby: string;
  userimage:string
  username:string
}



export interface IUser1 extends Document {
  _id: mongoose.Types.ObjectId;
}

 export interface ActiveUsersType {
   userId: string;
   socketId: string;
 }








export interface FormattedChat {
  _id:any
  chatName: string;
  lastMessage: string;
  lastMessageTime: any;
  userId:string

}


export interface Message extends Document {
  sender: mongoose.Types.ObjectId;
  content: string;
  image: string;
  videos: string;
  chat: mongoose.Types.ObjectId;
  readBy: mongoose.Types.ObjectId[];
}

export interface Chats {
  _id: ObjectId;
  chatName: string;
  isGroupchat: boolean;
  users: IUser[];
  latestMessage: Message;
  groupAdmin: IUser[];
}


export interface  Notification extends Document {
  sender: any;
  content: string;
  image: string;
  videos: string;
  isRead: boolean;
  chat: mongoose.Types.ObjectId;
  readBy: mongoose.Types.ObjectId[];
}







export interface IFollowNotification {
  userId: ObjectId;
  userName: string;
  image: string;
  email: string;
}

export interface IPostNotification {
  userId: ObjectId;
  postusername: string;
  image: ObjectId;
  content: string;
  email: string;
}

export interface IAllNotification {
  Follownotifications: IFollowNotification[];
  PostNotifications: IPostNotification[];
  LikeNotifications: ILikeNotifications[];
  createdAt?: Date;
  updatedAt?: Date;
  followuserId: string;
  image?: string;
  name?: string;
  userName?:string
}

export interface LikeNotification {
  Follownotifications: IFollowNotification[];
  PostNotifications: IPostNotification[];
  LikeNotifications: ILikeNotifications[];
  createdAt?: Date;
  updatedAt?: Date;
  likeduserId: string;
  postimage: string;
  postcontent: string;
  likedusername:string
}



export interface postinfos {
  Follownotifications: IFollowNotification[];
  PostNotifications: IPostNotification[];
  LikeNotifications: ILikeNotifications[];
  createdAt?: Date;
  updatedAt?: Date;
  followuserId: string;
  image: string;
  postUsername:string
}











export interface ILikeNotifications {
  postId: unknown;
  postuserId: unknown;
  likedusername: string;
  postcontent: string;
  userimage: string;
  postimage: string;
  email: string;
  likeduserId: unknown;
  likedstatus: unknown;
}

export interface YourComponentProps {
  userToken: string;
  users: any[];
}



export interface ICounts {
  totalUsers: number;
  totalPosts: number;
  recentPosts: Ipostcount[];
}

export interface Ipostcount {
  description: string;
  likeCount: number;
  totalLikes: number;
  totalComments: number;
}