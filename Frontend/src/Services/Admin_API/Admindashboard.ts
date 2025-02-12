import axios from "axios";
import { useState, useEffect } from "react";
import { API_ADMIN_URL } from "../../Components/Constants/Constants";
import { ICounts } from "../../Components/Interfaces/Interface";
export const useAdminDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [recentPosts, setRecentPosts] = useState<ICounts[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
         const { data } = await axios.get(`${API_ADMIN_URL}/userscounts`);
        if (data.message === "user and post data get succesfull") {
          setUserCount(data.userdata.totalUsers);
          setPostCount(data.userdata.totalPosts);
          setRecentPosts(data.recentPosts);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    loadDashboardData();
  }, []);

  return { userCount, postCount, recentPosts };
};
