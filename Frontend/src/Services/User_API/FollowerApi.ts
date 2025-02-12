import { API_CHAT_URL, API_USER_URL } from "../../Components/Constants/Constants";
import axiosClient from "../Axiosinterseptor";



export const getuserinfomations = async () => {
  const { data } = await axiosClient.get(`${API_USER_URL}/getUserinfo`);
  if (data.message === "get User data") {
    return {
      success: true,
      userdetails: data.userDetails,
      useridfound: data.userIdget,
    };
  } else {
    return { success: false };
  }
};



export const findFollowers = async (currentPage:number, postsPerPage:number) => {
    const { data } = await axiosClient.get(`${API_CHAT_URL}/findfollowers?page=${currentPage}&limit=${postsPerPage}`);
  if (data.message === "Get all followers") {
    return {
      success: true,
      users: data.users,
      totalfollowers: data.totalfollowers,
    };
  } else {
    return { success: false };
  }
};








export const findfollowing = async (currentPage: number, postsPerPage: number) => {
     const { data } = await axiosClient.get(
       `${API_CHAT_URL}/findfollowing?page=${currentPage}&limit=${postsPerPage}`
     );
  if (data.message === "Other users found") {
    return {
      success: true,
      followusers: data.followusers,
      totalfollow: data.totalfollow,
    };
  } else {
    return { success: false };
  }
};








export const followuser = async (userId: string, LoguserId: string) => {
const { data } = await axiosClient.post(`${API_CHAT_URL}/followuser`, {userId, LoguserId, });
  if (data.message === "followed users") {
    return {
      success: true,
      usersinfos: data.Userinfo,
      followingUsers: data.followingUser,
    };
  } else {
    return { success: false };
  }
};





























