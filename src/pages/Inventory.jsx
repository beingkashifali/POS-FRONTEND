import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {
  FaSearch,
  FaTag,
  FaList,
  FaDollarSign,
  FaBoxes,
  FaImage,
  FaEdit,
  FaTrash,
  FaPlus,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa"; // Added more icons for realism

function Inventory() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    image: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Realistic pagination
  const token = localStorage.getItem("token");

  const fetchProducts = async function () {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://pos-backend-3fgf.onrender.com/products",
        {
          headers: { Authorization: token },
        }
      );
      setProducts(res.data.products);
    } catch (err) {
      toast.error("Failed to fetch products");
      console.log(err);
    } finally {
      setLoading(false);
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
        `https://pos-backend-3fgf.onrender.com/products/${id}`,
        { headers: { Authorization: token } }
      );
      toast.success(deletedProduct.data.msg);
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product");
      console.log(err);
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const editHandler = function (product) {
    setEditId(product._id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      image: product.image || "",
    });
  };

  const cancelEditHandler = () => {
    setEditId(null);
    setForm({ name: "", category: "", price: "", quantity: "", image: "" });
  };

  const submitHandler = async function (e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        const updatedProduct = await axios.patch(
          `https://pos-backend-3fgf.onrender.com/products/${editId}`,
          form,
          { headers: { Authorization: token } }
        );
        toast.success(updatedProduct.data.msg);
      } else {
        const addProduct = await axios.post(
          "https://pos-backend-3fgf.onrender.com/products",
          form,
          { headers: { Authorization: token } }
        );
        toast.success(addProduct.data.msg);
      }
      cancelEditHandler();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error saving product");
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories for filter
  const categories = [...new Set(products.map((product) => product.category))];

  const filteredProducts = products.filter(
    (product) =>
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory === "" || product.category === selectedCategory)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Low stock products
  const lowStockProducts = products.filter((product) => product.quantity < 5);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-cyan-50 p-6">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
          Inventory Management
        </h2>

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-lg">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-400 mr-3" />
              <div>
                <p className="text-sm text-red-700">
                  <strong>Low Stock Alert:</strong> {lowStockProducts.length}{" "}
                  product(s) have less than 5 units in stock.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Add / Edit Form */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center mb-6">
            <FaPlus className="text-blue-600 text-2xl mr-3" />
            <h3 className="text-2xl font-semibold text-blue-600">
              {editId ? "Edit Product" : "Add New Product"}
            </h3>
          </div>

          <form
            onSubmit={submitHandler}
            className="grid grid-cols-1 md:grid-cols-6 gap-6 items-end"
          >
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2 items-center">
                <FaTag className="mr-2 text-gray-500" />
                Name
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                name="name"
                value={form.name}
                onChange={changeHandler}
                required
                placeholder="Product Name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaList className="mr-2 text-gray-500" />
                Category
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                name="category"
                value={form.category}
                onChange={changeHandler}
                required
                placeholder="e.g., Electronics"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 items-center">
                <FaDollarSign className="mr-2 text-gray-500" />
                Price ($)
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                name="price"
                value={form.price}
                onChange={changeHandler}
                required
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 items-center">
                <FaBoxes className="mr-2 text-gray-500" />
                Quantity
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                name="quantity"
                value={form.quantity}
                onChange={changeHandler}
                required
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 items-center">
                <FaImage className="mr-2 text-gray-500" />
                Image URL
              </label>
              <input
                type="url"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                name="image"
                value={form.image}
                onChange={changeHandler}
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 text-white p-3 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center ${
                  editId
                    ? "bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    : "bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
                {editId ? "Update" : "Add"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={cancelEditHandler}
                  className="bg-linear-to-r from-gray-500 to-gray-600 text-white p-3 rounded-lg hover:from-gray-600 hover:to-gray-700 font-semibold transition-all transform hover:scale-105"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Filter by Category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-blue-500 text-2xl" />
              <span className="ml-2 text-gray-600">Loading products...</span>
            </div>
          ) : (
            <>
              <table className="min-w-full leading-normal">
                <thead className="bg-linear-to-r from-gray-100 to-gray-200">
                  <tr>
                    <th className="px-6 py-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 object-cover rounded-lg shadow-sm"
                        />
                      </td>
                      <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                        <span className="bg-linear-to-r from-blue-100 to-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm font-semibold text-gray-900">
                        ${product.price}
                      </td>
                      <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                        <span
                          className={`font-bold ${
                            product.quantity < 5
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {product.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-5 border-b border-gray-200 bg-white text-sm">
                        <div className="flex gap-4">
                          <button
                            onClick={() => editHandler(product)}
                            className="text-indigo-600 hover:text-indigo-900 font-semibold transition-colors flex items-center"
                          >
                            <FaEdit className="mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(product._id)}
                            className="text-red-600 hover:text-red-900 font-semibold transition-colors flex items-center"
                          >
                            <FaTrash className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center py-4 bg-gray-50">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 mx-1 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="mx-4 text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 mx-1 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this product? This action cannot
                be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => deleteHandler(deleteId)}
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

export default Inventory;
