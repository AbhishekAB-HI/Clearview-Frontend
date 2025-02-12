import {  createSlice } from "@reduxjs/toolkit";

 interface IUser extends Document {
  _id: any;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  isAdmin: boolean;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  image?: string;
}





 interface Chats {
  _id: any;
  chatName: string;
  isGroupchat: boolean;
  users: IUser[];
  latestMessage: string;
  groupAdmin: IUser[];
}


type userstate = {
  userTocken: string;
  userDetils: string;
  AdminTocken: string;
  SelectedChat: any;
  userRefreshTocken: string;
  chats: Chats[];
  Notification: Chats[];
};

const stateinfo: userstate = {
  userTocken: localStorage.getItem("usertocken") || "",
  SelectedChat: (() => {
    try {
      return JSON.parse(localStorage.getItem("savedata") || "{}");
    } catch (error) {
      console.error("Error parsing savedata from localStorage:", error);
      return {};
    }
  })(),
  userRefreshTocken: localStorage.getItem("userRefreshTocken") || "",
  userDetils: localStorage.getItem("userdetails") || "",
  AdminTocken: localStorage.getItem("admintocken") || "",
  chats: [],
  Notification: [],
};


 const userTockeninfo = createSlice({
   name: "Tocken",
   initialState: stateinfo,
   reducers: {
     setUserAccessTocken: (state, action) => {
       const Tocken = action.payload;
       state.userTocken = Tocken;
       localStorage.setItem("usertocken", Tocken);
     },
     setUserRefreshtocken: (state, action) => {
       const refreshTcoken = action.payload;
       state.userRefreshTocken = refreshTcoken;
       localStorage.setItem("userRefreshTocken", refreshTcoken);
     },
     clearuserAccessTocken: (state) => {
       state.userTocken = "";
       state.userRefreshTocken = "";
       localStorage.removeItem("usertocken");
     },
     setUserDatails: (state, action) => {
       const userdetail = action.payload;
       state.userDetils = userdetail;
       localStorage.setItem("userdetails", userdetail);
     },
     setAdminAccessTocken: (state, action) => {
       const Tocken = action.payload;
       state.AdminTocken = Tocken;
       localStorage.setItem("admintocken", Tocken);
     },
     setSelectedChat: (state, action) => {
       const chatdata = action.payload;
       state.SelectedChat = chatdata;
       localStorage.setItem("savedata", JSON.stringify(chatdata));
     },
     clearAdminAccessTocken: (state) => {
       state.AdminTocken = "";
       localStorage.removeItem("admintocken");
     },
     setChats: (state, action) => {
       state.chats = action.payload;
     },
  
     setNotifications: (state, action) => {
       state.Notification = action.payload;
     },
   },
 });


  export const {
    setUserAccessTocken,
    setUserDatails,
    clearuserAccessTocken,
    setAdminAccessTocken,
    clearAdminAccessTocken,
    setUserRefreshtocken,
    setChats,
    setSelectedChat,
    setNotifications,
  } = userTockeninfo.actions;

  export const accesstockenSlice = userTockeninfo.reducer


  



