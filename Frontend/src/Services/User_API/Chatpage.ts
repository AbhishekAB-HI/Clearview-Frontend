import axios from "axios";
import { API_MESSAGE_URL, CONTENT_TYPE_MULTER } from "../../Components/Constants/Constants";
import axiosClient from "../Axiosinterseptor";



export const getuserdetails = async (chatId:string) => {
  const { data } = await axios.get(`${API_MESSAGE_URL}/getuserimage/${chatId}`);
   if (data.message === "Get user id") {
     return {
       success: true,
       userdetails: data.userinfo,
     };
   } else {
     return { success: false };
   }
};

export const findAllmessage = async (dataId: string) => {
   const { data } = await axiosClient.get(`${API_MESSAGE_URL}/${dataId}`);
  if (data.message === "Get all messages") {
    return {
      success: true,
      getmessages: data.Allmessage,
    };
  } else {
    return { success: false };
  }
};





export const Sendmessages = async (formData: FormData) => {
 const { data } = await axiosClient.post(`${API_MESSAGE_URL}`, formData, {
   headers: {
     "Content-Type": CONTENT_TYPE_MULTER,
   },
 });
  if (data) {
    return {
      success: true,
      getData: data
    };
  } else {
    return { success: false };
  }
};



export const getUserIdData = async (usertocken: any) => {
    const { data } = await axios.get(
      `${API_MESSAGE_URL}/getuserId/${usertocken}`
    );
  if (data.message === "User id found") {
    return {
      success: true,
      useriD: data.userId,
    };
  } else {
    return { success: false };
  }
};


export const getuserid = async (usertocken: any) => {
   const { data } = await axiosClient.get(
     `${API_MESSAGE_URL}/getuserid/${usertocken}`
   );
  if (data.message === "User id found") {
    return {
      success: true,
      useriD: data.userId,
    };
  } else {
    return { success: false };
  }
};


export const chechuserblocking = async (userId: string, LogedUserId: string) => {
        const { data } = await axiosClient.patch(`${API_MESSAGE_URL}/blockuser`,{ userId, LogedUserId });
  if (data.message === "User blocked") {
    return {
      success: true,
      userStatus: data.userStatus,
    };
  } else {
    return { success: false };
  }
};




export const gettheuserinchat = async (chatId: string | undefined) => {
     const { data } = await axios.get(`${API_MESSAGE_URL}/getuserid/${chatId}`);
  if (data.message == "Get user id") {
    return {
      success: true,
      userinfo: data.userinfo,
    };
  } else {
    return { success: false };
  }
};



