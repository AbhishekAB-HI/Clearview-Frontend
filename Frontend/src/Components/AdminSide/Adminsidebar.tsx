import { FaRegFileAlt, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { clearAdminAccessTocken } from "../../Redux-store/redux-slice.ts";
import { useDispatch } from "react-redux";
import { Home, Users } from "lucide-react";
const Adminsidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    try {
      dispatch(clearAdminAccessTocken());
      localStorage.removeItem("admintocken");
      navigate("/Adminlogin");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <aside className="mt-24 ml-5 fixed top-0 left-0 h-full w-1/5">
        <nav className="space-y-2 flex flex-col py-6">
          {[
            {
              icon: <Home size={24} />,
              text: "Dashboard",
              path: "/Admindashboard",
            },
            {
              icon: <Users size={24} />,
              text: "User Management",
              path: "/Adminhome",
            },
            {
              icon: <FaRegFileAlt size={24} />,
              text: "News Management",
              path: "/news",
            },
            {
              icon: <FaRegFileAlt size={24} />,
              text: "News Report Management",
              path: "/reportpage",
            },
            {
              icon: <FaRegFileAlt size={24} />,
              text: "User Report Management",
              path: "/userReportpage",
            },
            {
              icon: <FaSignOutAlt size={24} />,
              text: "Log out",
              button: handleLogout,
            },
          ].map((item, index) =>
            item.path ? (
              // For links
              <Link
                key={index}
                to={item.path}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg
          hover:bg-gray-800 transition-all duration-200
          group relative overflow-hidden"
              >
                <div
                  className="text-gray-400 group-hover:text-blue-500 
            transition-colors duration-200"
                >
                  {item.icon}
                </div>
                <span
                  className="text-gray-300 group-hover:text-white
            transition-colors duration-200 text-sm font-medium"
                >
                  {item.text}
                </span>
                <div
                  className="absolute inset-y-0 left-0 w-1 bg-blue-600 
            transform -translate-x-full group-hover:translate-x-0
            transition-transform duration-200"
                />
              </Link>
            ) : (
              // For buttons
              <button
                key={index}
                onClick={item.button}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg
          hover:bg-gray-800 transition-all duration-200
          group relative overflow-hidden w-full text-left"
              >
                <div
                  className="text-gray-400 group-hover:text-blue-500 
            transition-colors duration-200"
                >
                  {item.icon}
                </div>
                <span
                  className="text-gray-300 group-hover:text-white
            transition-colors duration-200 text-sm font-medium"
                >
                  {item.text}
                </span>
                <div
                  className="absolute inset-y-0 left-0 w-1 bg-blue-600 
            transform -translate-x-full group-hover:translate-x-0
            transition-transform duration-200"
                />
              </button>
            )
          )}
        </nav>
      </aside>
    </div>
  );
};

export default Adminsidebar;
