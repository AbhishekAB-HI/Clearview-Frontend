import { useEffect, useState } from "react";
import { IReportUser } from "../../Components/Interfaces/Interface";
import axios from "axios";
import toast from "react-hot-toast";
import { API_ADMIN_URL } from "../../Components/Constants/Constants";


export const deleteReportpost =async(id:string)=>{
      const { data } = await axios.delete(
        `${API_ADMIN_URL}/deleteReportpost/${id}`
      );
      if(data.message==="delete post"){
         return {success:true}
      }else{
         return { success: false };
      }
        
}


 export const reporttheuser =()=>{
      const [getPost, setGetpost] = useState<IReportUser[]>([]);

 const getAllPost = async () => {
   try {
     const { data } = await axios.get(`${API_ADMIN_URL}/getreportusers`);
     if (data.message === "All user found") {
       setGetpost(data.Reports);
     } else {
       toast.error("No user found");
     }
   } catch (error) {
     if (axios.isAxiosError(error)) {
       const errorMessage =
         error.response?.data?.message || "An error occurred";
       toast.error(errorMessage);
     } else {
       toast.error("Unknown error occurred");
     }
     console.error("Error during login:", error);
   }
 };

 useEffect(()=>{
getAllPost()
 },[])

 return {  getPost, getAllPost };

 }