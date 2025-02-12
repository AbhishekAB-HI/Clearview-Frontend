import { useEffect, useState } from "react";
import { IReportpost } from "../../Components/Interfaces/Interface2";
import axios from "axios";
import { API_ADMIN_URL } from "../../Components/Constants/Constants";
import toast from "react-hot-toast";

 export const deletetheReportpost = async (id:string, postid:string) => {
  const { data } = await axios.delete(`${API_ADMIN_URL}/deleteReportpost?id=${id}&&postid=${postid}`);
       if(data.message === "delete post"){
              return {success:true}
       }else{
           return { success: false };
       }
};

export const ReportPostApi = (currentPage: number, postsPerPage: number) => {
  const [totalPosts, setTotalPosts] = useState(0);
  const [getPost, setGetpost] = useState<IReportpost[]>([]);

  const getAllPost = async () => {
    try {
      const { data } = await axios.get(
        `${API_ADMIN_URL}/getreportposts?page=${currentPage}&limit=${postsPerPage}`
      );
      if (data.message === "All posts found") {
        setGetpost(data.data.posts);
        setTotalPosts(data.data.total);
      } else {
        toast.error("Post found fails");
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


  useEffect(() => {
    getAllPost()
  }, [currentPage]);


  return { totalPosts, getPost, getAllPost };



};