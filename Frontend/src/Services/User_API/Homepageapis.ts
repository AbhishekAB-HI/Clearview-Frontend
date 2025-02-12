import axios from "axios";
import { API_CHAT_URL, API_USER_URL } from "../../Components/Constants/Constants";
import axiosClient from "../Axiosinterseptor";



export const findFollownotifications = async(userId: string) => {

 const { data } = await axiosClient.get( `${API_CHAT_URL}/getfollownotify?id=${userId}`);
  if(data.message === "get all notifications"){
         return {
           success: true,
           follownotifications: data.follownotifications,
         };
  }else{
       return { success: false };
  }

};



export const findAllposthome = async (searchQuery:string, Category:string, currentpage:number) => {
 const { data } = await axios.get(`${API_USER_URL}/allposts?search=${searchQuery}&category=${Category}&page=${currentpage}`
 );
  if (data.message === "getAllpostdetails") {
    return {
      success: true,
      allposts: data.data.posts,
      totalPages: data.data.totalPages,
    };
  } else {
    return { success: false };
  }
};

export const findAllpostupdate = async (
  searchQuery: string,
  Category: string,
  currentpage: number
) => {
  const { data } = await axios.get(
    `${API_USER_URL}/getupdate?search=${searchQuery}&category=${Category}&page=${currentpage}`
  );
  if (data.message === "getAllpostdetails") {
    return {
      success: true,
      allposts: data.data.posts,
      totalPages: data.data.totalPages,
    };
  } else {
    return { success: false };
  }
};


export const commentThePost = async (
  postId: string,
  userId: string,
  comment: string
) => {
    const { data } = await axiosClient.patch(`${API_USER_URL}/commentpost`, {
      postId,
      userId,
      comment,
    });
  if (data.message === "Post Commented succesfully") {
    return {
      success: true,
    };
  } else {
    return { success: false };
  }
};




export const reportThePost = async (postId: string, text: string, userId: string) => {
 const { data } = await axiosClient.patch(`${API_USER_URL}/reportpost`, {
   postId,
   text,
   userId,
 });
  if (data.message === "Post Reported succesfully") {
    return {
      success: true
    };
  } else {
    return { success: false };
  }
};




export const likeupdate = async (postId: string, userId: string) => {
       const { data } = await axiosClient.patch(`${API_USER_URL}/likepost`, {
         postId,
         userId,
       });
  if (data.message === "Post liked succesfully") {
    return {
      success: true,
      update: data.getupdate,
    };
  } else {
    return { success: false };
  }
};











export const getnotifications = async () => {
  const { data } = await axiosClient.get(`${API_CHAT_URL}/getnotifications`);
  if (data.message === "get all notifications") {
    return {
      success: true,
      notifications: data.notifications,
    };
  } else {
    return { success: false };
  }
};


export const getAllreplyinhome = async () => {
  const { data } = await axiosClient.get(`${API_USER_URL}/getreplys`);
  if (data.message === "get all reply comments") {
    return {
      success: true,
      getreply: data.posts,
    };
  } else {
    return { success: false };
  }
};






export const updatelastseen = async () => {
  const { data } = await axiosClient.patch(`${API_USER_URL}/updatelastseen`);
  if (data.message === "lastTime updated") {
    return {
      success: true,
    };
  } else {
    return { success: false };
  }
};


interface loginData {
  password: string;
  email: string;
}

 export const googleSignIn = async () => {
    window.location.href = "http://localhost:3000/auth";
  };


export const loginPage = async (values: loginData) => {
     const { data } = await axios.post(`${API_USER_URL}/login`, values);
     if(data.message === "user Login succesfully"){
        return {  
          success: true,
          Acesstoc: data.accesstok,
          Refreshtoc: data.refreshtok,
        };
     }else{
        return { success: false}
     }

}
