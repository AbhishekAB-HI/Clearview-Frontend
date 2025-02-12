import Loginpage from "./Components/UserSide/Loginpage.tsx";
import Registerpage from "./Components/UserSide/RegisterPage.tsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomeLoginPage from "./Components/UserSide/HomeLoginpage.tsx";
import ForgetPassPage from "./Components/UserSide/Forgetpasspage.tsx";
import AdminLoginpage from "./Components/AdminSide/AdminLogin.tsx";
import AdminHomePage from "./Components/AdminSide/Adminhome.tsx";
import { Toaster } from "react-hot-toast";
import UserLogoutPrivateRoute from "./ProtectiveRoute/UserLogoutProtective.ts";
import AdminprivateRoute from "./ProtectiveRoute/AdminPrivateRoute.ts";
import AdminLogoutprivateRoute from "./ProtectiveRoute/AdminLogout.ts";
import HomeProfilepage from "./Components/UserSide/Profilepage.tsx";
import Newsmanagement from "./Components/AdminSide/Newsmanagemant.tsx";
import MessagePage from "./Components/UserSide/Message.tsx";
import Reportmanagement from "./Components/AdminSide/ReportPost.tsx";
import ChatPage from "./Components/UserSide/ChatpageUI.tsx";
import RoomPage from "./Components/Zego-cloud/RoomPage.tsx";
import FollowersPage from "./Components/UserSide/FollowersPage.tsx";
import FollowingPage from "./Components/UserSide/Following.tsx";
import PeoplePage from "./Components/UserSide/PeoplePage.tsx";
import UserReportmanagement from "./Components/AdminSide/UserReportPage.tsx";
import GroupChatPage from "./Components/UserSide/GroupChatpage.tsx";
import AdminDashboard from "./Components/AdminSide/AdminDashboard.tsx";
import ViewProfilePage from "./Components/UserSide/ViewProfile.tsx";
import NotificationPage from "./Components/UserSide/NotificationPage.tsx";
import Otppage from "./Components/UserSide/otp.tsx";
import ForgetOtppage from "./Components/UserSide/forgotOtp.tsx";
import Forgetpassword from "./Components/UserSide/forgetpassword.tsx";
import "./index.css";
const App = () => {
  return (
    <>
      <Router>
        <Toaster position="top-center" />
        <Routes>
          <Route
            path="/register"
            element={<UserLogoutPrivateRoute element={<Registerpage />} />}
          />

          
          <Route
            path="/login"
            element={<UserLogoutPrivateRoute element={<Loginpage />} />}
          />
          <Route
            path="/"
            element={<UserLogoutPrivateRoute element={<Loginpage />} />}
          />
          <Route
            path="/verify-otp"
            element={<UserLogoutPrivateRoute element={<Otppage />} />}
          />
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/homepage" element={<HomeLoginPage />} />
          <Route path="/chatpage/:chatId/:dataId" element={<ChatPage />} />
          <Route
            path="/groupchatpage/:chatId/:dataId/:groupname"
            element={<GroupChatPage />}
          />
          <Route path="/profile" element={<HomeProfilepage />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
          <Route path="/editprofile" />
          <Route path="/message" element={<MessagePage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/following" element={<FollowingPage />} />
          <Route path="/followers" element={<FollowersPage />} />
          <Route path="/people" element={<PeoplePage />} />
          <Route path="/news" element={<Newsmanagement />} />
          <Route path="/reportpage" element={<Reportmanagement />} />
          <Route path="/userReportpage" element={<UserReportmanagement />} />
          <Route path="/viewProfile" element={<ViewProfilePage />} />
          <Route
            path="/forgetpass"
            element={<UserLogoutPrivateRoute element={<Forgetpassword />} />}
          />
          <Route
            path="/forgetotp"
            element={<UserLogoutPrivateRoute element={<ForgetOtppage />} />}
          />
          <Route
            path="/ForgetPassPage"
            element={<UserLogoutPrivateRoute element={<ForgetPassPage />} />}
          />
          <Route
            path="/Adminlogin"
            element={<AdminLogoutprivateRoute element={<AdminLoginpage />} />}
          />
          <Route
            path="/Adminhome"
            element={<AdminprivateRoute element={<AdminHomePage />} />}
          />
          <Route
            path="/Admindashboard"
            element={<AdminprivateRoute element={<AdminDashboard />} />}
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
