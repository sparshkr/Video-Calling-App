import React from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleClick = () => {
    logout();
    navigate("/login");
  };
  return (
    <nav className="bg-[#1a1a1a] border-gray-200 dark:bg-gray-900">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
        <div className="flex items-center ml-auto space-x-6 rtl:space-x-reverse">
          {/* <p className="text-white">Email</p> */}
          <span className="text-white"> {user ? user.email : ""}</span>
          <button
            onClick={handleClick}
            className="text-sm text-white dark:text-blue-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
