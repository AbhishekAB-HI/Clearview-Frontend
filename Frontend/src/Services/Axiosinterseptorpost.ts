import axios from "axios";
import { store } from "../Redux-store/reduxstore";
import {
  clearuserAccessTocken,
  setUserAccessTocken,
} from "../Redux-store/redux-slice";
import toast from "react-hot-toast";
import { CONTENT_TYPE_MULTER } from "../Components/Constants/Constants";

// ClientNew;
const axiosClientPost = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": CONTENT_TYPE_MULTER,
  },
});

axiosClientPost.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const accessToken = state.accessTocken.userTocken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClientPost.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const state = store.getState();
        const refreshToken = state.accessTocken.userRefreshTocken;

        if (refreshToken) {
          const { data } = await axios.post(
            "http://localhost:3000/auth/refreshtoken",
            { refreshToken }
          );

          store.dispatch(setUserAccessTocken(data.accessToken));

          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

          return axios(originalRequest);
        } else {
          console.error("No refresh token available");
        }
      } catch (refreshError) {
        console.error("Session has been expired", refreshError);
        store.dispatch(clearuserAccessTocken());
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    if (error.response && error.response.status === 403) {
      const errorCode = error.response.data.code;
      if (errorCode === "ACCOUNT_INACTIVE") {
        store.dispatch(clearuserAccessTocken());
        toast.error("Your account is Blocked. Please contact support.");
        window.location.href = "/login";
        return Promise.reject(
          new Error("Your account is inactive. Please contact support.")
        );
      } else if (errorCode === "NOT_VERIFIED") {
        return Promise.reject(
          new Error(
            "Mentor is not verified. Please complete the verification process."
          )
        );
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClientPost;
