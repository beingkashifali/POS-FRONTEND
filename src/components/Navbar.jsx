import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaTachometerAlt,
  FaBoxOpen,
  FaUsers,
  FaHistory,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";

function Navbar({ userAuth, setUserAuth }) {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.clear();
    setUserAuth({ token: null, role: null, username: null });
    navigate("/login");
  };

  return (
    <nav className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl z-50 border-b border-gray-700">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-400">
          <Link
            to="/"
            className="flex items-center hover:text-blue-300 transition-colors"
          >
            <FaShoppingCart className="mr-2" />
            POS System
          </Link>
        </div>

        <div className="flex space-x-6 items-center">
          <Link
            to="/"
            className="hover:text-blue-300 transition-colors flex items-center"
          >
            <FaTachometerAlt className="mr-1" />
            Dashboard
          </Link>

          {userAuth.role === "cashier" && (
            <Link
              to="/pos"
              className="hover:text-blue-300 transition-colors flex items-center"
            >
              <FaShoppingCart className="mr-1" />
              POS
            </Link>
          )}

          {userAuth.role === "manager" && (
            <>
              <Link
                to="/inventory"
                className="hover:text-blue-300 transition-colors flex items-center"
              >
                <FaBoxOpen className="mr-1" />
                Inventory
              </Link>
              <Link
                to="/users"
                className="hover:text-blue-300 transition-colors flex items-center"
              >
                <FaUsers className="mr-1" />
                Users
              </Link>
            </>
          )}

          <Link
            to="/sales"
            className="hover:text-blue-300 transition-colors flex items-center"
          >
            <FaHistory className="mr-1" />
            History
          </Link>

          <div className="h-6 w-px bg-gray-600 mx-2"></div>

          <div className="flex text-right leading-tight items-center gap-1.5">
            <FaUser className="text-gray-400" />
            <span className="text-[14px] text-gray-400 uppercase mt-1">
              {userAuth.role}:
            </span>
            <span className="font-semibold">{userAuth.username || "User"}</span>
          </div>

          <button
            onClick={logoutHandler}
            className="bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-4 py-1 rounded text-sm font-medium transition-all transform hover:scale-105 shadow-lg flex items-center"
          >
            <FaSignOutAlt className="mr-1" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
