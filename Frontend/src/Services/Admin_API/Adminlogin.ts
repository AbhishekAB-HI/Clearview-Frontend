import axios from "axios";
import { API_ADMIN_URL } from "../../Components/Constants/Constants";

export const adminLogin = async (email: string, password: string) => {
  try {

    const { data } = await axios.post(`${API_ADMIN_URL}/adminlogin`, {
      email,
      password,
    });

    if (data.message === "adminLogin succesfully") {
      return { success: true, token: data.AdminTocken };
    } else {
      return { success: false, message: "Admin login failed" };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      return { success: false, message: errorMessage };
    } else {
      return { success: false, message: "Unknown error occurred" };
    }
  }
};
