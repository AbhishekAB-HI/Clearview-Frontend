
import io, { Socket } from "socket.io-client";
import { ActiveUsersType, IAllNotification, IUser } from "../../Interfaces/Interface";

const ENDPOINT = "https://backend.trendhub.cloud";
let socket: Socket | undefined; // Define socket as optional


export const initilizeSocket = (userToc: string): Socket => {
  socket = io(ENDPOINT);
  socket.emit("setup", userToc);
  return socket;
};

export const joinChatRoom = (chatId: string) => {
  if (socket) socket.emit("join chat", chatId);
};

export const sendMessage = (message: any) => {
  if (socket) socket.emit("new message", message);

};

export const sendfollow = (
  followuserId: string,
  logedId: IUser,
  followingUser: IAllNotification
) => {
  if (socket) socket.emit("following", followuserId, logedId, followingUser);
};

export const sendPostNotify = (userInfo: IUser) => {
  if (socket) socket.emit("newpost", userInfo);
};



export const getfollowNotify = (callback: (logedId: any) => void) => {
  if (!socket) {
    console.error("Socket is not initialized. Call initilizeSocket first.");
    return;
  }
  socket.on("follow received", callback);
};

export const handleTyping = (chatId: string) => {
  if (socket) socket.emit("typing", chatId);
};

export const stopTyping = (chatId: string) => {
  if (socket) socket.emit("stop typing", chatId);
};

export const ActiveUsershere = (setActiveUsers: React.Dispatch<React.SetStateAction<ActiveUsersType[]>>
) => {
  if (socket) {
    socket.on("get-users", (users: ActiveUsersType[]) => {
      setActiveUsers(users);
    });
  }
};

export const LogoutActiveUsershere = (
  setActiveUsers: React.Dispatch<React.SetStateAction<ActiveUsersType[]>>
) => {
  if (socket) {
    socket.emit("get-users", (users: ActiveUsersType[]) => {
      setActiveUsers(users);
    });
  }
};

 export const logoutUser = (userId: string) => {
  if(socket)socket.emit("logout", userId);
 };

export const setupOnMessageReceived = (callback: (message: any) => void) => {
  if (socket){
 socket.on("message received", callback);
  }
};


