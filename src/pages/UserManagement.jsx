import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUser, FaLock, FaUserPlus, FaTrash, FaUsers } from "react-icons/fa";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "cashier",
  });
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchUsers = async function () {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://pos-backend-3fgf.onrender.com/users",
        {
          headers: { Authorization: token },
        }
      );
      setUsers(res.data);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeHandler = function (e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const submitHandler = async function (e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "https://pos-backend-3fgf.onrender.com/users/register",
        form,
        {
          headers: { Authorization: token },
        }
      );
      toast.success(res.data.msg);
      setForm({ username: "", password: "", role: "cashier" });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const deleteHandler = async function () {
    try {
      const deletedUser = await axios.delete(
        `https://pos-backend-3fgf.onrender.com/users/${deleteId}`,
        {
          headers: { Authorization: token },
        }
      );
      toast.success(deletedUser.data.msg);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to delete user");
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-cyan-50 p-6">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight flex items-center justify-center">
          <FaUsers className="mr-3 text-blue-600" />
          User Management
        </h2>

        {/* Add New User Form */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center mb-6">
            <FaUserPlus className="text-blue-600 text-2xl mr-3" />
            <h3 className="text-2xl font-semibold text-blue-600">
              Add New User
            </h3>
          </div>

          <form
            className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
            onSubmit={submitHandler}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 items-center">
                <FaUser className="mr-2 text-gray-500" />
                Username
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                name="username"
                value={form.username}
                onChange={changeHandler}
                required
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 items-center">
                <FaLock className="mr-2 text-gray-500" />
                Password
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                type="password"
                name="password"
                value={form.password}
                onChange={changeHandler}
                required
                placeholder="Enter password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                name="role"
                value={form.role}
                onChange={changeHandler}
              >
                <option value="cashier">Cashier</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`bg-linear-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 font-semibold flex items-center justify-center ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <FaUserPlus className="mr-2" />
                  Add User
                </>
              )}
            </button>
          </form>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Loading users...</span>
            </div>
          ) : (
            <table className="min-w-full leading-normal">
              <thead className="bg-linear-to-r from-gray-100 to-gray-200">
                <tr>
                  <th className="px-6 py-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center">
                    <FaUser className="mr-2" />
                    Username
                  </th>
                  <th className="px-6 py-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm font-medium text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          user.role === "manager"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                      <button
                        onClick={() => confirmDelete(user._id)}
                        className="text-red-600 hover:text-red-900 font-semibold transition-colors flex items-center"
                      >
                        <FaTrash className="mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this user? This action cannot be
                undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={deleteHandler}
                  className="flex-1 bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
