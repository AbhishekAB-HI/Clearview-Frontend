import { API_USER_URL, CONTENT_TYPE_MULTER } from "../../Components/Constants/Constants";
import axiosClient from "../Axiosinterseptor";


export const createNewPost = async (formdata: FormData) => {
    const {data} = await axiosClient.post(
      `${API_USER_URL}/createpost`,
      formdata,
      {
        headers: { "Content-Type": CONTENT_TYPE_MULTER },
      }
    );
    if(data.message ==="Post uploaded successfully"){
          return {
            success: true,
            userdetail: data.userinfo,
            postinfo: data.postdetail,
          };
    }else{
       return { success: false };   
    }
};





export const editpost = async (formdata: FormData) => {
    const { data } = await axiosClient.post(
      `${API_USER_URL}/editpost`,
      formdata,
      {
        headers: {
          "Content-Type": CONTENT_TYPE_MULTER,
        },
      }
    );
  if (data.message === "Post updated successfully") {
    return {
      success: true,
    };
  } else {
    return { success: false };
  }
};