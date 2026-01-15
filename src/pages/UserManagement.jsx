import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "cashier",
  });

  const token = localStorage.getItem("token");

  const fetchUsers = async function () {
    try {
      const res = await axios.get("http://localhost:8000/users", {
        headers: { Authorization: token },
      });
      setUsers(res.data);
    } catch (err) {
      toast.error(err.response.data.msg);
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
    try {
      const res = await axios.post(
        "http://localhost:8000/users/register",
        form,
        {
          headers: { Authorization: token },
        }
      );
      toast.success(res.data.msg);
      fetchUsers();
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  };

  const deleteHandler = async function (id) {
    if (!window.confirm("Delete this user?")) return;
    try {
      const deletedProduct = await axios.delete(
        `http://localhost:8000/users/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      toast.success(deletedProduct.data.msg);
      fetchUsers();
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Users</h2>

      {/* Add User Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-semibold mb-4">Add New Cashier</h3>
        <form className="flex gap-4 items-end" onSubmit={submitHandler}>
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Username</label>
            <input
              className="w-full border p-2 rounded"
              name="username"
              value={form.username}
              onChange={changeHandler}
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              className="w-full border p-2 rounded"
              type="password"
              name="password"
              value={form.password}
              onChange={changeHandler}
              required
            />
          </div>
          <div className="w-32">
            <label className="block text-sm text-gray-600 mb-1">Role</label>
            <select
              className="w-full border p-2 rounded"
              value={form.role}
              onChange={changeHandler}
            >
              <option value="cashier">Cashier</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold"
          >
            Add User
          </button>
        </form>
      </div>

      {/* User List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
                Username
              </th>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
                Role
              </th>
              <th className="px-5 py-3 border-b-2 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="px-5 py-5 bg-white text-sm font-medium">
                  {user.username}
                </td>
                <td className="px-5 py-5 bg-white text-sm capitalize">
                  {user.role}
                </td>
                <td className="px-5 py-5 bg-white text-sm">
                  <button
                    className="text-red-600 hover:text-red-900 font-semibold"
                    onClick={() => {
                      deleteHandler(user._id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;
