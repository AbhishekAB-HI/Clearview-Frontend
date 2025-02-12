import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_ADMIN_URL } from "../../Components/Constants/Constants";
import { IUser } from "../../Components/Interfaces/Interface";


export const updateUser = async (userId:string, isActive:boolean) => {
   const { data } = await axios.patch(`${API_ADMIN_URL}/blockusers`, {
     userId,
     isActive,
   });

   if(data.message==="User is blocked"){
    return { success: true };
   }else{
    return { success: false };
   }


};







const useFetchUsers = (
  currentPage: number,
  itemsPerPage: number,
  searchTerm: string,

) => {
  const [countPosts, setCountPosts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState<IUser[]>([]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${API_ADMIN_URL}/admindashboard?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`
      );
      if (data.message === "user data get succesfull") {
        setUsersList(data.userinfo);
        setCountPosts(data.userscount);
      } else {
        toast.error("No data found.");
      }
    } catch (error) {
      const message =
        axios.isAxiosError(error) && error.response
          ? error.response.data?.message || "Something went wrong."
          : "An unexpected error occurred.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  return { usersList, countPosts, loading, fetchUsers };
};

export default useFetchUsers;
