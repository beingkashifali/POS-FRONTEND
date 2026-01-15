import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });
  const [editId, setEditId] = useState(null);
  setEditId;
  const token = localStorage.getItem("token");

  const fetchProducts = async function () {
    try {
      const res = await axios.get("http://localhost:8000/products", {
        headers: { Authorization: token },
      });
      setProducts(res.data.products);
    } catch (err) {
      toast.error(err.response.data.msg);
      // console.log(err);
    }
  };
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeHandler = function (e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const deleteHandler = async function (id) {
    try {
      const deletedProduct = await axios.delete(
        `http://localhost:8000/products/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      toast.success(deletedProduct.data.msg);
      fetchProducts();
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  };

  const editHandler = function (product) {
    setEditId(product._id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
    });
  };

  const cancelEditHandler = () => {
    setEditId(null);
    setForm({ name: "", category: "", price: "", quantity: "" });
  };

  const submitHandler = async function (e) {
    e.preventDefault();
    try {
      if (editId) {
        const updatedProduct = await axios.patch(
          `http://localhost:8000/products/${editId}`,
          form,
          {
            headers: { Authorization: token },
          }
        );
        toast.success(updatedProduct.data.msg);
      } else {
        const addProduct = await axios.post(
          "http://localhost:8000/products",
          form,
          {
            headers: { Authorization: token },
          }
        );
        toast.success(addProduct.data.msg);
      }
      setEditId(null);
      setForm({ name: "", category: "", price: "", quantity: "" });
      fetchProducts();
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Inventory Management
      </h2>

      {/* Add / Edit Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-blue-600">
          {editId ? "Edit Product" : "Add New Product"}
        </h3>

        <form
          onSubmit={submitHandler}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
        >
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">
              Product Name
            </label>
            <input
              className="w-full border p-2 rounded focus:outline-blue-500 border-gray-300"
              name="name"
              value={form.name}
              onChange={changeHandler}
              placeholder="e.g. Wireless Mouse"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Category</label>
            <input
              className="w-full border p-2 rounded focus:outline-blue-500 border-gray-300"
              name="category"
              value={form.category}
              onChange={changeHandler}
              placeholder="e.g. Electronics"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              className="w-full border p-2 rounded focus:outline-blue-500 border-gray-300"
              name="price"
              value={form.price}
              onChange={changeHandler}
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Quantity</label>
            <input
              type="number"
              className="w-full border p-2 rounded focus:outline-blue-500 border-gray-300"
              name="quantity"
              value={form.quantity}
              onChange={changeHandler}
              placeholder="0"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              className={`flex-1 text-white p-2 rounded font-semibold transition
                ${
                  editId
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {editId ? "Update" : "Add"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={cancelEditHandler}
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 font-semibold"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mb-6 relative max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search products by name or category..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300  leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out shadow-sm text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product List Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
                Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
                Category
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
                Price
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
                Stock
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-medium">
                  {product.name}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {product.category}
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  ${product.price}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span
                    className={
                      product.quantity < 5
                        ? "text-red-600 font-bold"
                        : "text-gray-900"
                    }
                  >
                    {product.quantity}
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm flex gap-3">
                  <button
                    onClick={() => editHandler(product)}
                    className="text-indigo-600 hover:text-indigo-900 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteHandler(product._id)}
                    className="text-red-600 hover:text-red-900 font-semibold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="5" className="px-5 py-5 text-center text-gray-500">
                  No products found. Add one above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventory;
