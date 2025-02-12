import { useEffect, useState } from "react";
import { IPost } from "../../Components/Interfaces/Interface";
import { API_ADMIN_URL } from "../../Components/Constants/Constants";
import axios from "axios";
import toast from "react-hot-toast";

export const deletethepost = async (id: string) => {
  const { data } = await axios.delete(`${API_ADMIN_URL}/deletepost/${id}`);
  if (data.message === "delete post") {
    return { success: true };
  } else {
    return { success: false, message: "delete post failed" };
  }

};

export const newsApiPost = (
  currentPage: number,
  postsPerPage: number,
  searchTerm: string
) => {
  const [getPost, setGetpost] = useState<IPost[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);

  const getAllPosts = async () => {
    try {
      const { data } = await axios.get(
        `${API_ADMIN_URL}/getposts?page=${currentPage}&limit=${postsPerPage}&search=${searchTerm}`
      );
      if (data.message === "All posts found") {
        setGetpost(data.data.posts);
        setTotalPosts(data.data.total);
      } else {
        toast.error("Post not found");
      }
    } catch (error) {
      toast.error("Failed to fetch posts.");
      console.error(error);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, [currentPage, searchTerm]);

  return { getPost,  totalPosts, getAllPosts };
};
