import axios from "axios";
import { API_USER_URL } from "../../Components/Constants/Constants";

interface ForgetPasswordData {
  password: string;
  email: string;
}

export const forgetpassword = async (dataget: ForgetPasswordData) => {
  const { data } = await axios.patch(`${API_USER_URL}/forgetpassword`, dataget);
   if(data.message === "Password Changed successfully"){
         return { success: true };
   }else{
      return { success: false };
   }


};

interface ForgetemailData {

  email: string;
}

export const forgetmail = async (emaildata: ForgetemailData) => {
  const { data } = await axios.post(`${API_USER_URL}/forgetmail`, emaildata);
  if (data.message === "confirm user") {
    return { success: true, emaildetail: data.email };
  } else {
    return { success: false };
  }
};


export const verifyforgetotp = async (otp: string, email: string) => {
  const { data } = await axios.post(`${API_USER_URL}/verifyforgetotp`, {
    otp,
    email,
  });
  if (data.message === "confirm user") {
    return { success: true, emaildetail: data.email };
  } else {
    return { success: false };
  }
};


export const resendotp = async (email: string) => {
   let { data } = await axios.patch(`${API_USER_URL}/resend-otp`, { email });
  if (data.message === "resend otp successfully") {
    return { success: true};
  } else {
    return { success: false };
  }
};






