import { API_USER_URL, CONTENT_TYPE_MULTER } from "../../Components/Constants/Constants";
import axiosClient from "../Axiosinterseptor";



export const updatePassword =async (formData:FormData) => {
      const { data } = await axiosClient.patch(
        `${API_USER_URL}/updatePassword`,
        formData
      );

      if(data.message === "Update password"){
          return {success:true}
      }else{
          return { success: false };
      }
};


export const updateprofile = async (formData: FormData) => {
 const { data } = await axiosClient.post(
   `${API_USER_URL}/updateprofile`,
   formData,
   {
     headers: {
       "Content-Type": CONTENT_TYPE_MULTER,
     },
   }
 );

  if (data.message === "userupdated successfully") {
    return { success: true };
  } else {
    return { success: false };
  }
};