import React, { useEffect, useState } from "react";
import axios from "axios";

function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [filterCashier, setFilterCashier] = useState("");
  const [uniqueCashiers, setUniqueCashiers] = useState([]);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const fetchSales = async function () {
    try {
      const res = await axios.get("http://localhost:8000/sales", {
        headers: { Authorization: token },
      });
      setSales(res.data);

      if (role === "manager") {
        const cashiers = [
          ...new Set(
            res.data
              .map((cashier) => cashier.cashierId?.username)
              .filter(Boolean)
          ),
        ];
        setUniqueCashiers(cashiers);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredSales = filterCashier
    ? sales.filter((s) => s.cashierId?.username === filterCashier)
    : sales;

  const totalRevenue = filteredSales.reduce(
    (acc, curr) => acc + curr.totalAmount,
    0
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {role === "manager" ? "All Sales Records" : "My Sales History"}
        </h2>

        <div className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow">
          <span className="block text-xs opacity-75 uppercase">
            {role === "manager" && filterCashier === ""
              ? "Total Store Revenue"
              : role === "manager"
              ? `Sales by ${filterCashier}`
              : "My Total Sales"}
          </span>
          <span className="text-xl font-bold">${totalRevenue.toFixed(2)}</span>
        </div>
      </div>

      {role === "manager" && (
        <div className="mb-6 bg-white p-4 rounded shadow border border-gray-200 flex items-center gap-4">
          <span className="text-gray-600 font-semibold">
            Filter by Cashier:
          </span>
          <select
            className="border p-2 rounded w-64 focus:outline-blue-500"
            value={filterCashier}
            onChange={(e) => setFilterCashier(e.target.value)}
          >
            <option value="">All Cashiers</option>
            {uniqueCashiers.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Cashier
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Items Sold
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Sale Total
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale) => (
              <tr
                key={sale._id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-5 py-5 bg-white text-sm">
                  {new Date(sale.createdAt).toLocaleString()}
                </td>
                <td className="px-5 py-5 bg-white text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      role === "manager"
                        ? "bg-indigo-100 text-indigo-800"
                        : "text-gray-700"
                    }`}
                  >
                    {sale.cashierId?.username || "Unknown"}
                  </span>
                </td>
                <td className="px-5 py-5 bg-white text-sm text-gray-500 max-w-xs truncate">
                  {sale.products
                    .map((p) => `${p.name} (x${p.quantity})`)
                    .join(", ")}
                </td>
                <td className="px-5 py-5 bg-white text-sm font-bold text-green-600">
                  ${sale.totalAmount}
                </td>
              </tr>
            ))}

            {filteredSales.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No sales records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesHistory;
