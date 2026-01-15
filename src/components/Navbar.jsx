import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ userAuth, setUserAuth }) {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.clear();
    setUserAuth({ token: null, role: null, username: null });
    navigate("/login");
  };

  return (
    <nav className=" bg-gray-900 text-white shadow-lg z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-400">
          <Link to="/">POS System</Link>
        </div>

        <div className="flex space-x-6 items-center">
          <Link to="/" className="hover:text-blue-300 transition">
            Dashboard
          </Link>

          {userAuth.role === "cashier" && (
            <Link to="/pos" className="hover:text-blue-300 transition">
              POS
            </Link>
          )}

          {userAuth.role === "manager" && (
            <>
              <Link to="/inventory" className="hover:text-blue-300 transition">
                Inventory
              </Link>
              <Link to="/users" className="hover:text-blue-300 transition">
                Users
              </Link>
            </>
          )}

          <Link to="/sales" className="hover:text-blue-300 transition">
            History
          </Link>

          <div className="h-6 w-px bg-gray-700 mx-2"></div>

          <div className="flex text-right leading-tight items-center gap-1.5">
            <span className="text-[14px] text-gray-400 uppercase mt-1 ">
              {userAuth.role}:
            </span>
            <span className="font-semibold">{userAuth.username || "User"}</span>
          </div>

          <button
            onClick={logoutHandler}
            className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
