import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaDollarSign, FaBoxOpen, FaReceipt } from "react-icons/fa";

function Dashboard() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);

  const userRole = localStorage.getItem("role");

  const fetchData = async function () {
    const token = localStorage.getItem("token");
    try {
      const salesData = await axios.get("http://localhost:8000/sales", {
        headers: { Authorization: token },
      });
      const productsData = await axios.get("http://localhost:8000/products", {
        headers: { Authorization: token },
      });
      setSales(salesData.data);
      setProducts(productsData.data.products);
    } catch (err) {
      console.log("Error fetching dashboard data", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const today = new Date().toDateString();
  const todaySales = sales
    .filter((sale) => new Date(sale.createdAt).toDateString() === today)
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const isManager = userRole === "manager";

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-cyan-50 p-6">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
          {isManager ? "Manager Dashboard" : "Cashier Dashboard"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Today's Sales Card */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-linear-to-r from-blue-500 to-blue-600 rounded-full">
                <FaDollarSign className="text-white text-2xl" />
              </div>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {isManager ? "Total Store Sales Today" : "My Sales Today"}
              </span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mt-2">
              ${todaySales.toFixed(2)}
            </p>
            <div className="mt-4 h-2 bg-linear-to-r from-blue-400 to-blue-600 rounded-full"></div>
          </div>

          {/* Total Products Card */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-linear-to-r from-green-500 to-green-600 rounded-full">
                <FaBoxOpen className="text-white text-2xl" />
              </div>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Total Products
              </span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mt-2">
              {products.length}
            </p>
            <div className="mt-4 h-2 bg-linear-to-r from-green-400 to-green-600 rounded-full"></div>
          </div>

          {/* Total Transactions Card */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-linear-to-r from-purple-500 to-purple-600 rounded-full">
                <FaReceipt className="text-white text-2xl" />
              </div>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {isManager
                  ? "Total Store Transactions"
                  : "My Total Transactions"}
              </span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mt-2">
              {sales.length}
            </p>
            <div className="mt-4 h-2 bg-linear-to-r from-purple-400 to-purple-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
